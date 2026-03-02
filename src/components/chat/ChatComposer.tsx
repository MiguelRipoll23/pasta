import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUp, Camera, Mic, Square, X } from "lucide-react";

import type { ChatComposerProps } from "../../interfaces/components/chat/chat-composer-props-interface";

type VoiceRecognitionResult = {
  0?: {
    transcript?: string;
  };
};

type VoiceRecognitionEvent = {
  results: ArrayLike<VoiceRecognitionResult>;
};

type VoiceRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: VoiceRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type VoiceRecognitionConstructor = new () => VoiceRecognitionInstance;

declare global {
  interface Window {
    webkitSpeechRecognition?: VoiceRecognitionConstructor;
    SpeechRecognition?: VoiceRecognitionConstructor;
  }
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  input,
  setInput,
  textareaRef,
  fileInputRef,
  uploadedImages,
  isStreaming,
  isSendEnabled,
  handleSend,
  handleImageUpload,
  removeImage,
  handleKeyDown,
  goBack,
}) => {
  const recognitionRef = useRef<VoiceRecognitionInstance | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const browserLanguage = useMemo(() => navigator.language || "en-US", []);

  useEffect(() => {
    const RecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!RecognitionConstructor) {
      return;
    }

    const recognition = new RecognitionConstructor();
    recognition.lang = browserLanguage;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join("")
        .trim();

      setInput(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setSpeechSupported(true);

    return () => {
      recognition.stop();
    };
  }, [browserLanguage, setInput]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;

    if (!recognition || isStreaming) {
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-30 px-4">
      <div className="max-w-xl mx-auto flex items-center gap-3">
        <button
          onClick={goBack}
          className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors cursor-pointer flex-shrink-0"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-red-600 dark:text-red-400" />
        </button>

        <div className={`relative flex flex-col items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-3xl px-4 py-3 flex-1 min-w-0 ${uploadedImages.length > 0 ? "py-2" : ""}`}>
          {uploadedImages.length > 0 && (
            <div className="flex gap-2 flex-wrap w-full px-2 pt-1">
              {uploadedImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Upload ${idx + 1}`} className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => removeImage(idx)}
                    disabled={isStreaming}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-700 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 w-full min-w-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isStreaming}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0 disabled:opacity-50"
              title="Upload image"
            >
              <Camera className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={isStreaming}
              className="hidden"
            />

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything"
              rows={1}
              disabled={isStreaming}
              className="flex-1 min-w-0 bg-transparent border-none outline-none resize-none py-2 px-4 rounded-full text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 max-h-32 disabled:opacity-50"
              style={{ minHeight: "24px" }}
            />

            <div className="flex items-center gap-2">
              <button
                onClick={toggleListening}
                disabled={!speechSupported || isStreaming}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all active:scale-95 cursor-pointer ${
                  isListening
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
                title={speechSupported ? (isListening ? "Stop voice input" : "Start voice input") : "Speech input is not supported in this browser"}
              >
                {isListening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleSend()}
                disabled={!isSendEnabled}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all active:scale-95 cursor-pointer ${
                  isSendEnabled
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-400 opacity-50 cursor-not-allowed"
                }`}
                aria-label="Send message"
              >
                <ArrowUp />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
