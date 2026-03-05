export interface Bill {
  id: number;
  date: string;
  category: string;
  totalAmount: string;
  currencyCode: string;
  recurrence?: string | null;
  updatedAt: string;
}
