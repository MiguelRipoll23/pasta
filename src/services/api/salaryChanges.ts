import api from "../httpClient";

export const getSalaryChanges = async (limit = 100, cursor?: string) => {
  const response = await api.post("/api/v1/salary-changes/list", {
    limit,
    cursor,
    sortField: "createdAt",
    sortOrder: "desc",
  });
  return response.data;
};

export const createSalaryChange = async (
  recurrence: string,
  netAmount: string,
  currencyCode: string,
  date: string,
) => {
  const response = await api.post("/api/v1/salary-changes", {
    recurrence,
    netAmount,
    currencyCode,
    date,
  });
  return response.data;
};

export const updateSalaryChange = async (
  id: number,
  recurrence?: string,
  netAmount?: string,
  currencyCode?: string,
  date?: string,
) => {
  const response = await api.patch(`/api/v1/salary-changes/${id}`, {
    recurrence,
    netAmount,
    currencyCode,
    date,
  });
  return response.data;
};

export const deleteSalaryChange = async (id: number) => {
  await api.delete(`/api/v1/salary-changes/${id}`);
};

export default {
  getSalaryChanges,
  createSalaryChange,
  updateSalaryChange,
  deleteSalaryChange,
};
