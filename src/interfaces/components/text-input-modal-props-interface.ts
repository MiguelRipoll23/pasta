export interface TextInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  isSaving?: boolean;
  secondaryLabel?: string;
  secondaryValue?: string;
  secondaryPlaceholder?: string;
  onSecondaryChange?: (value: string) => void;
}
