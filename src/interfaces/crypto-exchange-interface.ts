export interface CryptoExchange {
  id: number;
  name: string;
  taxPercentage?: number | null;
  latestCalculation?: {
    currentValue: string;
    currencyCode: string;
    calculatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
