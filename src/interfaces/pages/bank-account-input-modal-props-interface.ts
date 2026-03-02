export interface BankAccountInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, type: string, taxPercentage?: string) => void;
  title: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  defaultType?: string;
  defaultTaxPercentage?: string;
  isSaving?: boolean;
}
