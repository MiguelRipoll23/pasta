export interface SalaryChange {
  id: number;
  recurrence: "weekly" | "bi-weekly" | "monthly" | "yearly";
  netAmount: string;
  currencyCode: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
