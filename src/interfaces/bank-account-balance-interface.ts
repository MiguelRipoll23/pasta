export interface BankAccountBalance {
  id: number;
  bankAccountId: number;
  balance: string;
  currencyCode: string;
  interestRate?: number | null;
  createdAt: string;
  updatedAt: string;
}
