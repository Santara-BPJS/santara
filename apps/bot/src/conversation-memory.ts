import { Context, Effect, Layer } from "effect";
import type { ConversationMessage } from "./types";

// Configuration
const MAX_MESSAGES_PER_CHAT = 20;

// Conversation Memory Service interface
export class ConversationMemory extends Context.Tag("ConversationMemory")<
  ConversationMemory,
  {
    readonly addMessage: (
      chatId: string,
      message: ConversationMessage
    ) => Effect.Effect<void, never>;
    readonly getHistory: (
      chatId: string,
      limit?: number
    ) => Effect.Effect<readonly ConversationMessage[], never>;
    readonly clearHistory: (chatId: string) => Effect.Effect<void, never>;
    readonly getAllChats: Effect.Effect<readonly string[], never>;
  }
>() {}

// In-memory implementation
export const ConversationMemoryLive = Layer.sync(ConversationMemory, () => {
  // Store: chatId -> messages array
  const store = new Map<string, ConversationMessage[]>();

  return {
    addMessage: (chatId: string, message: ConversationMessage) =>
      Effect.sync(() => {
        const messages = store.get(chatId) ?? [];
        messages.push(message);

        // Keep only the most recent MAX_MESSAGES_PER_CHAT messages
        if (messages.length > MAX_MESSAGES_PER_CHAT) {
          messages.splice(0, messages.length - MAX_MESSAGES_PER_CHAT);
        }

        store.set(chatId, messages);
      }),

    getHistory: (chatId: string, limit?: number) =>
      Effect.sync(() => {
        const messages = store.get(chatId) ?? [];
        if (limit && limit > 0) {
          return messages.slice(-limit);
        }
        return messages;
      }),

    clearHistory: (chatId: string) =>
      Effect.sync(() => {
        store.delete(chatId);
      }),

    getAllChats: Effect.sync(() => Array.from(store.keys())),
  };
});
