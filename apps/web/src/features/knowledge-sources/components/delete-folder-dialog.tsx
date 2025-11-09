import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { orpc, queryClient } from "@/shared/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteFolderDialogProps = {
  id: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function DeleteFolderDialog({
  id,
  isOpen,
  setIsOpen,
}: DeleteFolderDialogProps) {
  const { mutateAsync } = useMutation(
    orpc.storage.folderRouter.delete.mutationOptions()
  );

  const onDelete = async () => {
    await mutateAsync(
      { folderId: id },
      {
        onSuccess: () => {
          toast.success("Folder berhasil dihapus");
          queryClient.invalidateQueries({
            queryKey: orpc.storage.folderRouter.findMany.queryKey(),
          });
        },
        onError: (ctx) => {
          toast.error("Gagal menghapus folder", {
            description: ctx.message || "Silakan coba lagi.",
          });
        },
      }
    );
  };

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Folder?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Folder dan semua file di
            dalamnya akan dihapus secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={onDelete}
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
