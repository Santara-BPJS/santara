import { CreateFolderDialog } from "@/features/knowledge-sources/components/create-folder-dialog";
import { DeleteFolderDialog } from "@/features/knowledge-sources/components/delete-folder-dialog";
import { EditFolderDialog } from "@/features/knowledge-sources/components/edit-folder-dialog";
import { FolderCard } from "@/features/knowledge-sources/components/folder-card";
import { useKnowledgeSources } from "@/features/knowledge-sources/hooks/use-knowledge-sources";
import { Button } from "@/shared/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Cloud } from "lucide-react";

export const Route = createFileRoute("/dashboard/knowledge-sources")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    folders,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    folderName,
    setFolderName,
    handleCreateFolder,
    handleOpenEditDialog,
    handleUpdateFolder,
    handleCancelEdit,
    handleOpenDeleteDialog,
    handleConfirmDelete,
    handleCancelDelete,
    handleConnectGoogleDrive,
  } = useKnowledgeSources();

  const handleFolderClick = (_folderId: string) => {
    // TODO: Navigate to folder detail page
  };

  return (
    <div className="flex h-full grow flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">Sumber Pengetahuan</h1>
          <p className="text-muted-foreground">
            Kelola dokumen dan folder pengetahuan Anda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateFolderDialog
            folderName={folderName}
            onFolderNameChange={setFolderName}
            onOpenChange={setIsCreateDialogOpen}
            onSubmit={handleCreateFolder}
            open={isCreateDialogOpen}
          />
          <Button onClick={handleConnectGoogleDrive} variant="outline">
            <Cloud />
            Hubungkan Google Drive
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => (
          <FolderCard
            folder={folder}
            key={folder.id}
            onClick={handleFolderClick}
            onDelete={handleOpenDeleteDialog}
            onEdit={handleOpenEditDialog}
          />
        ))}
      </div>

      <EditFolderDialog
        folderName={folderName}
        onCancel={handleCancelEdit}
        onFolderNameChange={setFolderName}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateFolder}
        open={isEditDialogOpen}
      />

      <DeleteFolderDialog
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={setIsDeleteDialogOpen}
        open={isDeleteDialogOpen}
      />
    </div>
  );
}
