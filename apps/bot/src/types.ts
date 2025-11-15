// Message role in conversation
export type MessageRole = "user" | "assistant" | "system";

// Single message in a conversation
export type ConversationMessage = {
  readonly timestamp: number;
  readonly sender: string;
  readonly role: MessageRole;
  readonly content: string;
};

// Cache entry with TTL
export type CacheEntry = {
  readonly response: string;
  readonly timestamp: number;
  readonly expiresAt: number;
};

// Chat metadata
export type ChatMetadata = {
  readonly chatId: string;
  readonly lastMessageAt: number;
  readonly messageCount: number;
};
