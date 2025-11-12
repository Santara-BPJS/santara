export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  folderAccessCount: number;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};
