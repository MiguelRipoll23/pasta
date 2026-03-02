import type { Message } from "../../chat/message-interface";

export interface ChatMessagesProps {
  messages: Message[];
  streamingError: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onExampleClick?: (example: string) => void;
}
