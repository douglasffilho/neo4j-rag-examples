import { answerQuestion, dogsVectorStore, init } from './lib/neo4j';

export default async function run() {
  await init();

  const response = await answerQuestion(dogsVectorStore, 'Which dog is the most aggressive?');
  
  console.log(response);
}

run();
