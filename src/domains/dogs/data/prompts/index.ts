import { ChatPromptTemplate } from '@langchain/core/prompts';
import { readFile } from 'fs/promises';

const nlpToDogsAnswer = await readFile('./src/domains/dogs/data/prompts/nlpToDogsAnswer.md', 'utf8');

export default {
  async nlpToDogsAnswer(context: string, question: string): Promise<string> {
    return ChatPromptTemplate.fromTemplate(nlpToDogsAnswer)
      .invoke({
        context,
        question
      })
      .then((result) => result.messages.map((msg) => msg.content).join('. '));
  }
};
