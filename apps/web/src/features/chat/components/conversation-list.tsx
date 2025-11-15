import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { orpc } from "@/shared/utils/orpc";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ConversationItem } from "./conversation-item";
import { ConversationSearch } from "./conversation-search";

type ConversationListProps = {
  activeConversationId?: string | null;
  onNewConversation: () => void;
};

export function ConversationList({
  activeConversationId,
  onNewConversation,
}: ConversationListProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(
    orpc.chat.getConversations.infiniteOptions({
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      input: (pageParam) => ({
        cursor: pageParam ?? undefined,
        limit: 20,
        query: searchQuery || undefined,
      }),
    })
  );

  const { mutate: deleteConversation } = useMutation(
    orpc.chat.deleteConversation.mutationOptions()
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleDelete = (conversationId: string) => {
    if (conversationId === activeConversationId) {
      onNewConversation();
    }

    deleteConversation(
      { conversationId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
        onError: () => {
          toast.error("Gagal menghapus percakapan");
        },
      }
    );
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const conversations = data?.pages.flatMap((page) => page.conversations) || [];

  return (
    <div className="flex h-full flex-col border-l bg-background md:w-80">
      <div className="border-b p-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="font-semibold text-lg">Percakapan</h2>
          <Link to="/dashboard/chat">
            <Button onClick={onNewConversation} size="icon-sm" variant="ghost">
              <Plus />
            </Button>
          </Link>
        </div>
        <ConversationSearch onSearch={handleSearch} />
      </div>

      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="flex flex-col gap-1 p-2">
          {isLoading && (
            <div className="space-y-2">
              {/** biome-ignore lint/style/noMagicNumbers: false positive */}
              {[...new Array(5)].map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: false positive
                <div className="flex gap-3 p-3" key={i}>
                  <Skeleton className="size-4 shrink-0 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm">
                Gagal memuat percakapan
              </p>
            </div>
          )}

          {!(isLoading || isError) && conversations.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm">
                {searchQuery
                  ? "Tidak ada percakapan ditemukan"
                  : "Belum ada percakapan"}
              </p>
            </div>
          )}

          {conversations.map((conversation) => (
            <ConversationItem
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              key={conversation.id}
              onDelete={() => handleDelete(conversation.id)}
            />
          ))}

          {/* Load more trigger */}
          {hasNextPage && (
            <div className="p-4 text-center" ref={loadMoreRef}>
              {isFetchingNextPage && (
                <div className="flex gap-3 p-3">
                  <Skeleton className="size-4 shrink-0 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
