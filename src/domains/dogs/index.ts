import { newRoute } from '#src/lib/http'
import { nlp } from '#src/lib/models'
import { RouterOptions } from '#src/lib/schema'
import { Handler } from 'hono'
import prompts from './data/prompts'
import { getDogsVectorStore } from './lib/neo4j'
import { AnswerQuestionAboutDogsRequest, AnswerQuestionAboutDogsResponse, AnswerQuestionAboutDogsResponseSchema, AnswerQuestionAboutDogsSchema } from './lib/schema'

const routeOptions: RouterOptions = {
    method: 'post',
    path: '/dogs/answer',
    description: 'Answer a question about dogs',
    tags: ['Dogs'],
    schemas: {
        body: AnswerQuestionAboutDogsSchema,
        response: AnswerQuestionAboutDogsResponseSchema
    },
    responseStatusCode: 200,
    authType: 'Bearer'
}

const handler: Handler = async (ctx) => {
    try {
        const { question } = await ctx.req.json<AnswerQuestionAboutDogsRequest>()

        const response = await answerQuestionAboutDogs(question)

        return ctx.json<AnswerQuestionAboutDogsResponse>({ answer: response }, 200)
    } catch (err) {
        return ctx.json({ error: err }, 500)
    }
}

export default newRoute(routeOptions, handler)

// ✅ Function to Answer Questions Based on Stored Context about Dogs
async function answerQuestionAboutDogs(question: string): Promise<string> {
    const dogsVectorStore = await getDogsVectorStore();

    const results = await dogsVectorStore.similaritySearchWithScore(question, 1);
    await dogsVectorStore.close();

    const relevantChunks = results
        .map((result) => result[0]?.pageContent?.replaceAll('text: ', ''))
        .filter(Boolean);

    if (relevantChunks.length === 0) {
        console.log('⚠️ No relevant context found.');
        const response = "🔴 Sorry, I couldn't find enough information to answer."
        console.log(response);
        return response;
    }

    const context = relevantChunks.join('. ');

    // console.log('🔍 Context', context);
    console.log('🔍 Question', question);

    const prompt = await prompts.nlpToDogsAnswer(context, question);
    // console.log('🔍 Prompt', prompt);

    const response = await nlp.invoke(prompt);

    console.log('✅ Response', response.content.toString());

    return response.content.toString()
}
