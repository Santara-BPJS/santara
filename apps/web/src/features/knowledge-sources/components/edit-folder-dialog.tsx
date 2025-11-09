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
import { Input } from "@/shared/components/ui/input";
import { dto } from "@santara/api";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldSet,
} from "../../../shared/components/ui/field";
import { orpc, queryClient } from "../../../shared/utils/orpc";

type EditFolderDialogProps = {
  id: string;
  initialName: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function EditFolderDialog({
  id,
  initialName,
  isOpen,
  setIsOpen,
}: EditFolderDialogProps) {
  const { mutateAsync } = useMutation(
    orpc.storage.folderRouter.update.mutationOptions()
  );
  const form = useForm({
    defaultValues: {
      name: initialName,
      folderId: id,
    },
    validators: {
      onSubmit: dto.updateFolderInputSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value, {
        onSuccess: () => {
          toast.success("Folder berhasil diubah");
          setIsOpen(false);
          queryClient.invalidateQueries({
            queryKey: orpc.storage.folderRouter.findMany.queryKey(),
          });
        },
        onError: (ctx) => {
          toast.error("Gagal mengubah folder", {
            description: ctx.message || "Silakan coba lagi.",
          });
        },
      });
    },
  });

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
          <DialogDescription>
            Ubah nama folder pengetahuan Anda.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form
            id="edit-folder-form"
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
                        <Input
                          aria-invalid={isInvalid}
                          id={field.name}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Nama folder"
                          type="text"
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
                form="edit-folder-form"
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
