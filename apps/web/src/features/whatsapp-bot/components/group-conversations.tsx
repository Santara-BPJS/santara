import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { CheckIcon } from "lucide-react";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "../../../shared/components/ui/item";
import {
  GroupConversationItem,
  type GroupConversation,
} from "./group-conversation-item";

type GroupConversationsProps = {
  conversations: GroupConversation[];
  lastSyncTime: string;
  totalMessagesProcessed: number;
};

export function GroupConversations({
  conversations,
  lastSyncTime,
  totalMessagesProcessed,
}: GroupConversationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Percakapan Grup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {conversations.map((group) => (
          <GroupConversationItem group={group} key={group.id} />
        ))}

        <Item className="bg-primary/10" size="sm" variant="outline">
          <ItemMedia>
            <CheckIcon className="size-5 text-primary" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-primary">
              Sinkronisasi terakhir: {lastSyncTime} | Total pesan diproses:{" "}
              {totalMessagesProcessed}
            </ItemTitle>
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  );
}
