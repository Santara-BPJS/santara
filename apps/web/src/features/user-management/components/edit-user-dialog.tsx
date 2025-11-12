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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldSet,
} from "@/shared/components/ui/field";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { dto } from "@santara/api";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { orpc, queryClient } from "../../../shared/utils/orpc";
import type { User } from "../types";

type EditUserDialogProps = {
  user: User;
};

export function EditUserDialog({ user }: EditUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync } = useMutation(orpc.user.updateUser.mutationOptions());

  const form = useForm({
    defaultValues: {
      userId: user.id,
      role: user.role,
    },
    validators: {
      onSubmit: dto.updateUserInputSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(
        {
          ...value,
        },
        {
          onSuccess: () => {
            toast.success("Pengguna berhasil diperbarui");
            queryClient.invalidateQueries({
              queryKey: orpc.user.getUsers.queryKey({ input: {} }),
            });
            form.reset();
            setIsOpen(false);
          },
          onError: (ctx) => {
            toast.error("Gagal memperbarui pengguna", {
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
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="ghost">
          <Pencil className="text-green-600" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>
            Perbarui informasi dan peran pengguna
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form
            id="edit-user-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit(e);
            }}
          >
            <FieldSet>
              <FieldGroup>
                <form.Field name="role">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <Label htmlFor={field.name}>Role</Label>
                        <Select
                          defaultValue={field.state.value.toString()}
                          name={field.name}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger aria-invalid={isInvalid}>
                            <SelectValue placeholder="Pilih role..." />
                          </SelectTrigger>
                          <SelectContent>
                            {["User", "Staf", "Verifikator", "Supervisor"].map(
                              (role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
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
                form="edit-user-form"
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
