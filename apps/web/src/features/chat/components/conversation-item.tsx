/** biome-ignore-all lint/style/noMagicNumbers: TODO */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../../../shared/components/ui/context-menu";
import { cn } from "../../../shared/lib/utils";
import type { Conversation } from "../types";

type ConversationItemProps = {
  conversation: Conversation;
  isActive: boolean;
  onDelete: () => void;
};

export function ConversationItem({
  conversation,
  isActive,
  onDelete,
}: ConversationItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    }

    if (diffInHours < 168) {
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "short",
      }).format(date);
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Link
            className={cn(
              "group relative flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted",
              isActive && "bg-accent"
            )}
            params={{ conversationId: conversation.id }}
            to="/dashboard/chat/$conversationId"
          >
            <MessageCircle className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="line-clamp-1 font-medium text-sm leading-none">
                  {conversation.title}
                </h4>
                <span className="shrink-0 text-muted-foreground text-xs">
                  {formatDate(
                    conversation.lastMessage?.createdAt ||
                      conversation.createdAt
                  )}
                </span>
              </div>
              {conversation.lastMessage && (
                <p className="line-clamp-1 text-muted-foreground text-xs">
                  {conversation.lastMessage.sender === "user"
                    ? "Anda: "
                    : "Santara: "}
                  {conversation.lastMessage.content}
                </p>
              )}
            </div>
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="destructive"
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <AlertDialog
        onOpenChange={setIsDeleteDialogOpen}
        open={isDeleteDialogOpen}
      >
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus percakapan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Percakapan dan semua pesan di
              dalamnya akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
