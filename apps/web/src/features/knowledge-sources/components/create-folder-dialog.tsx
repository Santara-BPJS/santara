import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { dto } from "@santara/api";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldSet,
} from "../../../shared/components/ui/field";
import { orpc, queryClient } from "../../../shared/utils/orpc";

export function CreateFolderDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync } = useMutation(
    orpc.storage.folderRouter.create.mutationOptions()
  );
  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: dto.createFolderInputSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value, {
        onSuccess: () => {
          form.reset();
          toast.success("Folder berhasil dibuat");
          setIsOpen(false);
          queryClient.invalidateQueries({
            queryKey: orpc.storage.folderRouter.findMany.queryKey(),
          });
        },
        onError: (ctx) => {
          toast.error("Gagal membuat folder", {
            description: ctx.message || "Silakan coba lagi.",
          });
        },
      });
    },
  });

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>
          <FolderPlus />
          Buat Folder Baru
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Folder Baru</DialogTitle>
          <DialogDescription>
            Masukkan nama untuk folder pengetahuan baru Anda.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form
            id="create-folder-form"
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
                          placeholder="Nama folder baru"
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
                form="create-folder-form"
                type="submit"
              >
                {state.isSubmitting ? "Membuat..." : "Buat Folder"}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
