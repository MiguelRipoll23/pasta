import type React from "react";
import type { BankAccountBalance } from "./bank-account-balance-interface";

export interface BalanceModalProps {
  show: boolean;
  editingBalance: BankAccountBalance | null;
  formBalanceAmount: string;
  setFormBalanceAmount: React.Dispatch<React.SetStateAction<string>>;
  formBalanceCurrency: string;
  setFormBalanceCurrency: React.Dispatch<React.SetStateAction<string>>;
  isSavingBalance: boolean;
  onClose: () => void;
  onSave: () => void;
}
