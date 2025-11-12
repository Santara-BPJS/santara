import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { orpc, queryClient } from "../../../shared/utils/orpc";
import type { User } from "../types";

type DeleteUserDialogProps = {
  user: User;
};

export function DeleteUserDialog({ user }: DeleteUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useMutation(
    orpc.user.deleteUser.mutationOptions()
  );

  const handleDelete = () => {
    mutate(
      { userId: user.id },
      {
        onSuccess: () => {
          toast.success("Pengguna berhasil dihapus");
          queryClient.invalidateQueries({
            queryKey: orpc.user.getUsers.queryKey({ input: {} }),
          });
          setIsOpen(false);
        },
        onError: (ctx) => {
          toast.error("Gagal menghapus pengguna", {
            description: ctx.message || "Silakan coba lagi.",
          });
        },
      }
    );
  };

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon-sm" variant="ghost">
          <Trash2 className="text-red-600" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus <strong>{user.name}</strong>? Aksi
            ini tidak dapat dibatalkan dan akan menghapus semua data terkait
            pengguna ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleDelete}>
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
