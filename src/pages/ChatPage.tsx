import React, { useEffect, useRef } from "react";
import { ChatComposer } from "../components/chat/ChatComposer";
import { ChatHeader } from "../components/chat/ChatHeader";
import { ChatMessages } from "../components/chat/ChatMessages";
import { chatMarkdownStyle, chatPulsingDotStyle } from "../constants/chat-constants";
import { useChatSession } from "../hooks/chat/useChatSession";

export const ChatPage: React.FC = () => {
  const {
    messages,
    input,
    models,
    selectedModel,
    showModelDropdown,
    selectedServer,
    showServerDropdown,
    uploadedImages,
    isStreaming,
    error,
    streamingError,
    isLoadingModels,
    setInput,
    setShowModelDropdown,
    setSelectedServer,
    setShowServerDropdown,
    setSelectedModel,
    handleSend,
    handleImageUpload,
    removeImage,
    isSendEnabled,
  } = useChatSession();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <style>{chatPulsingDotStyle + chatMarkdownStyle}</style>
      <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen md:-m-8 bg-white dark:bg-gray-900">
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-900">
          <ChatHeader
            models={models}
            selectedModel={selectedModel}
            isLoadingModels={isLoadingModels}
            showModelDropdown={showModelDropdown}
            setShowModelDropdown={setShowModelDropdown}
            selectedServer={selectedServer}
            setSelectedServer={setSelectedServer}
            showServerDropdown={showServerDropdown}
            setShowServerDropdown={setShowServerDropdown}
            setSelectedModel={setSelectedModel}
          />

          {error && (
            <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto pb-32">
            <div className="max-w-3xl mx-auto px-4 h-full">
              <ChatMessages
                messages={messages}
                streamingError={streamingError}
                messagesEndRef={messagesEndRef}
                onExampleClick={(example) => {
                  handleSend(example);
                }}
              />
            </div>
          </div>
        </div>

        <ChatComposer
          input={input}
          setInput={setInput}
          textareaRef={textareaRef}
          fileInputRef={fileInputRef}
          uploadedImages={uploadedImages}
          isStreaming={isStreaming}
          isSendEnabled={Boolean(isSendEnabled)}
          handleSend={handleSend}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          handleKeyDown={handleKeyDown}
          goBack={() => window.history.back()}
        />
      </div>
    </>
  );
};

export default ChatPage;
