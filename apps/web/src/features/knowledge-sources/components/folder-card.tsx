import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FolderOpen, Pencil, Trash2 } from "lucide-react";
import type { Folder } from "../types";

type FolderCardProps = {
  folder: Folder;
  onClick: (folderId: string) => void;
  onEdit: (folder: Folder) => void;
  onDelete: (folderId: string) => void;
};

export function FolderCard({
  folder,
  onClick,
  onEdit,
  onDelete,
}: FolderCardProps) {
  return (
    <Card
      className="relative cursor-pointer transition-colors hover:bg-accent/50"
      onClick={() => onClick(folder.id)}
    >
      <CardHeader>
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(folder);
            }}
            size="icon-sm"
            variant="ghost"
          >
            <Pencil className="size-4 text-green-600" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(folder.id);
            }}
            size="icon-sm"
            variant="ghost"
          >
            <Trash2 className="size-4 text-red-600" />
          </Button>
        </div>
        <div className="mb-4">
          <FolderOpen className="size-12 text-green-600" />
        </div>
        <CardTitle className="text-xl">{folder.name}</CardTitle>
        <CardDescription>Dibuat oleh {folder.createdBy}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-green-600 text-sm">
          {folder.fileCount} file
        </p>
      </CardContent>
    </Card>
  );
}
