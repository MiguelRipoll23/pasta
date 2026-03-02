export interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  isSaving?: boolean;
}
