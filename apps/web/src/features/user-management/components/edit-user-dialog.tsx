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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { dto } from "@santara/api";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "../../../shared/components/ui/checkbox";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "../../../shared/components/ui/item";
import { orpc, queryClient } from "../../../shared/utils/orpc";
import type { User } from "../types";

type EditUserDialogProps = {
  user: User;
};

export function EditUserDialog({ user }: EditUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);

  const { mutateAsync: updateUser } = useMutation(
    orpc.user.updateUser.mutationOptions()
  );
  const { mutateAsync: updateFolderAccess } = useMutation(
    orpc.folderAccess.updateUserFolderAccess.mutationOptions()
  );

  const { data: folderData, isLoading: isLoadingFolders } = useQuery({
    ...orpc.folderAccess.getUserFolderAccess.queryOptions({
      input: { userId: user.id },
    }),
    enabled: isOpen,
  });

  useEffect(() => {
    if (folderData?.folders) {
      setSelectedFolderIds(
        folderData.folders.filter((f) => f.hasAccess).map((f) => f.id)
      );
    }
  }, [folderData]);

  const form = useForm({
    defaultValues: {
      userId: user.id,
      role: user.role,
    },
    validators: {
      onSubmit: dto.updateUserInputSchema,
    },
    onSubmit: ({ value }) => {
      const fetch = [
        updateUser({ ...value }),
        updateFolderAccess({
          userId: user.id,
          folderIds: selectedFolderIds,
        }),
      ];

      toast.promise(Promise.all(fetch), {
        loading: "Menyimpan perubahan...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: orpc.user.getUsers.queryKey({ input: {} }),
          });
          queryClient.invalidateQueries({
            queryKey: orpc.folderAccess.getUserFolderAccess.queryKey({
              input: { userId: user.id },
            }),
          });
          form.reset();
          setIsOpen(false);
          return "Pengguna berhasil diperbarui";
        },
        error: (e) => ({
          message: "Gagal memperbarui pengguna. Silakan coba lagi.",
          description: e.message || "",
        }),
      });
    },
  });

  const handleToggleFolder = (folderId: string, checked: boolean) => {
    if (checked) {
      setSelectedFolderIds([...selectedFolderIds, folderId]);
      return;
    }

    setSelectedFolderIds(selectedFolderIds.filter((id) => id !== folderId));
  };

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

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm">Akses Sumber Pengetahuan</h3>
            <p className="text-muted-foreground text-xs">
              Pilih folder yang dapat diakses oleh pengguna ini
            </p>
          </div>

          {isLoadingFolders && (
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  className="flex flex-1 items-center gap-2.5 rounded border px-4 py-3"
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                  key={index}
                >
                  <Skeleton className="size-5 rounded-md" />
                  <Skeleton className="h-5 w-32 rounded-md" />
                </div>
              ))}
            </div>
          )}

          {folderData && folderData.folders.length === 0 && (
            <p className="text-center text-muted-foreground text-sm">
              Tidak ada folder tersedia
            </p>
          )}

          {folderData && folderData.folders.length > 0 && (
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {folderData.folders.map((folder) => (
                <Item key={folder.id} size="sm" variant="outline">
                  <ItemMedia>
                    <Checkbox
                      checked={selectedFolderIds.includes(folder.id)}
                      id={`folder-${folder.id}`}
                      onCheckedChange={(checked) =>
                        handleToggleFolder(folder.id, checked === true)
                      }
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      <Label htmlFor={`folder-${folder.id}`}>
                        {folder.name}
                      </Label>
                    </ItemTitle>
                  </ItemContent>
                </Item>
              ))}
            </div>
          )}
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
                disabled={
                  !state.canSubmit || state.isSubmitting || isLoadingFolders
                }
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
