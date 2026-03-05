export interface Bill {
  id: number;
  date: string;
  category: string;
  totalAmount: string;
  currencyCode: string;
  senderEmail?: string | null;
  recurrence?: string | null;
  updatedAt: string;
}
