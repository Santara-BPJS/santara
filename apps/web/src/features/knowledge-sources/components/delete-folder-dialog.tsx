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
import { orpc, queryClient } from "@/shared/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type DeleteFolderDialogProps = {
  id: string;
};

export function DeleteFolderDialog({ id }: DeleteFolderDialogProps) {
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          size="icon-sm"
          variant="ghost"
        >
          <Trash2 className="size-4 text-red-600" />
        </Button>
      </AlertDialogTrigger>
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
