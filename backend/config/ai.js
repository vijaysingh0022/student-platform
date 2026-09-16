import OpenAI from "openai";

/**
 * Returns an OpenAI client configured for either OpenAI or OpenRouter
 * based on the API key format and environment variables.
 */
export const getAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY || "";
  if (!apiKey) {
    console.warn("⚠️ OPENAI_API_KEY is not set. Please add it to your Render Environment Variables.");
  }

  const isOpenRouter =
    apiKey.startsWith("sk-or-") ||
    (process.env.OPENAI_BASE_URL && process.env.OPENAI_BASE_URL.includes("openrouter"));

  const baseURL =
    process.env.OPENAI_BASE_URL || (isOpenRouter ? "https://openrouter.ai/api/v1" : undefined);

  const referer =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.APP_URL ||
    "https://student-platform.onrender.com";

  return new OpenAI({
    apiKey,
    baseURL,
    defaultHeaders: isOpenRouter
      ? {
          "HTTP-Referer": referer,
          "X-Title": "LearnX Student Platform AI Tutor",
        }
      : undefined,
  });
};

/**
 * Returns the appropriate model identifier depending on provider
 */
export const getAIModel = () => {
  if (process.env.AI_MODEL) {
    return process.env.AI_MODEL;
  }
  const apiKey = process.env.OPENAI_API_KEY || "";
  const isOpenRouter =
    apiKey.startsWith("sk-or-") ||
    (process.env.OPENAI_BASE_URL && process.env.OPENAI_BASE_URL.includes("openrouter"));

  return isOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini";
};
