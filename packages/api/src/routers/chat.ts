import { ORPCError } from "@orpc/client";
import { db, schema } from "@santara/db";
import { HTTP_STATUS_CODE, tryCatch } from "@santara/utils";
import { env } from "cloudflare:workers";
import { and, count, desc, eq, ilike, lt } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  chatInputSchema,
  chatResponseSchema,
  deleteConversationInputSchema,
  getConversationInputSchema,
  getConversationOutputSchema,
  getConversationsInputSchema,
  getConversationsOutputSchema,
  updateConversationInputSchema,
  type AIChatResponse,
} from "../dtos/chat";
import { protectedProcedure } from "../index";

// Helper function to generate conversation title from first message
function generateConversationTitle(message: string): string {
  const maxLength = 60;
  const trimmed = message.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength)}...`;
}

export const chatRouter = {
  sendMessage: protectedProcedure
    .input(chatInputSchema)
    .output(chatResponseSchema)
    .handler(async ({ input, context }) => {
      const { message, conversationId } = input;
      const userId = context.session.user.id;

      let conversationIdToUse = conversationId;

      // Create new conversation if conversationId is not provided
      if (conversationIdToUse) {
        // Verify conversation belongs to user (optimized with count)
        const { data: convCount, error: convErr } = await tryCatch(
          db
            .select({ count: count() })
            .from(schema.conversation)
            .where(
              and(
                eq(schema.conversation.id, conversationIdToUse),
                eq(schema.conversation.userId, userId)
              )
            )
        );

        if (convErr) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            message: "Failed to verify conversation",
            cause: convErr,
          });
        }

        if (!convCount || convCount[0]?.count === 0) {
          throw new ORPCError("NOT_FOUND", {
            status: HTTP_STATUS_CODE.NOT_FOUND,
            message: "Conversation not found",
          });
        }
      } else {
        conversationIdToUse = nanoid();

        const title = generateConversationTitle(message);

        const { error: createConvErr } = await tryCatch(
          db.insert(schema.conversation).values({
            id: conversationIdToUse,
            title,
            userId,
          })
        );

        if (createConvErr) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            message: "Failed to create conversation",
            cause: createConvErr,
          });
        }
      }

      // Save user message
      const userMessageId = nanoid();
      const { error: saveUserMsgErr } = await tryCatch(
        db.insert(schema.message).values({
          id: userMessageId,
          conversationId: conversationIdToUse,
          content: message,
          sender: "user",
          sources: null,
        })
      );

      if (saveUserMsgErr) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to save user message",
          cause: saveUserMsgErr,
        });
      }

      // Call Santara AI API
      const req = {
        query: message,
        conversationId: conversationIdToUse,
      };

      const { data: res, error: fetchErr } = await tryCatch(
        fetch(`${env.SANTARA_AI_API_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        })
      );

      if (fetchErr) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to connect to Santara AI API",
          cause: fetchErr,
          data: { req },
        });
      }

      const { data: json, error: jsonErr } = await tryCatch(
        res.json() as Promise<AIChatResponse>
      );

      if (jsonErr) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to parse response from Santara AI API",
          cause: jsonErr,
          data: { req, res },
        });
      }

      if (!res.ok) {
        throw new ORPCError("BAD_GATEWAY", {
          status: HTTP_STATUS_CODE.BAD_GATEWAY,
          message: "Santara AI API returned an error",
          data: { req, res: json },
        });
      }

      // Save assistant message
      const assistantMessageId = nanoid();
      const { error: saveAssistantMsgErr } = await tryCatch(
        db.insert(schema.message).values({
          id: assistantMessageId,
          conversationId: conversationIdToUse,
          content: json.answer,
          sender: "assistant",
          sources: json.sources as unknown as object,
        })
      );

      if (saveAssistantMsgErr) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to save assistant message",
          cause: saveAssistantMsgErr,
        });
      }

      const output = {
        answer: json.answer,
        sources: json.sources,
        conversationId: conversationIdToUse,
      };

      return output;
    }),

  getConversations: protectedProcedure
    .input(getConversationsInputSchema)
    .output(getConversationsOutputSchema)
    .handler(async ({ input, context }) => {
      const { cursor, limit, query } = input;
      const userId = context.session.user.id;

      // Build query with cursor-based pagination and optional search
      const conditions = [eq(schema.conversation.userId, userId)];
      if (cursor) {
        conditions.push(lt(schema.conversation.createdAt, new Date(cursor)));
      }
      if (query) {
        conditions.push(ilike(schema.conversation.title, `%${query}%`));
      }

      const { data: conversations, error: convErr } = await tryCatch(
        db
          .select({
            id: schema.conversation.id,
            title: schema.conversation.title,
            createdAt: schema.conversation.createdAt,
            updatedAt: schema.conversation.updatedAt,
          })
          .from(schema.conversation)
          .where(and(...conditions))
          .orderBy(desc(schema.conversation.createdAt))
          .limit(limit + 1) // Fetch one extra to check if there are more
      );

      if (convErr) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch conversations",
          cause: convErr,
        });
      }

      const hasMore = conversations.length > limit;
      const conversationsToReturn = hasMore
        ? conversations.slice(0, limit)
        : conversations;

      // Get last message for each conversation
      const conversationsWithLastMessage = await Promise.all(
        conversationsToReturn.map(async (conv) => {
          const { data: lastMessage } = await tryCatch(
            db
              .select({
                content: schema.message.content,
                sender: schema.message.sender,
                createdAt: schema.message.createdAt,
              })
              .from(schema.message)
              .where(eq(schema.message.conversationId, conv.id))
              .orderBy(desc(schema.message.createdAt))
              .limit(1)
          );

          return {
            ...conv,
            lastMessage: lastMessage?.[0]
              ? {
                  content: lastMessage[0].content,
                  sender: lastMessage[0].sender as "user" | "assistant",
                  createdAt: lastMessage[0].createdAt,
                }
              : undefined,
          };
        })
      );

      const nextCursor = hasMore
        ? conversationsToReturn.at(-1)?.createdAt.toISOString()
        : undefined;

      return {
        conversations: conversationsWithLastMessage,
        nextCursor,
        hasMore,
      };
    }),

  getConversation: protectedProcedure
    .input(getConversationInputSchema)
    .output(getConversationOutputSchema)
    .handler(async ({ input, context }) => {
      const { conversationId } = input;
      const userId = context.session.user.id;

      // Verify conversation belongs to user and fetch it
      const { data: conversationResult, error: convErr } = await tryCatch(
        db
          .select()
          .from(schema.conversation)
          .where(
            and(
              eq(schema.conversation.id, conversationId),
              eq(schema.conversation.userId, userId)
            )
          )
          .limit(1)
      );

      if (convErr) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch conversation",
          cause: convErr,
        });
      }

      if (!conversationResult || conversationResult.length === 0) {
        throw new ORPCError("NOT_FOUND", {
          status: HTTP_STATUS_CODE.NOT_FOUND,
          message: "Conversation not found",
        });
      }

      const conversation = conversationResult[0];
      if (!conversation) {
        throw new ORPCError("NOT_FOUND", {
          status: HTTP_STATUS_CODE.NOT_FOUND,
          message: "Conversation not found",
        });
      }

      // Fetch messages for this conversation
      const { data: messages, error: msgErr } = await tryCatch(
        db
          .select()
          .from(schema.message)
          .where(eq(schema.message.conversationId, conversationId))
          .orderBy(schema.message.createdAt)
      );

      if (msgErr) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch messages",
          cause: msgErr,
        });
      }

      return {
        conversation: {
          id: conversation.id,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
        },
        messages: messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender as "user" | "assistant",
          sources: msg.sources
            ? (msg.sources as Array<{
                id: string;
                title: string;
                filename: string;
              }>)
            : undefined,
          createdAt: msg.createdAt,
        })),
      };
    }),

  deleteConversation: protectedProcedure
    .input(deleteConversationInputSchema)
    .handler(async ({ input, context }) => {
      const { conversationId } = input;
      const userId = context.session.user.id;

      // Verify conversation belongs to user before deleting
      const { data: deleteResult, error: deleteErr } = await tryCatch(
        db
          .delete(schema.conversation)
          .where(
            and(
              eq(schema.conversation.id, conversationId),
              eq(schema.conversation.userId, userId)
            )
          )
      );

      if (deleteErr) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to delete conversation",
          cause: deleteErr,
        });
      }

      if (deleteResult.rowCount === 0) {
        throw new ORPCError("NOT_FOUND", {
          status: HTTP_STATUS_CODE.NOT_FOUND,
          message: "Conversation not found",
        });
      }

      return;
    }),

  updateConversation: protectedProcedure
    .input(updateConversationInputSchema)
    .handler(async ({ input, context }) => {
      const { conversationId, title } = input;
      const userId = context.session.user.id;

      const { data: updateResult, error: updateErr } = await tryCatch(
        db
          .update(schema.conversation)
          .set({ title, updatedAt: new Date() })
          .where(
            and(
              eq(schema.conversation.id, conversationId),
              eq(schema.conversation.userId, userId)
            )
          )
      );

      if (updateErr) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to update conversation",
          cause: updateErr,
        });
      }

      if (updateResult.rowCount === 0) {
        throw new ORPCError("NOT_FOUND", {
          status: HTTP_STATUS_CODE.NOT_FOUND,
          message: "Conversation not found",
        });
      }

      return;
    }),
};
