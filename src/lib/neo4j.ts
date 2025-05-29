import { Neo4jVectorStore } from '@langchain/community/vectorstores/neo4j_vector';
import { Document } from '@langchain/core/documents';
import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import 'dotenv/config';
import { readFile } from 'fs/promises';
import { join } from 'path';

// ✅ Load Neo4j credentials from environment variables
const config = {
  url: process.env.NEO4J_URL,
  username: process.env.NEO4J_USERNAME,
  password: process.env.NEO4J_PASSWORD,
  textNodeProperties: ['text'],
  searchType: 'vector',
  nodeLabel: 'Chunk',
  textNodeProperty: 'text',
  embeddingNodeProperty: 'embedding'
};

// ✅ Initialize Ollama Embeddings Model
const ollamaEmbeddings = new OllamaEmbeddings({
  model: 'nomic-embed-text',
  baseUrl: process.env.OPENAI_BASE_URL
});

// ✅ Initialize Ollama Embeddings Model
const ollamaChat = new ChatOllama({
  temperature: 0,
  maxRetries: 2,
  model: process.env.OLLAMA_NPL_MODEL,
  baseUrl: process.env.OLLAMA_BASE_URL
});

export let dogsVectorStore: Neo4jVectorStore;

// ✅ Function to Add a Document to the Vector Store if it Doesn't Exist
async function addDocumentIfNotExists(vectorStore: Neo4jVectorStore, doc: Document) {
  const searchResults = await vectorStore.similaritySearch(doc.pageContent, 2);
  if (searchResults.length === 0) {
    console.log(`✅ Adding new document: "${doc.pageContent}"`);
    await vectorStore.addDocuments([doc]);
  }
}

// ✅ Function to Answer Questions Based on Stored Context
export async function answerQuestion(vectorStore: Neo4jVectorStore, question: string): Promise<string> {
  const results = await vectorStore.similaritySearchWithScore(question, 1);

  const relevantChunks = results
    .map((result) => result[0]?.pageContent?.replaceAll('text: ', ''))
    .filter(Boolean);

  if (relevantChunks.length === 0) {
    console.log('⚠️ No relevant context found.');
    return "Sorry, I couldn't find enough information to answer.";
  }

  const context = relevantChunks.join('\n');

  const prompt = `
        Answer the question concisely and naturally based on the following context:
        Don't use information outside of the provided context.

        Context:
        ${context}

        Question: ${question}

        Provide a direct and informative response:

    `;

  const response = await ollamaChat.invoke(prompt);

  return response.content.toString();
}

// ⚙️ Function to Initialize the Vector Store
export async function init() {
  console.log('🔍 Initializing Neo4j Vector Store');
  dogsVectorStore = await Neo4jVectorStore.fromExistingGraph(ollamaEmbeddings, {
    ...config,
    indexName: 'dogs',
    keywordIndexName: 'dogs_keywords'
  } as any);

  console.log('🔍 Reading Documents');
  const documents = (await readFile(join(__dirname, 'data', 'dogs_embeddings.txt'), 'utf8'))
    .split('\n')
    .map((sentence) => ({
      pageContent: sentence.trim(),
      metadata: {}
    }));

  console.log('🔍 Adding Documents');
  for (const doc of documents) {
    await addDocumentIfNotExists(dogsVectorStore, doc);
  }
}
