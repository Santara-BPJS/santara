import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Send } from "lucide-react";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
};

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Ketik pertanyaan Anda di sini...",
  disabled = false,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t bg-card p-4">
      <Input
        className="flex-1"
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      <Button disabled={disabled || !value.trim()} onClick={onSubmit}>
        <Send />
      </Button>
    </div>
  );
}
