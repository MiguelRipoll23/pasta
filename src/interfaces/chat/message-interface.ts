import type { ToolCall } from "./tool-call-interface";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[];
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
}
