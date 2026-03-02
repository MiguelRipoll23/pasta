import api from "../httpClient";
import { withDefined } from "../../utils/request-body-utils";
import type { ReceiptItem } from "../../interfaces/receipt-item-interface";

export const getMerchants = async (limit = 100) => {
  const response = await api.post("/api/v1/merchants/find", {
    limit,
    sortField: "name",
    sortOrder: "asc",
  });
  return response.data.results;
};

export const createMerchant = async (name: string) => {
  const response = await api.post("/api/v1/merchants", { name });
  return response.data;
};

export const updateMerchant = async (id: number, name: string) => {
  const response = await api.patch(`/api/v1/merchants/${id}`, { name });
  return response.data;
};

export const deleteMerchant = async (id: number) => {
  await api.delete(`/api/v1/merchants/${id}`);
};

// Receipts
export const getReceipts = async (merchantId?: number, limit = 100, cursor?: string) => {
  const body = withDefined(
    {
      limit,
      cursor,
      sortField: "receiptDate",
      sortOrder: "desc",
    },
    { merchantId },
  );
  const response = await api.post("/api/v1/receipts/find", body);
  return response.data.results;
};

export const createReceipt = async (
  merchantId: number,
  date: string,
  totalAmount: string,
  currencyCode: string,
) => {
  const response = await api.post("/api/v1/receipts", {
    merchantId,
    receiptDate: date,
    totalAmount,
    currencyCode,
  });
  return response.data;
};

export const updateReceipt = async (
  id: number,
  date: string,
  totalAmount: string,
  currencyCode: string,
) => {
  const response = await api.patch(`/api/v1/receipts/${id}`, {
    receiptDate: date,
    totalAmount,
    currencyCode,
  });
  return response.data;
};

export const deleteReceipt = async (id: number) => {
  await api.delete(`/api/v1/receipts/${id}`);
};

// Receipt Items are managed via Receipt PATCH
export const updateReceiptItems = async (
  receiptId: number,
  items: ReceiptItem[],
) => {
  const response = await api.patch(`/api/v1/receipts/${receiptId}`, {
    items: items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  });
  return response.data;
};

export default {
  getMerchants,
  createMerchant,
  updateMerchant,
  deleteMerchant,
  getReceipts,
  createReceipt,
  updateReceipt,
  deleteReceipt,
  updateReceiptItems,
};
