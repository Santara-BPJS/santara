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
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { dto } from "@santara/api";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { orpc, queryClient } from "../../../shared/utils/orpc";

type EditFileDialogProps = {
  fileId: string;
  folderId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentName: string;
  currentDescription?: string | null | undefined;
};

export function EditFileDialog({
  fileId,
  folderId,
  isOpen,
  setIsOpen,
  currentName,
  currentDescription,
}: EditFileDialogProps) {
  const { mutateAsync } = useMutation(
    orpc.storage.fileRouter.update.mutationOptions()
  );

  const form = useForm({
    defaultValues: {
      fileId,
      name: currentName,
      description: currentDescription || "",
    },
    validators: {
      onSubmit: dto.updateFileInputSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(
        {
          ...value,
          name: value.name.trim(),
          description: value.description?.trim(),
        },
        {
          onSuccess: () => {
            toast.success("File berhasil diperbarui");
            queryClient.invalidateQueries({
              queryKey: orpc.storage.fileRouter.findMany.queryKey({
                input: { folderId },
              }),
            });
            form.reset();
            setIsOpen(false);
          },
          onError: (ctx) => {
            toast.error("Gagal memperbarui file", {
              description: ctx.message || "Silakan coba lagi.",
            });
          },
        }
      );
    },
  });

  const handleClose = () => {
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit File</DialogTitle>
          <DialogDescription>
            Perbarui nama dan deskripsi untuk file ini
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form
            id="edit-file-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit(e);
            }}
          >
            <FieldSet>
              <FieldGroup>
                <form.Field name="name">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <Label htmlFor={field.name}>Nama File</Label>
                        <Input
                          aria-invalid={isInvalid}
                          id={field.name}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Masukkan nama file..."
                          value={field.state.value}
                        />
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
                        <Label htmlFor={field.name}>Deskripsi</Label>
                        <Textarea
                          aria-invalid={isInvalid}
                          id={field.name}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Tambahkan deskripsi untuk file ini..."
                          rows={4}
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
            <Button onClick={handleClose} variant="outline">
              Batal
            </Button>
          </DialogClose>
          <form.Subscribe>
            {(state) => (
              <Button
                disabled={!state.canSubmit || state.isSubmitting}
                form="edit-file-form"
                type="submit"
              >
                {state.isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
