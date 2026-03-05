import api from "../httpClient";

export const getBills = async (limit = 100, cursor?: string) => {
  const response = await api.post("/api/v1/bills/find", {
    limit,
    cursor,
    sortField: "billDate",
    sortOrder: "desc",
  });
  return response.data;
};

export const saveBill = async (data: {
  date: string;
  category: string;
  totalAmount: string;
  currencyCode: string;
  senderEmail?: string;
  recurrence?: string;
  bankAccountId?: number | null;
}) => {
  const response = await api.post("/api/v1/bills/save", data);
  return response.data;
};

export const updateBill = async (
  id: number,
  data: {
    date: string;
    category: string;
    totalAmount: string;
    currencyCode: string;
    senderEmail?: string;
    recurrence?: string;
    bankAccountId?: number | null;
  },
) => {
  const response = await api.patch(`/api/v1/bills/${id}`, data);
  return response.data;
};

export const deleteBill = async (id: number) => {
  await api.delete(`/api/v1/bills/${id}`);
};

export default {
  getBills,
  saveBill,
  updateBill,
  deleteBill,
};
