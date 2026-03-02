export interface CryptoInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  secondaryPlaceholder?: string;
  onSecondaryChange?: (value: string) => void;
  isSaving?: boolean;
}
