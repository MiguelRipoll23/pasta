import type { CryptoExchangeBalance } from "../../../interfaces/crypto-exchange-balance-interface";

export interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingAsset?: CryptoExchangeBalance | null;
  formSymbol: string;
  setFormSymbol: (v: string) => void;
  formAmount: string;
  setFormAmount: (v: string) => void;
  formInvested: string;
  setFormInvested: (v: string) => void;
  formInvestedCurrency: string;
  setFormInvestedCurrency: (v: string) => void;
  availableSymbols: string[];
  isSaving: boolean;
}
