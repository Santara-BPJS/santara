import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
import { DeleteFileDialog } from "./delete-file-dialog";

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
          <DeleteFileDialog folderId={file.folderId} id={file.id} />
        </div>
        <div className="mb-4">
          <Icon className="size-12 text-green-600" />
        </div>
        <CardTitle className="text-xl">{file.name}</CardTitle>
        <CardDescription>
          {size} -{" "}
          {file.createdAt.toLocaleDateString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
          })}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
