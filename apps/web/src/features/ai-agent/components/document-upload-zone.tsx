/** biome-ignore-all lint/a11y/noNoninteractiveElementInteractions: TODO */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: TODO */
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatFileSize } from "@santara/utils";
import { UploadIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../shared/lib/utils";

type DocumentUploadZoneProps = {
  onFilesChange: (files: File[]) => void;
  uploadedFiles: File[];
};

export default function DocumentUploadZone({
  onFilesChange,
  uploadedFiles,
}: DocumentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    if (droppedFiles.length > 0) {
      onFilesChange([...uploadedFiles, ...droppedFiles]);
    }
  };

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx";
    input.multiple = true;
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) {
        return;
      }

      const selectedFiles = Array.from(target.files);
      onFilesChange([...uploadedFiles, ...selectedFiles]);
    };
    input.click();
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <>
      <div
        className={cn(
          "flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragging
            ? "border-green-600 bg-green-50"
            : "border-gray-300 bg-gray-50"
        )}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadIcon className="mb-4 size-12 text-green-600" />
        <p className="mb-2 text-center font-semibold text-lg">
          Unggah Dokumen Klaim
        </p>
        <p className="mb-4 text-center text-muted-foreground text-sm">
          Drag and drop file PDF atau DOCX di sini (bisa lebih dari satu), atau
          klik untuk memilih
        </p>
        <Button onClick={handleFileSelect} type="button">
          Pilih File
        </Button>
      </div>
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>File yang Diunggah</CardTitle>
            <CardDescription>
              {uploadedFiles.length} file telah diunggah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  className="flex items-center justify-between rounded-md border bg-white p-3"
                  key={`${file.name}-${index}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{file.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleRemoveFile(index)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <XIcon className="size-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
