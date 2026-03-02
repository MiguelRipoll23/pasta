export interface BankAccount {
  id: number;
  name: string;
  type: string;
  taxPercentage?: number | null;
  latestCalculation?: {
    monthlyProfit: string;
    annualProfit: string;
    currencyCode: string;
    calculatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
