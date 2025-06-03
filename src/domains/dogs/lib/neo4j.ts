/* eslint no-console: off */
/* eslint  @typescript-eslint/no-explicit-any: off */

import { embedings } from '#src/lib/models';
import { Neo4jVectorStore } from '@langchain/community/vectorstores/neo4j_vector';
import { readFile } from 'fs/promises';
import { env } from 'process';

// ✅ Load Neo4j credentials from environment variables
const config = {
  url: env.NEO4J_HOST,
  username: env.NEO4J_USERNAME,
  password: env.NEO4J_PASSWORD,
  textNodeProperties: ['text'],
  searchType: 'vector',
  nodeLabel: 'Chunk',
  textNodeProperty: 'text',
  embeddingNodeProperty: 'embedding'
};

let dogsVectorStore: Neo4jVectorStore;

// ⚙️ Function to Initialize the Vector Store
export async function init() {
  console.log('🔍 Initializing Neo4j Vector Store');
  dogsVectorStore = await Neo4jVectorStore.fromExistingGraph(embedings, {
    ...config,
    indexName: 'dogs',
    keywordIndexName: 'dogs_keywords'
  } as any);

  const searchResults = await dogsVectorStore.query('MATCH (n:Chunk) RETURN n.text LIMIT 1');
  if (searchResults.length === 0) {
    console.log('🔍 Reading Documents');
    const documents = (await readFile('./src/domains/dogs/data/embeddings.txt', 'utf8'))
      .split('\n\n')
      .map((sentence) => ({
        pageContent: sentence.trim().replaceAll('\n', ''),
        metadata: {}
      }));

    console.log('🔍 Adding Documents');
    await dogsVectorStore.addDocuments(documents);
  }

  dogsVectorStore.close();
}

export async function getDogsVectorStore() {
  dogsVectorStore = await Neo4jVectorStore.fromExistingGraph(embedings, {
    ...config,
    indexName: 'dogs',
    keywordIndexName: 'dogs_keywords'
  } as any);

  return dogsVectorStore;
}
