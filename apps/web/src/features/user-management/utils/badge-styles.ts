import type { UserRole, UserStatus } from "../types";

export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case "Supervisor":
      return "bg-green-100 text-green-800 border-green-200";
    case "Verifikator":
      return "bg-green-100 text-green-800 border-green-200";
    case "Staf":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function getStatusBadgeColor(status: UserStatus): string {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 border-green-200";
    case "Invited":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}
