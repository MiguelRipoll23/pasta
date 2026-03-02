import type { ReceiptItem } from "./receipt-item-interface";

export interface Receipt {
  id: number;
  merchantId: number;
  date: string;
  receiptDate?: string;
  totalAmount: string;
  currencyCode: string;
  merchant?: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  items?: ReceiptItem[];
}
