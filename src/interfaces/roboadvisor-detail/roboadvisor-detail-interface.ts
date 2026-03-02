export interface Roboadvisor {
  id: number;
  name: string;
  bankAccountId: number;
  riskLevel?: number;
  managementFeePercentage: number;
  custodyFeePercentage: number;
  fundTerPercentage: number;
  totalFeePercentage: number;
  managementFeeFrequency: string;
  custodyFeeFrequency: string;
  terPricedInNav: boolean;
  taxPercentage?: number;
  createdAt: string;
  updatedAt: string;
  latestCalculation?: {
    currentValue: string;
    currencyCode: string;
    calculatedAt: string;
  } | null;
}

export interface RoboadvisorBalance {
  id: number;
  roboadvisorId: number;
  date: string;
  type: "deposit" | "withdrawal" | "adjustment";
  amount: string;
  currencyCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoboadvisorFund {
  id: number;
  roboadvisorId: number;
  name: string;
  isin: string;
  assetClass: string;
  region: string;
  fundCurrencyCode: string;
  weight: string;
  shareCount?: number;
  createdAt: string;
  updatedAt: string;
}
