import api from "../httpClient";

export const getBillCategories = async (limit = 100) => {
  const response = await api.post("/api/v1/bill-categories/find", {
    limit,
    sortField: "name",
    sortOrder: "asc",
  });
  return response.data.results;
};

export const createBillCategory = async (name: string, hexColor?: string | null) => {
  const response = await api.post("/api/v1/bill-categories", {
    name,
    hexColor,
  });
  return response.data;
};

export const updateBillCategory = async (
  id: number,
  name?: string,
  favoritedAt?: string | null,
  hexColor?: string | null,
) => {
  const response = await api.patch(`/api/v1/bill-categories/${id}`, {
    name,
    favoritedAt,
    hexColor,
  });
  return response.data;
};

export const deleteBillCategory = async (id: number) => {
  await api.delete(`/api/v1/bill-categories/${id}`);
};

export default {
  getBillCategories,
  createBillCategory,
  updateBillCategory,
  deleteBillCategory,
};
