import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";
import { DeleteFolderDialog } from "./delete-folder-dialog";
import { EditFolderDialog } from "./edit-folder-dialog";

type FolderCardProps = {
  folder: {
    id: string;
    name: string;
    user: {
      id: string;
      role: string;
    };
    fileCount: number;
  };
};

export function FolderCard({ folder }: FolderCardProps) {
  const navigate = useNavigate();
  return (
    <Card
      className="relative cursor-pointer transition-colors hover:bg-accent/50"
      onClick={() => {
        navigate({ to: `/dashboard/knowledge-sources/${folder.id}` });
      }}
    >
      <CardHeader>
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <EditFolderDialog id={folder.id} initialName={folder.name} />
          <DeleteFolderDialog id={folder.id} />
        </div>
        <div className="mb-4">
          <FolderOpen className="size-12 text-green-600" />
        </div>
        <CardTitle className="text-xl">{folder.name}</CardTitle>
        <CardDescription>Dibuat oleh {folder.user.role}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-green-600 text-sm">
          {folder.fileCount} file
        </p>
      </CardContent>
    </Card>
  );
}
