import api, { getSettings } from "../httpClient";
import type { ModelsResponse } from "../../interfaces/models-response-interface";
import type { StreamEvent } from "../../interfaces/stream-event-interface";

export const getChatModels = async (): Promise<ModelsResponse> => {
  const response = await api.get("/api/v1/conversations/models");
  return response.data;
};

export const streamChatMessage = async (
  sessionId: string,
  userMessage: string,
  model: string,
  mcpServer: "GLOBAL" | "PORTFOLIO" | "EXPENSES",
  callbacks: {
    onTextDelta?: (id: string, text: string) => void;
    onToolInputStart?: (toolCallId: string, toolName: string) => void;
    onToolInputDelta?: (toolCallId: string, inputText: string) => void;
    onToolInputAvailable?: (toolCallId: string, toolName: string, input: Record<string, unknown>) => void;
    onToolOutputAvailable?: (toolCallId: string, output: unknown) => void;
    onStart?: () => void;
    onFinish?: (finishReason: string) => void;
    onError?: (error: string) => void;
  },
): Promise<void> => {
  const settings = getSettings();
  const base = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${base}/api/v1/conversations/stream-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(settings.jwt ? { Authorization: `Bearer ${settings.jwt}` } : {}),
    },
    body: JSON.stringify({
      sessionId,
      userMessage,
      model,
      mcpServer,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No reader available");
  }

  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine === "[DONE]") continue;

      if (trimmedLine.startsWith("data: ")) {
        try {
          const event: StreamEvent = JSON.parse(trimmedLine.slice(6));

          switch (event.type) {
            case "start":
              callbacks.onStart?.();
              break;
            case "text-delta":
              if (event.id && event.delta !== undefined) {
                callbacks.onTextDelta?.(event.id, event.delta);
              }
              break;
            case "tool-input-start":
              if (event.toolCallId && event.toolName) {
                callbacks.onToolInputStart?.(event.toolCallId, event.toolName);
              }
              break;
            case "tool-input-delta":
              if (event.toolCallId && event.inputTextDelta !== undefined) {
                callbacks.onToolInputDelta?.(event.toolCallId, event.inputTextDelta);
              }
              break;
            case "tool-input-available":
              if (event.toolCallId && event.toolName && event.input) {
                callbacks.onToolInputAvailable?.(event.toolCallId, event.toolName, event.input);
              }
              break;
            case "tool-output-available":
              if (event.toolCallId && event.output !== undefined) {
                callbacks.onToolOutputAvailable?.(event.toolCallId, event.output);
              }
              break;
            case "finish":
              if (event.finishReason) {
                callbacks.onFinish?.(event.finishReason);
              }
              break;
            case "error":
              if (event.error) {
                callbacks.onError?.(event.error);
              }
              break;
          }
        } catch {
          // Skip invalid JSON lines
        }
      }
    }
  }
};

export const uploadChatImage = async (sessionId: string, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("image", file);
  await api.post(`/api/v1/conversations/${sessionId}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default {
  getChatModels,
  streamChatMessage,
  uploadChatImage,
};
