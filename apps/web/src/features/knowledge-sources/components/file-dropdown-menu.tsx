import { Button } from "@/shared/components/ui/button";
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../shared/components/ui/dropdown-menu";
import { DeleteFileDialog } from "./delete-file-dialog";
import { EditFileDialog } from "./edit-file-dialog";

type FileDropdownMenuProps = {
  file: {
    id: string;
    folderId: string;
    description?: string | null;
  };
};

export default function FileDropdownMenu({ file }: FileDropdownMenuProps) {
  const [isShowEditDialog, setIsShowEditDialog] = useState(false);
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={(e) => e.stopPropagation()}
            size="icon-sm"
            variant="ghost"
          >
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsShowEditDialog(true);
            }}
          >
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsShowDeleteDialog(true);
            }}
            variant="destructive"
          >
            <Trash2Icon />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditFileDialog
        currentDescription={file.description}
        fileId={file.id}
        folderId={file.folderId}
        isOpen={isShowEditDialog}
        setIsOpen={setIsShowEditDialog}
      />

      <DeleteFileDialog
        folderId={file.folderId}
        id={file.id}
        isOpen={isShowDeleteDialog}
        setIsOpen={setIsShowDeleteDialog}
      />
    </>
  );
}
