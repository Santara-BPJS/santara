import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CheckIcon, WifiIcon, WifiOffIcon } from "lucide-react";
import { cn } from "../../../shared/lib/utils";

type ConnectionStatusProps = {
  isConnected: boolean;
  onToggleConnection: () => void;
};

export function ConnectionStatus({
  isConnected,
  onToggleConnection,
}: ConnectionStatusProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full",
              isConnected ? "bg-green-50" : "bg-red-50"
            )}
          >
            {isConnected ? (
              <WifiIcon className="size-6 text-green-600" />
            ) : (
              <WifiOffIcon className="size-6 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">Status Koneksi</h3>
            {isConnected ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckIcon className="size-4" />
                <span>Bot terhubung dan siap digunakan</span>
              </div>
            ) : (
              <p className="text-destructive text-sm">Bot tidak terhubung</p>
            )}
          </div>
        </div>
        <Button
          onClick={onToggleConnection}
          variant={isConnected ? "destructive" : "default"}
        >
          {isConnected ? "Lepas Koneksi" : "Hubungkan"}
        </Button>
      </CardContent>
    </Card>
  );
}
