export interface Bill {
  id: number;
  name: string;
  date: string;
  category: string;
  totalAmount: string;
  currencyCode: string;
  recurrence?: string | null;
  updatedAt: string;
}
