import { Button } from "@/shared/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { orpc, queryClient } from "../../../shared/utils/orpc";

type UploadFileButtonProps = {
  folderId: string;
};

export default function UploadFileButton({ folderId }: UploadFileButtonProps) {
  const { mutateAsync } = useMutation(
    orpc.storage.fileRouter.create.mutationOptions()
  );

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        toast.promise(
          mutateAsync(
            { file, folderId },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: orpc.storage.fileRouter.findMany.queryKey({
                    input: { folderId },
                  }),
                });
              },
            }
          ),
          {
            loading: "Mengunggah file...",
            success: "File berhasil diunggah",
            error: (err) => ({
              message: "Gagal mengunggah file. Silakan coba lagi.",
              description: err.message || undefined,
            }),
          }
        );
      }
    };
    input.click();
  };

  return (
    <Button onClick={handleUpload}>
      <UploadIcon />
      Unggah File
    </Button>
  );
}
