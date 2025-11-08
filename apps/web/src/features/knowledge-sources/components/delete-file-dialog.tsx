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

type DeleteFileDialogProps = {
  id: string;
  folderId: string;
};

export function DeleteFileDialog({ id, folderId }: DeleteFileDialogProps) {
  const { mutateAsync } = useMutation(
    orpc.storage.fileRouter.delete.mutationOptions()
  );

  const onDelete = async () => {
    await mutateAsync(
      { fileId: id },
      {
        onSuccess: () => {
          toast.success("File berhasil dihapus");
          queryClient.invalidateQueries({
            queryKey: orpc.storage.fileRouter.findMany.queryKey({
              input: { folderId },
            }),
          });
        },
        onError: (ctx) => {
          toast.error("Gagal menghapus file", {
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
          <AlertDialogTitle>Hapus File?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus file ini? Tindakan ini tidak dapat
            dibatalkan.
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
