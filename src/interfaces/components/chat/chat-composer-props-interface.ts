export interface ChatComposerProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  uploadedImages: string[];
  isStreaming: boolean;
  isSendEnabled: boolean;
  handleSend: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  goBack: () => void;
}
