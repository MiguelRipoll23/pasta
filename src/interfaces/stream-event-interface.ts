export interface StreamEvent {
  type: string;
  id?: string;
  delta?: string;
  textDelta?: string;
  toolCallId?: string;
  toolName?: string;
  inputTextDelta?: string;
  input?: Record<string, unknown>;
  output?: unknown;
  error?: string;
  finishReason?: string;
}
