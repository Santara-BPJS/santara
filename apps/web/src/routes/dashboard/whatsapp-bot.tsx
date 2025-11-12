import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BotConfiguration } from "../../features/whatsapp-bot/components/bot-configuration";
import { ConnectionStatus } from "../../features/whatsapp-bot/components/connection-status";
import type { GroupConversation } from "../../features/whatsapp-bot/components/group-conversation-item";
import { GroupConversations } from "../../features/whatsapp-bot/components/group-conversations";

export const Route = createFileRoute("/dashboard/whatsapp-bot")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isConnected, setIsConnected] = useState(true);
  const [autoReplyTemplate, setAutoReplyTemplate] = useState(
    "Terima kasih telah bertanya. Guru Santara akan memproses pertanyaan Anda dengan informasi dari pengetahuan terverifikasi kami. Silakan tunggu jawaban detail."
  );
  const [botBehavior, setBotBehavior] = useState("mention");
  const [collectFromGroups, setCollectFromGroups] = useState(true);

  const groupConversations: GroupConversation[] = [
    {
      id: "1",
      name: "Tim Verifikasi RS Rujukan",
      lastMessage: "Bagaimana cara verifikasi klaim darurat?",
      timestamp: "5 menit yang lalu",
      memberCount: 12,
    },
    {
      id: "2",
      name: "Divisi Klaim",
      lastMessage: "Update SOP terbaru sudah dibaca?",
      timestamp: "1 jam yang lalu",
      memberCount: 8,
    },
    {
      id: "3",
      name: "Kepala Verifikasi",
      lastMessage: "Tolong cek pasal 19 tentang...",
      timestamp: "3 jam yang lalu",
      memberCount: 5,
    },
  ];

  const handleToggleConnection = () => {
    setIsConnected((prev) => !prev);
  };

  const handleSaveConfiguration = () => {
    // TODO
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-bold text-3xl">WhatsApp Bot</h1>
        <p className="text-muted-foreground">
          Kelola konfigurasi bot WhatsApp dan riwayat percakapan
        </p>
      </div>

      <ConnectionStatus
        isConnected={isConnected}
        onToggleConnection={handleToggleConnection}
      />

      {isConnected && (
        <BotConfiguration
          autoReplyTemplate={autoReplyTemplate}
          botBehavior={botBehavior}
          collectFromGroups={collectFromGroups}
          onAutoReplyChange={setAutoReplyTemplate}
          onBotBehaviorChange={setBotBehavior}
          onCollectFromGroupsChange={setCollectFromGroups}
          onSave={handleSaveConfiguration}
        />
      )}

      {isConnected && (
        <GroupConversations
          conversations={groupConversations}
          lastSyncTime="2 menit yang lalu"
          totalMessagesProcessed={247}
        />
      )}
    </div>
  );
}
