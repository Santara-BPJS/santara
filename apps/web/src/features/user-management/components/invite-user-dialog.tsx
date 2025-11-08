import { Button } from "@/shared/components/ui/button";
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
import { UserPlus } from "lucide-react";

type InviteUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
};

export function InviteUserDialog({
  open,
  onOpenChange,
  email,
  onEmailChange,
  onSubmit,
}: InviteUserDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus />
          Undang Anggota
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Undang Anggota Tim</DialogTitle>
          <DialogDescription>
            Masukkan email anggota tim yang ingin Anda undang.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Email anggota"
            type="email"
            value={email}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Batal
          </Button>
          <Button onClick={onSubmit}>Kirim Undangan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
