export interface RoboadvisorInterface {
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
  taxPercentage?: number | null;
  createdAt: string;
  updatedAt: string;
}
