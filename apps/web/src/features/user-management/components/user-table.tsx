import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import type { User } from "../types";
import { getRoleBadgeColor, getStatusBadgeColor } from "../utils/badge-styles";

type UserTableProps = {
  users: User[];
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
};

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
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
                    onClick={() => onEdit(user.id)}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <Pencil className="text-green-600" />
                  </Button>
                  <Button
                    onClick={() => onDelete(user.id)}
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
  );
}
