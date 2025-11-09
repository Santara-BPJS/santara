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
  description: z.string().nullable(),
  deletedAt: z.date().nullable(),
});

export const createFileInputSchema = z.object({
  file: z.instanceof(File),
  folderId: z.string(),
  description: z.union([z.string(), z.literal("")]),
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

export const updateFileInputSchema = z.object({
  fileId: z.string(),
  // https://stackoverflow.com/questions/73715295/react-hook-form-with-zod-resolver-optional-field
  name: z.union([z.string(), z.literal("")]),
  description: z.union([z.string(), z.literal("")]),
});

export const updateFileOutputSchema = z.object({
  success: z.boolean(),
});
