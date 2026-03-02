import api from "../httpClient";

export const getBills = async (limit = 100) => {
  const response = await api.post("/api/v1/bills/find", {
    limit,
    sortField: "billDate",
    sortOrder: "desc",
  });
  return response.data.results;
};

export const getReceipts = async (limit = 100) => {
  const response = await api.post("/api/v1/receipts/find", {
    limit,
    sortField: "receiptDate",
    sortOrder: "desc",
  });
  return response.data.results;
};

export const getSubscriptions = async (limit = 100) => {
  const response = await api.post("/api/v1/subscriptions/find", {
    limit,
    sortField: "effectiveFrom",
    sortOrder: "desc",
    isActive: "true",
  });
  return response.data.results;
};

export default {
  getBills,
  getReceipts,
  getSubscriptions,
};
