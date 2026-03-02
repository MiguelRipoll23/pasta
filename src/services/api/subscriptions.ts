import api from "../httpClient";

export const getSubscriptions = async (limit = 100) => {
  const response = await api.post("/api/v1/subscriptions/find", {
    limit,
    sortField: "effectiveFrom",
    sortOrder: "desc",
    isActive: "true",
  });
  return response.data.results;
};

export const createSubscription = async (data: {
  name: string;
  category: string;
  recurrence: string;
  amount: string;
  currencyCode: string;
  effectiveFrom: string;
  effectiveUntil?: string | null;
  plan?: string | null;
}) => {
  const response = await api.post("/api/v1/subscriptions", data);
  return response.data;
};

export const updateSubscription = async (
  id: number,
  data: {
    name: string;
    category: string;
    recurrence: string;
    amount: string;
    currencyCode: string;
    effectiveFrom: string;
    effectiveUntil?: string | null;
    plan?: string | null;
  },
) => {
  const response = await api.patch(`/api/v1/subscriptions/${id}`, data);
  return response.data;
};

export const deleteSubscription = async (id: number) => {
  await api.delete(`/api/v1/subscriptions/${id}`);
};

export default {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};
