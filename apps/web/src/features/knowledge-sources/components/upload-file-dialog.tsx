import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/shared/components/ui/field";
import { Textarea } from "@/shared/components/ui/textarea";
import { dto } from "@santara/api";
import { formatFileSize } from "@santara/utils";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { UploadIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { orpc, queryClient } from "../../../shared/utils/orpc";

type UploadFileDialogProps = {
  folderId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function UploadFileDialog({
  folderId,
  isOpen,
  setIsOpen,
}: UploadFileDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutateAsync } = useMutation(
    orpc.storage.fileRouter.create.mutationOptions()
  );

  const form = useForm({
    defaultValues: {
      file: new File([], ""),
      folderId,
      description: "",
    },
    validators: {
      onSubmit: dto.createFileInputSchema,
    },
    onSubmit: ({ value }) => {
      toast.promise(
        mutateAsync(
          {
            ...value,
            description: value.description?.trim(),
          },
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
          error: "Gagal mengunggah file. Silakan coba lagi.",
        }
      );
      setIsOpen(false);
      setSelectedFile(null);
    },
  });

  const handleClose = () => {
    setSelectedFile(null);
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unggah File</DialogTitle>
          <DialogDescription>
            Pilih file dari komputer Anda dan tambahkan deskripsi opsional
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form
            id="upload-file-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit(e);
            }}
          >
            <FieldSet>
              <FieldGroup>
                <form.Field name="file">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>File</FieldLabel>
                        {selectedFile ? (
                          <div className="flex items-center justify-between gap-4 rounded-md border p-2">
                            <div>
                              <p className="font-medium">{selectedFile.name}</p>
                              <p className="text-muted-foreground text-sm">
                                {formatFileSize(selectedFile.size)}
                              </p>
                            </div>
                            <Button
                              onClick={() => {
                                setSelectedFile(null);
                                field.handleChange(new File([], ""));
                              }}
                              variant="ghost"
                            >
                              <XIcon />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.onchange = (e: Event) => {
                                const target = e.target as HTMLInputElement;
                                if (
                                  !target.files ||
                                  target.files.length === 0
                                ) {
                                  return;
                                }

                                const file = target.files[0];
                                setSelectedFile(file);
                                field.handleChange(file);
                              };
                              input.click();
                            }}
                            variant="outline"
                          >
                            <UploadIcon className="mr-2 size-4" />
                            Pilih File
                          </Button>
                        )}
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="description">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Deskripsi (Opsional)
                        </FieldLabel>
                        <Textarea
                          aria-invalid={isInvalid}
                          id={field.name}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Tambahkan deskripsi untuk file ini..."
                          rows={3}
                          value={field.state.value}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <form.Subscribe>
            {(state) => (
              <Button
                disabled={!state.canSubmit || state.isSubmitting}
                form="upload-file-form"
                type="submit"
              >
                {state.isSubmitting ? "Mengunggah..." : "Unggah"}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
