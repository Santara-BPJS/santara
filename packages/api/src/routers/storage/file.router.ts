import { ORPCError } from "@orpc/client";
import { db, schema } from "@santara/db";
import {
  getFileCategory,
  s3StorageProvider,
  sanitizeFilename,
  validateFileSize,
  validateMimeType,
} from "@santara/storage";
import { HTTP_STATUS_CODE, tryCatch } from "@santara/utils";
import { and, eq, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { o, protectedProcedure } from "../..";
import {
  createFileInputSchema,
  deleteFileInputSchema,
  listFilesInputSchema,
  listFilesOutputSchema,
} from "../../dtos";

export const fileRouter = o.prefix("/files").router({
  findMany: protectedProcedure
    .route({
      method: "GET",
      path: "/",
      description: "List all files",
    })
    .input(listFilesInputSchema)
    .output(listFilesOutputSchema)
    .handler(async ({ input }) => {
      const { data: files, error } = await tryCatch(
        db
          .select()
          .from(schema.file)
          .where(
            and(
              isNull(schema.file.deletedAt),
              eq(schema.file.folderId, input.folderId)
            )
          )
      );
      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch files",
          cause: error,
        });
      }
      return { files };
    }),
  create: protectedProcedure
    .route({
      method: "POST",
      path: "/",
      description: "Upload a file",
      successStatus: 201,
    })
    .input(createFileInputSchema)
    .handler(async ({ input, context }) => {
      const { data: folderRecords, error: fetchFolderError } = await tryCatch(
        db
          .select()
          .from(schema.folder)
          .where(eq(schema.folder.id, input.folderId))
          .limit(1)
      );
      if (fetchFolderError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to fetch folder",
          cause: fetchFolderError,
          data: input,
        });
      }

      if (!folderRecords[0]) {
        throw new ORPCError("BAD_REQUEST", {
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Folder does not exist",
          data: input,
        });
      }

      const mimeType = input.file.type;
      const isMimeTypeValid = validateMimeType(mimeType);
      if (!isMimeTypeValid) {
        throw new ORPCError("BAD_REQUEST", {
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Invalid file type",
          data: { mimeType },
        });
      }

      const fileSize = input.file.size;
      const isFileSizeValid = validateFileSize(fileSize, mimeType);
      if (!isFileSizeValid) {
        throw new ORPCError("BAD_REQUEST", {
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "File size exceeds the allowed limit",
          data: { fileSize, mimeType },
        });
      }

      const sanitizedFilename = sanitizeFilename(input.file.name);
      const fileCategory = getFileCategory(mimeType);

      const { data: uploadData, error } = await tryCatch(
        s3StorageProvider.upload({
          file: input.file,
          filename: sanitizedFilename,
          folder: folderRecords[0].id,
          mimeType,
        })
      );
      if (error) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: error.message || "Failed to upload file",
          cause: error,
          data: { filename: sanitizedFilename, folderId: folderRecords[0].id },
        });
      }

      const { error: dbError } = await tryCatch(
        db.insert(schema.file).values({
          id: nanoid(),
          name: sanitizedFilename,
          originalName: input.file.name,
          mimeType,
          size: fileSize,
          category: fileCategory,
          folderId: folderRecords[0].id,
          userId: context.session.user.id,
          path: uploadData.path,
          url: uploadData.url,
        })
      );
      if (dbError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to save file record",
          cause: dbError,
          data: {
            filename: sanitizedFilename,
            folderId: folderRecords[0].id,
          },
        });
      }

      return;
    }),
  delete: protectedProcedure
    .route({
      method: "DELETE",
      path: "/{fileId}",
    })
    .input(deleteFileInputSchema)
    .handler(async ({ input }) => {
      const { data: queryResult, error: deleteError } = await tryCatch(
        db
          .update(schema.file)
          .set({ deletedAt: new Date() })
          .where(eq(schema.file.id, input.fileId))
      );
      if (deleteError) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: "Failed to delete file",
          cause: deleteError,
          data: input,
        });
      }

      if (queryResult.rowCount === 0) {
        throw new ORPCError("NOT_FOUND", {
          status: HTTP_STATUS_CODE.NOT_FOUND,
          message: "File not found",
          data: input,
        });
      }

      return;
    }),
});
