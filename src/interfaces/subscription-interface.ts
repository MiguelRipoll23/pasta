export interface Subscription {
  id: number;
  name: string;
  category: string;
  recurrence: "weekly" | "bi-weekly" | "monthly" | "yearly";
  amount: string;
  currencyCode: string;
  effectiveFrom: string;
  effectiveUntil?: string | null;
  plan?: string | null;
  updatedAt: string;
}
