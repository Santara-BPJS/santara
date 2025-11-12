import z from "zod";

export const chatInputSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
});

export const chatResponseSchema = z.object({
  answer: z.string(),
  sources: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      filename: z.string(),
    })
  ),
  conversationId: z.string(),
});

export type AIChatResponse = {
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    filename: string;
  }>;
  conversation_id: string;
};
