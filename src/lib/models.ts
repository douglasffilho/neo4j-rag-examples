import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';

// ✅ Initialize Ollama Embeddings Model
export const embedings = new OllamaEmbeddings({
  model: 'nomic-embed-text',
  baseUrl: process.env.OPENAI_BASE_URL
});

// ✅ Initialize Ollama Natural Language Processing Model
export const nlp = new ChatOllama({
  temperature: 0,
  maxRetries: 2,
  model: process.env.OLLAMA_NPL_MODEL,
  baseUrl: process.env.OLLAMA_BASE_URL
});
