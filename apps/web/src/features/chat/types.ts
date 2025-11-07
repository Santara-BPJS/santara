export type MessageSender = "user" | "assistant";

export type SourceReference = {
  id: string;
  title: string;
  filename: string;
};

export type Message = {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
  sources?: SourceReference[];
};
