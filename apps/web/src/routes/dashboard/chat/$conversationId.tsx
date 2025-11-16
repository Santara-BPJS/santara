import { ChatEmptyState } from "@/features/chat/components/chat-empty-state";
import { ChatInput } from "@/features/chat/components/chat-input";
import { ChatMessage } from "@/features/chat/components/chat-message";
import { ConversationList } from "@/features/chat/components/conversation-list";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SidebarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Message } from "../../../features/chat/types";
import { Button } from "../../../shared/components/ui/button";
import { Sheet, SheetContent } from "../../../shared/components/ui/sheet";
import { useIsMobile } from "../../../shared/hooks/use-mobile";
import { orpc } from "../../../shared/utils/orpc";

export const Route = createFileRoute("/dashboard/chat/$conversationId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { conversationId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { mutate: sendMessage, isPending } = useMutation(
    orpc.chat.sendMessage.mutationOptions()
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load conversation history
  const { data: conversationData, isLoading: isLoadingHistory } = useQuery(
    orpc.chat.getConversation.queryOptions({ input: { conversationId } })
  );

  // Update messages when conversation data loads
  useEffect(() => {
    if (conversationData) {
      setMessages(
        conversationData.messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          createdAt: new Date(msg.createdAt),
          sources: msg.sources,
        }))
      );
    }
  }, [conversationData]);

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
        conversationId,
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
          setInput("");

          // Invalidate queries to update conversation list
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          queryClient.invalidateQueries({
            queryKey: ["conversation", conversationId],
          });
        },
        onError: (error) => {
          toast.error("Gagal mengirim pesan", {
            description: error.message,
          });
          // Remove the optimistic user message on error
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== userMessage.id)
          );
        },
      }
    );
  };

  const handleNewConversation = () => {
    navigate({ to: "/dashboard/chat" });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-row justify-between gap-4 border-b bg-background p-4">
          <div>
            <h1 className="font-bold text-2xl">
              Chat dengan <span className="text-primary">Santara</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Tanyakan apapun tentang regulasi dan prosedur verifikasi klaim
            </p>
          </div>

          {isMobile && (
            <Button
              onClick={() => setIsSidebarOpen(true)}
              size="icon-sm"
              variant="ghost"
            >
              <SidebarIcon />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingHistory && (
            <div className="flex h-full items-center justify-center">
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
          )}

          {messages.length === 0 && <ChatEmptyState />}

          {messages.length > 0 && (
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
          disabled={isPending || isLoadingHistory}
          onChange={setInput}
          onSubmit={handleSendMessage}
          value={input}
        />
      </div>

      {isMobile ? (
        <Sheet onOpenChange={setIsSidebarOpen} open={isSidebarOpen}>
          <SheetContent>
            <ConversationList
              activeConversationId={conversationId}
              onNewConversation={handleNewConversation}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <ConversationList
          activeConversationId={conversationId}
          onNewConversation={handleNewConversation}
        />
      )}
    </div>
  );
}
