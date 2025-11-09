import { Button } from "@/shared/components/ui/button";
import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { UploadFileDialog } from "./upload-file-dialog";

type UploadFileButtonProps = {
  folderId: string;
};

export default function UploadFileButton({ folderId }: UploadFileButtonProps) {
  const [isShowUploadFileDialog, setIsShowUploadFileDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setIsShowUploadFileDialog(true)}>
        <UploadIcon />
        Unggah File
      </Button>

      <UploadFileDialog
        folderId={folderId}
        isOpen={isShowUploadFileDialog}
        setIsOpen={setIsShowUploadFileDialog}
      />
    </>
  );
}
