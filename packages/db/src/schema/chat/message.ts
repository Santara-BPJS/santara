import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { conversation } from "./conversation";

export const message = pgTable("message", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversation.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // "user" | "assistant"
  sources: jsonb("sources"), // Array of {id, title, filename}
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
