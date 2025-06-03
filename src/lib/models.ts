import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import { env } from 'process';

// ✅ Initialize Ollama Embeddings Model
export const embedings = new OllamaEmbeddings({
  model: env.OLLAMA_EMBEDDINGS_MODEL,
  baseUrl: env.OPENAI_BASE_URL
});

// ✅ Initialize Ollama Natural Language Processing Model
export const nlp = new ChatOllama({
  temperature: 0,
  maxRetries: 2,
  model: env.OLLAMA_NLP_MODEL,
  baseUrl: env.OLLAMA_BASE_URL
});
