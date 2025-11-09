import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";
import FolderDropdownMenu from "./folder-dropdown-menu";

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
      onDoubleClick={() => {
        navigate({ to: `/dashboard/knowledge-sources/${folder.id}` });
      }}
    >
      <CardHeader>
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <FolderDropdownMenu folder={folder} />
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

export function FolderCardSkeleton() {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <Skeleton className="size-8 rounded" />
        </div>
        <div className="mb-4">
          <Skeleton className="size-12" />
        </div>
        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-1/2" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-5 w-1/4" />
      </CardContent>
    </Card>
  );
}
