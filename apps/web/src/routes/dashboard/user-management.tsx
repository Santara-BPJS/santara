import { InviteUserDialog } from "@/features/user-management/components/invite-user-dialog";
import { UserTable } from "@/features/user-management/components/user-table";
import { useUserManagement } from "@/features/user-management/hooks/use-user-management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/user-management")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    users,
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    inviteEmail,
    setInviteEmail,
    handleInvite,
    handleEdit,
    handleDelete,
  } = useUserManagement();

  return (
    <div className="flex h-full grow flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola anggota tim, izin akses, dan sumber pengetahuan
          </p>
        </div>
        <InviteUserDialog
          email={inviteEmail}
          onEmailChange={setInviteEmail}
          onOpenChange={setIsInviteDialogOpen}
          onSubmit={handleInvite}
          open={isInviteDialogOpen}
        />
      </div>

      <UserTable onDelete={handleDelete} onEdit={handleEdit} users={users} />
    </div>
  );
}
