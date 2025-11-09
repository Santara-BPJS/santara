import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatFileSize } from "@santara/utils";
import {
  FileArchiveIcon,
  FileHeadphoneIcon,
  FileIcon,
  FileImageIcon,
  FilePlayIcon,
  FileTextIcon,
} from "lucide-react";
import { useMemo } from "react";
import FileDropdownMenu from "./file-dropdown-menu";

type FileCardProps = {
  file: {
    id: string;
    name: string;
    /*
      Refer to packages/storage/src/validation.ts for the complete list of file categories.
    */
    category:
      | "image"
      | "video"
      | "document"
      | "archive"
      | "audio"
      | "other"
      | string;
    url: string;
    path: string;
    size: number;
    mimeType: string;
    description?: string | null;
    createdAt: Date;
    folderId: string;
  };
};

export function FileCard({ file }: FileCardProps) {
  const Icon =
    {
      image: FileImageIcon,
      video: FilePlayIcon,
      document: FileTextIcon,
      archive: FileArchiveIcon,
      audio: FileHeadphoneIcon,
      other: FileIcon,
    }[file.category] || FileIcon;

  const size = useMemo(() => formatFileSize(file.size), [file.size]);

  return (
    <Card className="relative">
      <CardHeader>
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <FileDropdownMenu file={file} />
        </div>
        <div className="mb-4">
          <Icon className="size-12 text-green-600" />
        </div>
        <CardTitle className="truncate text-xl">{file.name}</CardTitle>
        <CardDescription>
          {size} -{" "}
          {file.createdAt.toLocaleDateString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
          })}
        </CardDescription>
        {file.description && (
          <p className="mt-2 line-clamp-2 text-muted-foreground text-sm">
            {file.description}
          </p>
        )}
      </CardHeader>
    </Card>
  );
}

export function FileCardSkeleton() {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <Skeleton className="size-8 rounded" />
        </div>
        <div className="mb-4">
          <Skeleton className="size-12 rounded" />
        </div>
        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-1/2" />
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
