import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from multiple possible locations
if (!process.env.OPENAI_API_KEY) {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
  dotenv.config();
}

const isAnthropicKey = (key = "") => key.startsWith("sk-ant-");
const isOpenRouterKey = (key = "") =>
  key.startsWith("sk-or-") ||
  (process.env.OPENAI_BASE_URL && process.env.OPENAI_BASE_URL.includes("openrouter"));

// ─────────────────────────────────────────────────────────────────────────────
// Anthropic → OpenAI-compatible shim
// Wraps Anthropic SDK to expose the same `chat.completions.create()` interface
// that all controllers already use.
// ─────────────────────────────────────────────────────────────────────────────
class AnthropicCompatClient {
  constructor(apiKey) {
    this._client = new Anthropic({ apiKey });
  }

  get chat() {
    const client = this._client;
    return {
      completions: {
        async create({ model, messages, max_tokens = 1024, response_format }) {
          // Map OpenAI messages to Anthropic format
          const systemMsgs = messages.filter((m) => m.role === "system");
          const userMsgs = messages.filter((m) => m.role !== "system");
          const system = systemMsgs.map((m) => m.content).join("\n\n");

          // Add JSON instruction if response_format is json_object
          const jsonInstruction =
            response_format?.type === "json_object"
              ? "\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no extra text — just the raw JSON object."
              : "";

          const anthropicMessages = userMsgs.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          }));

          // Map model names: gpt-4o-mini → claude-3-5-haiku-latest
          const modelMap = {
            "gpt-4o-mini": "claude-3-5-haiku-latest",
            "gpt-4o": "claude-3-5-sonnet-latest",
            "openai/gpt-4o-mini": "claude-3-5-haiku-latest",
            "openai/gpt-4o": "claude-3-5-sonnet-latest",
          };
          const anthropicModel = modelMap[model] || "claude-3-5-haiku-latest";

          const response = await client.messages.create({
            model: anthropicModel,
            system: system + jsonInstruction,
            messages: anthropicMessages,
            max_tokens,
          });

          const text = response.content?.[0]?.text || "";

          // Return OpenAI-shaped response
          return {
            choices: [
              {
                message: {
                  role: "assistant",
                  content: text,
                },
                finish_reason: response.stop_reason,
              },
            ],
            model: response.model,
            usage: {
              prompt_tokens: response.usage?.input_tokens,
              completion_tokens: response.usage?.output_tokens,
            },
          };
        },
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getAIClient — returns either Anthropic shim or OpenAI client
// All controllers call this the same way; no changes needed in controllers.
// ─────────────────────────────────────────────────────────────────────────────
export const getAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY || "";

  if (!apiKey) {
    console.warn("⚠️  OPENAI_API_KEY is not set. AI features will use fallback responses.");
    return null;
  }

  if (isAnthropicKey(apiKey)) {
    console.log("✅ Using Anthropic Claude via compatibility shim.");
    return new AnthropicCompatClient(apiKey);
  }

  const isOR = isOpenRouterKey(apiKey);
  const baseURL =
    process.env.OPENAI_BASE_URL || (isOR ? "https://openrouter.ai/api/v1" : undefined);
  const referer =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.APP_URL ||
    "https://student-platform.onrender.com";

  return new OpenAI({
    apiKey,
    baseURL,
    timeout: 60000,
    maxRetries: 2,
    defaultHeaders: isOR
      ? {
          "HTTP-Referer": referer,
          "X-Title": "LearnX Student Platform AI Tutor",
        }
      : undefined,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// getAIModel — returns the appropriate model string
// ─────────────────────────────────────────────────────────────────────────────
export const getAIModel = () => {
  if (process.env.AI_MODEL) return process.env.AI_MODEL;

  const apiKey = process.env.OPENAI_API_KEY || "";
  if (isAnthropicKey(apiKey)) return "claude-3-5-haiku-latest";
  if (isOpenRouterKey(apiKey)) return "openrouter/free";
  return "gpt-4o-mini";
};
