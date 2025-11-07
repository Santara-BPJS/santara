import { useState } from "react";
import type { User } from "../types";

const mockUsers: User[] = [
  {
    id: "1",
    name: "Rani Wijaya",
    email: "rani@bpjs.go.id",
    role: "Supervisor",
    resourceAccess: "5 dari 6",
    status: "Active",
  },
  {
    id: "2",
    name: "Budi Santoso",
    email: "budi@bpjs.go.id",
    role: "Verifikator",
    resourceAccess: "3 dari 6",
    status: "Active",
  },
  {
    id: "3",
    name: "Siti Nurhaliza",
    email: "siti@bpjs.go.id",
    role: "Staf",
    resourceAccess: "2 dari 6",
    status: "Invited",
  },
];

export function useUserManagement() {
  const [users] = useState<User[]>(mockUsers);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = () => {
    // TODO: Implement invite logic
    setInviteEmail("");
    setIsInviteDialogOpen(false);
  };

  const handleEdit = (_userId: string) => {
    // TODO: Implement edit logic
  };

  const handleDelete = (_userId: string) => {
    // TODO: Implement delete logic
  };

  return {
    users,
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    inviteEmail,
    setInviteEmail,
    handleInvite,
    handleEdit,
    handleDelete,
  };
}
