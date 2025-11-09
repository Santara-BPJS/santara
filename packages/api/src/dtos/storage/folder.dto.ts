import z from "zod";

export const folderResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  fileCount: z.number(),
  user: z.object({
    id: z.string(),
    role: z.string(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createFolderInputSchema = z.object({
  name: z.string(),
});

export const listFoldersOutputSchema = z.object({
  folders: z.array(folderResponseSchema),
});

export const updateFolderInputSchema = z.object({
  name: z.string().min(1),
  folderId: z.string(),
});

export const deleteFolderInputSchema = z.object({
  folderId: z.string(),
});
