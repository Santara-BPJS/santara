import { InviteUserDialog } from "@/features/user-management/components/invite-user-dialog";
import { createFileRoute } from "@tanstack/react-router";
import UserTableContainer from "../../features/user-management/containers/user-table-container";

export const Route = createFileRoute("/dashboard/user-management")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full grow flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola anggota tim, izin akses, dan sumber pengetahuan
          </p>
        </div>
        <InviteUserDialog />
      </div>

      <UserTableContainer />
    </div>
  );
}
