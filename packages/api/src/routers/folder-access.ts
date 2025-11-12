import { ORPCError } from "@orpc/client";
import { db, schema } from "@santara/db";
import { HTTP_STATUS_CODE, tryCatch } from "@santara/utils";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  getUserFolderAccessInputSchema,
  getUserFolderAccessOutputSchema,
  updateUserFolderAccessInputSchema,
} from "../dtos/folder-access";
import { protectedProcedure } from "../index";

export const folderAccessRouter = {
  getUserFolderAccess: protectedProcedure
    .input(getUserFolderAccessInputSchema)
    .output(getUserFolderAccessOutputSchema)
    .handler(async ({ input }) => {
      const { userId } = input;

      const { data: userRecords, error: userError } = await tryCatch(
        db.select().from(schema.user).where(eq(schema.user.id, userId)).limit(1)
      );

      if (userError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to verify user existence",
          cause: userError,
          data: input,
        });
      }

      const user = userRecords[0];
      if (!user) {
        throw new ORPCError("NOT_FOUND", {
          status: HTTP_STATUS_CODE.NOT_FOUND,
          message: "User not found",
        });
      }

      const { data: allFolders, error: foldersError } = await tryCatch(
        db
          .select({
            id: schema.folder.id,
            name: schema.folder.name,
            createdAt: schema.folder.createdAt,
            updatedAt: schema.folder.updatedAt,
          })
          .from(schema.folder)
      );

      if (foldersError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch folders",
          cause: foldersError,
        });
      }

      const { data: userAccess, error: accessError } = await tryCatch(
        db
          .select({ folderId: schema.userFolderAccess.folderId })
          .from(schema.userFolderAccess)
          .where(eq(schema.userFolderAccess.userId, userId))
      );

      if (accessError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch user folder access",
          cause: accessError,
        });
      }

      const accessibleFolderIds = new Set(userAccess.map((a) => a.folderId));

      const folders = allFolders.map((folder) => ({
        id: folder.id,
        name: folder.name,
        hasAccess: accessibleFolderIds.has(folder.id),
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
      }));

      return { folders };
    }),

  updateUserFolderAccess: protectedProcedure
    .input(updateUserFolderAccessInputSchema)
    .handler(async ({ input }) => {
      const { userId, folderIds } = input;

      const { data: userRecords, error: userError } = await tryCatch(
        db.select().from(schema.user).where(eq(schema.user.id, userId)).limit(1)
      );

      if (userError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to verify user existence",
          cause: userError,
          data: input,
        });
      }

      const user = userRecords[0];
      if (!user) {
        throw new ORPCError("NOT_FOUND", {
          status: HTTP_STATUS_CODE.NOT_FOUND,
          message: "User not found",
        });
      }

      const { error: deleteError } = await tryCatch(
        db
          .delete(schema.userFolderAccess)
          .where(eq(schema.userFolderAccess.userId, userId))
      );

      if (deleteError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to remove existing folder access",
          cause: deleteError,
        });
      }

      if (folderIds.length > 0) {
        const accessRecords = folderIds.map((folderId) => ({
          id: nanoid(),
          userId,
          folderId,
        }));

        const { error: insertError } = await tryCatch(
          db.insert(schema.userFolderAccess).values(accessRecords)
        );

        if (insertError) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            message: "Failed to grant folder access",
            cause: insertError,
          });
        }
      }

      return;
    }),
};
