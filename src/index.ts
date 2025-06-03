import { answerQuestionAboutDogs } from './domains/dogs';
import { init } from './domains/dogs/neo4j';

export default async function run() {
  await init();

  await answerQuestionAboutDogs('Which dog is bigger?');
}

run();
