import { z } from "zod";
import { protectedProcedure } from "../index";

const chatRequestSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
});

const sourceReferenceSchema = z.object({
  id: z.string(),
  title: z.string(),
  filename: z.string(),
});

const chatResponseSchema = z.object({
  answer: z.string(),
  sources: z.array(sourceReferenceSchema),
  conversation_id: z.string(),
});

export const chatRouter = {
  sendMessage: protectedProcedure
    .input(chatRequestSchema)
    .output(chatResponseSchema)
    .mutation(async ({ input }) => {
      const aiApiUrl = process.env.SANTARA_AI_API_URL;

      try {
        const response = await fetch(`${aiApiUrl}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: input.message,
            conversation_id: input.conversationId,
          }),
        });

        if (!response.ok) {
          throw new Error(`AI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (_error) {
        return {
          answer:
            "Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.",
          sources: [],
          conversation_id: input.conversationId || `fallback_${Date.now()}`,
        };
      }
    }),
};
