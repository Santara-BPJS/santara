/** biome-ignore-all lint/style/noMagicNumbers: TODO */
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

// Get conversations with cursor-based pagination (for infinite scroll)
export const getConversationsInputSchema = z.object({
  cursor: z.string().optional(), // timestamp cursor for pagination
  limit: z.number().min(1).max(100).default(20),
  query: z.string().optional(), // optional search query for filtering by title
});

export const getConversationsOutputSchema = z.object({
  conversations: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      lastMessage: z
        .object({
          content: z.string(),
          sender: z.enum(["user", "assistant"]),
          createdAt: z.date(),
        })
        .optional(),
    })
  ),
  nextCursor: z.string().optional(),
  hasMore: z.boolean(),
});

// Get specific conversation with messages
export const getConversationInputSchema = z.object({
  conversationId: z.string(),
});

export const getConversationOutputSchema = z.object({
  conversation: z.object({
    id: z.string(),
    title: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  messages: z.array(
    z.object({
      id: z.string(),
      content: z.string(),
      sender: z.enum(["user", "assistant"]),
      sources: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            filename: z.string(),
          })
        )
        .optional(),
      createdAt: z.date(),
    })
  ),
});

// Delete conversation
export const deleteConversationInputSchema = z.object({
  conversationId: z.string(),
});

// Update conversation (e.g., rename)
export const updateConversationInputSchema = z.object({
  conversationId: z.string(),
  title: z.string().min(1).max(200),
});
