/** biome-ignore-all lint/style/noMagicNumbers: TODO */
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type ConversationSearchProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

export function ConversationSearch({
  onSearch,
  placeholder = "Cari percakapan...",
}: ConversationSearchProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative">
      <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
      <Input
        className="pl-9"
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        type="text"
        value={query}
      />
    </div>
  );
}
