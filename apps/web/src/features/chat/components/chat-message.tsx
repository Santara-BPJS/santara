import { cn } from "@/shared/lib/utils";
import { DownloadIcon, FileTextIcon } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { Separator } from "../../../shared/components/ui/separator";
import type { Message } from "../types";

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[70%] space-y-2 rounded-lg px-4 py-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>

        {message.sources && message.sources.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <FileTextIcon className="size-4" />
                <span className="font-semibold">Sumber Rujukan:</span>
              </div>
              <div className="space-y-2">
                {message.sources.map((source) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-lg border bg-background/50 p-3 transition-colors hover:bg-background/80"
                    key={source.id}
                  >
                    <div className="flex items-start gap-2">
                      <FileTextIcon className="size-5 shrink-0 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">
                          {source.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {source.filename}
                        </p>
                      </div>
                    </div>
                    <Button size="icon-sm" type="button" variant="ghost">
                      <DownloadIcon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex flex-row justify-end">
          <p
            className={cn(
              "text-xs",
              isUser ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {message.timestamp.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
