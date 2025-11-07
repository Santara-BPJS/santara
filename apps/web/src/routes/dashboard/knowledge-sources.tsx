import { createFileRoute } from "@tanstack/react-router";
import { Cloud, FolderPlus, FolderOpen, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";

export const Route = createFileRoute("/dashboard/knowledge-sources")({
  component: RouteComponent,
});

type Folder = {
  id: string;
  name: string;
  createdBy: string;
  fileCount: number;
};

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

function RouteComponent() {
  const [folders] = useState<Folder[]>(mockFolders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = () => {
    // TODO: Implement create folder logic
    setFolderName("");
    setIsDialogOpen(false);
  };

  const handleEdit = (_folderId: string) => {
    // TODO: Implement edit logic
  };

  const handleDelete = (_folderId: string) => {
    // TODO: Implement delete logic
  };

  const handleConnectGoogleDrive = () => {
    // TODO: Implement Google Drive connection logic
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
          <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus />
                Buat Folder Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Folder Baru</DialogTitle>
                <DialogDescription>
                  Masukkan nama untuk folder pengetahuan baru Anda.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Nama folder baru"
                  type="text"
                  value={folderName}
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  variant="outline"
                >
                  Batal
                </Button>
                <Button onClick={handleCreateFolder}>Buat</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={handleConnectGoogleDrive} variant="outline">
            <Cloud />
            Hubungkan Google Drive
          </Button>
        </div>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {folders.map((folder) => (
          <Card className="relative" key={folder.id}>
            <CardHeader>
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <Button
                  onClick={() => handleEdit(folder.id)}
                  size="icon-sm"
                  variant="ghost"
                >
                  <Pencil className="size-4 text-green-600" />
                </Button>
                <Button
                  onClick={() => handleDelete(folder.id)}
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
        ))}
      </div>
    </div>
  );
}
