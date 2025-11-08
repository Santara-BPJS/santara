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
  folderId: z.string().nullable(),
  category: z.string(),
  deletedAt: z.date().nullable(),
});

export const createFileInputSchema = z.object({
  file: z.instanceof(File),
  folderId: z.string(),
});
