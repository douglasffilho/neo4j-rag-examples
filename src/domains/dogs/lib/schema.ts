import { z } from 'zod';

export const AnswerQuestionAboutDogsSchema = z.object({
  question: z.string()
});

export const AnswerQuestionAboutDogsResponseSchema = z.object({
  answer: z.string()
});

export type AnswerQuestionAboutDogsRequest = z.infer<typeof AnswerQuestionAboutDogsSchema>;
export type AnswerQuestionAboutDogsResponse = z.infer<typeof AnswerQuestionAboutDogsResponseSchema>;
