import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth";
import { folder } from "./folder";

export const file = pgTable("file", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  folderId: text("folder_id")
    .references(() => folder.id, {
      onDelete: "cascade",
    })
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
