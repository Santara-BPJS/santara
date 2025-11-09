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

type DeleteFileDialogProps = {
  id: string;
  folderId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function DeleteFileDialog({
  id,
  folderId,
  isOpen,
  setIsOpen,
}: DeleteFileDialogProps) {
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
          setIsOpen(false);
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
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
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
