import { nlp } from "#src/lib/models";
import { getDogsVectorStore } from "./neo4j";
import prompts from "./prompts";

// ✅ Function to Answer Questions Based on Stored Context about Dogs
export async function answerQuestionAboutDogs(question: string): Promise<void> {
    const dogsVectorStore = await getDogsVectorStore();

    const results = await dogsVectorStore.similaritySearchWithScore(question, 1);
    await dogsVectorStore.close();

    const relevantChunks = results
        .map((result) => result[0]?.pageContent?.replaceAll('text: ', ''))
        .filter(Boolean);

    if (relevantChunks.length === 0) {
        console.log('⚠️ No relevant context found.');
        console.log("🔴 Sorry, I couldn't find enough information to answer.");
        return;
    }

    const context = relevantChunks.join('. ');

    // console.log('🔍 Context', context);
    console.log('🔍 Question', question);

    const prompt = await prompts.nlpToDogsAnswer(context, question);
    // console.log('🔍 Prompt', prompt);

    const response = await nlp.invoke(prompt);

    console.log('✅ Response', response.content.toString());
}
