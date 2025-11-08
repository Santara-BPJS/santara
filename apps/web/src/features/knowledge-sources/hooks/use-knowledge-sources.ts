import { useState } from "react";
import type { Folder } from "../types";

const mockFolders: Folder[] = [
  {
    id: "1",
    name: "SOP Verifikasi",
    createdBy: "Tim Verifikasi",
    fileCount: 8,
  },
  {
    id: "2",
    name: "Surat Edaran",
    createdBy: "Kepala Divisi",
    fileCount: 5,
  },
];

export function useKnowledgeSources() {
  const [folders] = useState<Folder[]>(mockFolders);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);

  const handleCreateFolder = () => {
    // TODO: Implement create folder logic
    setFolderName("");
    setIsCreateDialogOpen(false);
  };

  const handleOpenEditDialog = (folder: Folder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setIsEditDialogOpen(true);
  };

  const handleUpdateFolder = () => {
    // TODO: Implement edit logic
    setEditingFolder(null);
    setFolderName("");
    setIsEditDialogOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingFolder(null);
    setFolderName("");
  };

  const handleOpenDeleteDialog = (folderId: string) => {
    setDeletingFolderId(folderId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement delete logic
    setDeletingFolderId(null);
    setIsDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setDeletingFolderId(null);
    setIsDeleteDialogOpen(false);
  };

  const handleConnectGoogleDrive = () => {
    // TODO: Implement Google Drive connection logic
  };

  return {
    folders,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    folderName,
    setFolderName,
    editingFolder,
    deletingFolderId,
    handleCreateFolder,
    handleOpenEditDialog,
    handleUpdateFolder,
    handleCancelEdit,
    handleOpenDeleteDialog,
    handleConfirmDelete,
    handleCancelDelete,
    handleConnectGoogleDrive,
  };
}
