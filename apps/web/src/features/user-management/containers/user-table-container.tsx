import { UserTable } from "@/features/user-management/components/user-table";
import { useQuery } from "@tanstack/react-query";
import { UsersIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../../shared/components/ui/empty";
import { Skeleton } from "../../../shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/ui/table";
import { orpc } from "../../../shared/utils/orpc";

export default function UserTableContainer() {
  const { data, isLoading } = useQuery(
    orpc.user.getUsers.queryOptions({
      input: {},
    })
  );

  if (isLoading) {
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
            {Array.from({ length: 5 }).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <i>This is a static skeleton loader</i>
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-32 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-48 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-12 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-12 rounded-xl" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-5 rounded-md" />
                    <Skeleton className="size-5 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!data || data.users.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UsersIcon />
          </EmptyMedia>
          <EmptyTitle>Belum ada pengguna</EmptyTitle>
          <EmptyDescription>
            Undang anggota tim pertama Anda untuk mulai mengelola pengguna.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <UserTable
      totalFolderAccessCount={data.totalFolderAccessCount}
      users={data.users}
    />
  );
}
