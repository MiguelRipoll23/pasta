export interface BankAccountInterestRate {
  id: number;
  bankAccountId: number;
  interestRate: string;
  interestRateStartDate: string;
  interestRateEndDate?: string;
  createdAt: string;
  updatedAt: string;
}
