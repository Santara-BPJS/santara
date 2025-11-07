import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/user-management")({
  component: RouteComponent,
});

type UserRole = "Supervisor" | "Verifikator" | "Staf";
type UserStatus = "Active" | "Invited";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  resourceAccess: string;
  status: UserStatus;
};

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

function RouteComponent() {
  const [users] = useState<User[]>(mockUsers);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = () => {
    // TODO: Implement invite logic
    setInviteEmail("");
    setShowInviteForm(false);
  };

  const handleEdit = (_userId: string) => {
    // TODO: Implement edit logic
  };

  const handleDelete = (_userId: string) => {
    // TODO: Implement delete logic
  };

  const getRoleBadgeColor = (role: UserRole) => {
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
  };

  const getStatusBadgeColor = (status: UserStatus) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Invited":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex h-full grow flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola anggota tim, izin akses, dan sumber pengetahuan
          </p>
        </div>
        <Button onClick={() => setShowInviteForm(!showInviteForm)}>
          <UserPlus />
          Undang Anggota
        </Button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Input
              className="w-sm"
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Email anggota"
              type="email"
              value={inviteEmail}
            />
            <Button onClick={handleInvite} size="sm">
              Kirim Undangan
            </Button>
            <Button
              onClick={() => setShowInviteForm(false)}
              size="sm"
              variant="outline"
            >
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* User Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Sumber Akses</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.resourceAccess}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleEdit(user.id)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Pencil className="text-green-600" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(user.id)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Trash2 className="text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
