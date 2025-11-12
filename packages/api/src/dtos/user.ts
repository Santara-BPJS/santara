import z from "zod";

export const getUsersInputSchema = z.object({
  search: z.string().optional(),
  role: z.number().optional(),
  status: z.enum(["active", "invited", "inactive"]).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
});

export const userOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  folderAccessCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getUsersOutputSchema = z.object({
  users: z.array(userOutputSchema),
  totalFolder: z.number(),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const updateUserInputSchema = z.object({
  userId: z.string().min(1),
  // looseen type for role to allow for future roles
  role: z.string(),
});

export const deleteUserInputSchema = z.object({
  userId: z.string().min(1),
});
