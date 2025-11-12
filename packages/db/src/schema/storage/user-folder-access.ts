import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "../auth";
import { folder } from "./folder";

export const userFolderAccess = pgTable(
  "user_folder_access",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    folderId: text("folder_id")
      .notNull()
      .references(() => folder.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueUserFolder: unique().on(table.userId, table.folderId),
  })
);
