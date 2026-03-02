export interface ToolCall {
  id: string;
  name: string;
  input?: string;
  output?: unknown;
  error?: string;
}
