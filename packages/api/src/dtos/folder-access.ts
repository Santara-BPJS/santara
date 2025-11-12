import z from "zod";

export const getUserFolderAccessInputSchema = z.object({
  userId: z.string().min(1),
});

export const folderWithAccessSchema = z.object({
  id: z.string(),
  name: z.string(),
  hasAccess: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getUserFolderAccessOutputSchema = z.object({
  folders: z.array(folderWithAccessSchema),
});

export const updateUserFolderAccessInputSchema = z.object({
  userId: z.string().min(1),
  folderIds: z.array(z.string()),
});
