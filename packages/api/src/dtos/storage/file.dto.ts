import z from "zod";

export const fileResponseSchema = z.object({
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  size: z.number(),
  id: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  path: z.string(),
  url: z.string(),
  userId: z.string(),
  folderId: z.string(),
  // looseen type for category to allow for future categories
  category: z.string(),
  deletedAt: z.date().nullable(),
});

export const createFileInputSchema = z.object({
  file: z.instanceof(File),
  folderId: z.string(),
});

export const listFilesInputSchema = z.object({
  folderId: z.string(),
});

export const listFilesOutputSchema = z.object({
  files: z.array(fileResponseSchema),
});

export const deleteFileInputSchema = z.object({
  fileId: z.string(),
});
