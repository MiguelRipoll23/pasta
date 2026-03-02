export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[];
  toolCalls?: {
    id: string;
    name: string;
    args: Record<string, unknown>;
    result?: unknown;
  }[];
  isStreaming?: boolean;
}
