import { Badge } from "@/shared/components/ui/badge";
import { MessageCircleIcon } from "lucide-react";

export type GroupConversation = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  memberCount: number;
};

type GroupConversationItemProps = {
  group: GroupConversation;
};

export function GroupConversationItem({ group }: GroupConversationItemProps) {
  return (
    <div className="w-full rounded-lg border p-4 text-left transition-colors hover:bg-accent">
      <div className="flex items-start justify-between">
        <div className="flex flex-1 items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-full">
            <MessageCircleIcon className="size-5 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-medium">{group.name}</h4>
                <Badge variant="secondary">{group.memberCount} anggota</Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {group.lastMessage}
              </p>
            </div>
            <p className="text-muted-foreground text-xs">{group.timestamp}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
