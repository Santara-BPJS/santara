import { orpc, queryClient } from "@/shared/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileIcon } from "lucide-react";
import { FileCard } from "../../../features/knowledge-sources/components/file-card";
import UploadFileButton from "../../../features/knowledge-sources/components/upload-file-button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../../shared/components/ui/empty";

export const Route = createFileRoute("/dashboard/knowledge-sources/$folderId")({
  loader: ({ params }) =>
    queryClient.ensureQueryData(
      orpc.storage.fileRouter.findMany.queryOptions({
        input: { folderId: params.folderId },
      })
    ),
  component: RouteComponent,
});

function RouteComponent() {
  const { folderId } = Route.useParams();

  const { data } = useQuery(
    orpc.storage.fileRouter.findMany.queryOptions({ input: { folderId } })
  );

  return (
    <div className="flex h-full grow flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">Sumber Pengetahuan</h1>
          <p className="text-muted-foreground">
            Kelola dokumen dan folder pengetahuan Anda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <UploadFileButton folderId={folderId} />
        </div>
      </div>
      {data?.files.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileIcon />
            </EmptyMedia>
            <EmptyTitle>Belum ada file</EmptyTitle>
            <EmptyDescription>
              Unggah file pertama Anda untuk mulai mengelola dokumen Anda.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.files?.map((file) => (
            <FileCard file={file} key={file.id} />
          ))}
        </div>
      )}
    </div>
  );
}
