import type { BankAccount } from "../../interfaces/bank-account-interface";

export interface BankAccountDetailProps {
  // `account` is optional when the parent route renders the detail component and the
  // component resolves the `account` from the route params / hooks. Keep it optional so
  // the caller doesn't need to pass it every time.
  account?: BankAccount | null;
  onBack: () => void;
  onEdit: (account: BankAccount) => void;
  onDelete: (id: number) => void;
}
