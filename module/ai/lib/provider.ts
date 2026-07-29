import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { google } from '@ai-sdk/google';
import { LanguageModel, EmbeddingModel } from 'ai';

/**
 * Returns the AI model to use for text generation based on environment variables.
 * Defaults to openai-compatible (gpt-4o-mini).
 */
export function getAIModel(): LanguageModel {
  const provider = process.env.AI_PROVIDER || 'openai-compatible';
  
  if (provider === 'google') {
    return google(process.env.GOOGLE_AI_MODEL || 'gemini-1.5-pro-latest');
  }

  // Default to OpenAI Compatible
  const openaiCompatible = createOpenAICompatible({
    baseURL: process.env.OPENAI_COMPATIBLE_BASE_URL || 'http://localhost:8080/v1',
    name: 'openai-compatible',
    apiKey: process.env.OPENAI_COMPATIBLE_API_KEY,
  });

  return openaiCompatible.chatModel(process.env.OPENAI_COMPATIBLE_MODEL || 'gpt-4o-mini');
}

/**
 * Returns the Embedding model to use based on environment variables.
 * Defaults to google (gemini-embedding-001) for backward compatibility.
 */
export function getEmbeddingModel(): EmbeddingModel {
  const provider = process.env.AI_EMBEDDING_PROVIDER || 'google';

  if (provider === 'openai-compatible') {
    const openaiCompatible = createOpenAICompatible({
      baseURL: process.env.OPENAI_COMPATIBLE_BASE_URL || 'http://localhost:8080/v1',
      name: 'openai-compatible',
      apiKey: process.env.OPENAI_COMPATIBLE_API_KEY,
    });
    return openaiCompatible.textEmbeddingModel(process.env.OPENAI_COMPATIBLE_EMBEDDING_MODEL || 'text-embedding-3-small');
  }

  // Default to Google
  return google.embeddingModel(process.env.GOOGLE_EMBEDDING_MODEL || 'gemini-embedding-001');
}
