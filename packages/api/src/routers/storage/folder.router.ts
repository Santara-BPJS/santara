import { ORPCError } from "@orpc/client";
import { db, enums, schema } from "@santara/db";
import { HTTP_STATUS_CODE, tryCatch } from "@santara/utils";
import { and, count, eq, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { o, protectedProcedure } from "../..";
import {
  createFolderInputSchema,
  deleteFolderInputSchema,
  listFoldersOutputSchema,
  updateFolderInputSchema,
} from "../../dtos";

export const folderRouter = o.prefix("/folders").router({
  findMany: protectedProcedure
    .route({
      method: "GET",
      path: "/",
      description: "Get all folders for the authenticated user",
      successStatus: 200,
    })
    .output(listFoldersOutputSchema)
    .handler(async () => {
      const { data: folderRecords, error } = await tryCatch(
        db
          .select({
            id: schema.folder.id,
            name: schema.folder.name,
            createdAt: schema.folder.createdAt,
            updatedAt: schema.folder.updatedAt,
            fileCount: count(schema.file.id),
            userId: schema.user.id,
            userRole: schema.user.role,
          })
          .from(schema.folder)
          .innerJoin(schema.user, eq(schema.folder.userId, schema.user.id))
          .leftJoin(
            schema.file,
            and(
              eq(schema.folder.id, schema.file.folderId),
              isNull(schema.file.deletedAt)
            )
          )
          .groupBy(
            schema.folder.id,
            schema.folder.name,
            schema.folder.createdAt,
            schema.folder.updatedAt,
            schema.user.id,
            schema.user.role
          )
      );
      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch folders",
          cause: error,
        });
      }

      const folders = folderRecords.map((row) => ({
        id: row.id,
        name: row.name,
        fileCount: row.fileCount,
        user: {
          id: row.userId,
          role: enums.getRoleByIdx(row.userRole)?.label || "-",
        },
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));

      return { folders };
    }),

  create: protectedProcedure
    .route({
      method: "POST",
      path: "/",
      description: "Create a folder",
      successStatus: 201,
    })
    .input(createFolderInputSchema)
    .handler(async ({ input, context }) => {
      const { error } = await tryCatch(
        db.insert(schema.folder).values({
          id: nanoid(),
          name: input.name,
          userId: context.session.user.id,
        })
      );
      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to create folder",
          cause: error,
          data: { input },
        });
      }

      return;
    }),
  update: protectedProcedure
    .route({
      method: "PUT",
      path: "/{folderId}",
      description: "Update a folder",
      successStatus: 200,
    })
    .input(updateFolderInputSchema)
    .handler(async ({ input }) => {
      const { error } = await tryCatch(
        db
          .update(schema.folder)
          .set({ name: input.name })
          .where(eq(schema.folder.id, input.folderId))
      );
      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to update folder",
          cause: error,
          data: { input },
        });
      }

      return;
    }),
  delete: protectedProcedure
    .route({
      method: "DELETE",
      path: "/{folderId}",
      description: "Delete a folder",
      successStatus: 204,
    })
    .input(deleteFolderInputSchema)
    .handler(async ({ input }) => {
      const { error } = await tryCatch(
        db.delete(schema.folder).where(eq(schema.folder.id, input.folderId))
      );
      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to delete folder",
          cause: error,
          data: {
            input,
          },
        });
      }

      return;
    }),
});
