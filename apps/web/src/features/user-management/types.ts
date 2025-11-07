export type UserRole = "Supervisor" | "Verifikator" | "Staf";
export type UserStatus = "Active" | "Invited";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  resourceAccess: string;
  status: UserStatus;
};
