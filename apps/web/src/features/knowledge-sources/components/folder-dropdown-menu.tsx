import { Button } from "@/shared/components/ui/button";
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../shared/components/ui/dropdown-menu";
import { DeleteFolderDialog } from "./delete-folder-dialog";
import { EditFolderDialog } from "./edit-folder-dialog";

type FolderDropdownMenuProps = {
  folder: {
    id: string;
    name: string;
  };
};

export default function FolderDropdownMenu({
  folder,
}: FolderDropdownMenuProps) {
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

      <EditFolderDialog
        id={folder.id}
        initialName={folder.name}
        isOpen={isShowEditDialog}
        setIsOpen={setIsShowEditDialog}
      />

      <DeleteFolderDialog
        id={folder.id}
        isOpen={isShowDeleteDialog}
        setIsOpen={setIsShowDeleteDialog}
      />
    </>
  );
}
