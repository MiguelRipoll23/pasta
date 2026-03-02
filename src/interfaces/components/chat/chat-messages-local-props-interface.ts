import type { Message } from "../../../interfaces/chat/message-interface";

export interface ChatMessagesLocalProps {
  messages: Message[];
  streamingError: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onExampleClick?: (example: string) => void;
}
