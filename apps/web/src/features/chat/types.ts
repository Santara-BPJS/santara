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
  createdAt: Date;
  sources?: SourceReference[];
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    content: string;
    sender: MessageSender;
    createdAt: Date;
  };
};
