import { ChatEmptyState } from "@/features/chat/components/chat-empty-state";
import { ChatInput } from "@/features/chat/components/chat-input";
import { ChatMessage } from "@/features/chat/components/chat-message";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Message } from "../../features/chat/types";
import { orpc } from "../../shared/utils/orpc";

type ChatSearchParams = {
  q?: string;
};

export const Route = createFileRoute("/dashboard/chat")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): ChatSearchParams => ({
    q: (search.q as string) || "",
  }),
});

function RouteComponent() {
  const { q } = Route.useSearch();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { mutate: sendMessage, isPending } = useMutation(
    orpc.chat.sendMessage.mutationOptions()
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = () => {
    const query = input.trim();
    if (!query) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: query,
      sender: "user",
      createdAt: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    sendMessage(
      {
        message: query,
        conversationId: conversationId || undefined,
      },
      {
        onSuccess: (data) => {
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            content: data.answer,
            sender: "assistant",
            createdAt: new Date(),
            sources: data.sources.map((source) => ({
              id: source.id,
              title: source.title,
              filename: source.filename,
            })),
          };
          setMessages((prevMessages) => [...prevMessages, assistantMessage]);
          setConversationId(data.conversationId);
          setInput("");
        },
        onError: (error) => {
          toast.error("Gagal mengirim pesan", {
            description: error.message,
          });
        },
      }
    );
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (q && messages.length === 0) {
      setInput(q);
      // Auto-submit the query from search params
      setTimeout(() => {
        handleSendMessage();
        // biome-ignore lint/style/noMagicNumbers: false positive
      }, 100);
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  }, [q, messages.length, setInput, handleSendMessage]);

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] flex-col overflow-hidden">
      <div className="border-b bg-background p-4">
        <h1 className="font-bold text-2xl">
          Chat dengan <span className="text-primary">Santara</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Tanyakan apapun tentang regulasi dan prosedur verifikasi klaim
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <ChatEmptyState />
        ) : (
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isPending && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-lg bg-muted px-4 py-2">
                  <div className="flex gap-1">
                    <div className="size-2 animate-bounce rounded-full bg-foreground/50" />
                    <div
                      className="size-2 animate-bounce rounded-full bg-foreground/50"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="size-2 animate-bounce rounded-full bg-foreground/50"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput
        disabled={isPending}
        onChange={setInput}
        onSubmit={handleSendMessage}
        value={input}
      />
    </div>
  );
}
