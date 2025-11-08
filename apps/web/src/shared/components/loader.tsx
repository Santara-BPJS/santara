import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex h-dvh items-center justify-center pt-8">
      <Loader2 className="size-12 animate-spin" />
    </div>
  );
}
