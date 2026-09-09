import OpenAI from "openai";

/**
 * Returns an OpenAI client configured for either OpenAI or OpenRouter
 * based on the API key format and environment variables.
 */
export const getAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY || "";
  const isOpenRouter = apiKey.startsWith("sk-or-") || (process.env.OPENAI_BASE_URL && process.env.OPENAI_BASE_URL.includes("openrouter"));
  
  const baseURL = process.env.OPENAI_BASE_URL || (isOpenRouter ? "https://openrouter.ai/api/v1" : undefined);

  return new OpenAI({
    apiKey,
    baseURL,
    defaultHeaders: isOpenRouter ? {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Student Platform AI Tutor"
    } : undefined
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
  const isOpenRouter = apiKey.startsWith("sk-or-") || (process.env.OPENAI_BASE_URL && process.env.OPENAI_BASE_URL.includes("openrouter"));
  
  return isOpenRouter ? "openai/gpt-4o-mini" : "gpt-4o-mini";
};
