import { ChatEmptyState } from "@/features/chat/components/chat-empty-state";
import { ChatInput } from "@/features/chat/components/chat-input";
import { ChatMessage } from "@/features/chat/components/chat-message";
import { useChat } from "@/features/chat/hooks/use-chat";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    messagesEndRef,
    handleSendMessage,
  } = useChat();

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
            {isLoading && (
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
        disabled={isLoading}
        onChange={setInput}
        onSubmit={handleSendMessage}
        value={input}
      />
    </div>
  );
}
