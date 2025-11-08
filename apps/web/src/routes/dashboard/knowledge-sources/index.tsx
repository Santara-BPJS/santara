import { CreateFolderDialog } from "@/features/knowledge-sources/components/create-folder-dialog";
import { FolderCard } from "@/features/knowledge-sources/components/folder-card";
import { Button } from "@/shared/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { orpc } from "@/shared/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Cloud, FolderIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard/knowledge-sources/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useQuery(orpc.storage.folderRouter.findMany.queryOptions());

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
          <CreateFolderDialog />
          <Button variant="outline">
            <Cloud />
            Hubungkan Google Drive
          </Button>
        </div>
      </div>

      {data?.folders.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderIcon />
            </EmptyMedia>
            <EmptyTitle>Belum ada folder pengetahuan</EmptyTitle>
            <EmptyDescription>
              Buat folder pengetahuan pertama Anda untuk mulai mengelola dokumen
              Anda.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.folders?.map((folder) => (
            <FolderCard folder={folder} key={folder.id} />
          ))}
        </div>
      )}
    </div>
  );
}
