export interface BankAccountRoboadvisorBalance {
  id: number;
  roboadvisorId: number;
  date: string;
  type: "deposit" | "withdrawal" | "adjustment";
  amount: string;
  currencyCode: string;
  createdAt: string;
  updatedAt: string;
}
