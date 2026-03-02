export interface BankAccountRoboadvisor {
  id: number;
  name: string;
  bankAccountId: number;
  riskLevel?: number | null;
  managementFeePercentage: number;
  custodyFeePercentage: number;
  fundTerPercentage: number;
  totalFeePercentage: number;
  managementFeeFrequency: "monthly" | "quarterly" | "yearly";
  custodyFeeFrequency: "monthly" | "quarterly" | "yearly";
  terPricedInNav: boolean;
  taxPercentage?: number | null;
  latestCalculation?: {
    currentValue: string;
    currencyCode: string;
    calculatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
