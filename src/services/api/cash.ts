import api from "../httpClient";
import { withDefined } from "../../utils/request-body-utils";

export const getCash = async (limit = 100) => {
  const response = await api.post("/api/v1/cash/find", {
    limit,
    sortField: "label",
    sortOrder: "asc",
  });
  return response.data.results;
};

export const createCash = async (label: string) => {
  const response = await api.post("/api/v1/cash", { label });
  return response.data;
};

export const updateCash = async (id: number, label: string) => {
  const response = await api.patch(`/api/v1/cash/${id}`, { label });
  return response.data;
};

export const deleteCash = async (id: number) => {
  await api.delete(`/api/v1/cash/${id}`);
};

// Cash Balances
export const getCashBalances = async (cashId?: number, limit = 100, cursor?: string) => {
  const body = withDefined(
    {
      limit,
      cursor,
      sortField: "created_at",
      sortOrder: "desc",
    },
    { cashId },
  );
  const response = await api.post("/api/v1/cash-balances/find", body);
  return response.data;
};

export const createCashBalance = async (
  cashId: number,
  balance: string,
  currencyCode: string,
) => {
  const response = await api.post("/api/v1/cash-balances", {
    cashId,
    balance,
    currencyCode,
  });
  return response.data;
};

export const updateCashBalance = async (
  id: number,
  balance: string,
  currencyCode: string,
) => {
  const response = await api.patch(`/api/v1/cash-balances/${id}`, {
    balance,
    currencyCode,
  });
  return response.data;
};

export const deleteCashBalance = async (id: number) => {
  await api.delete(`/api/v1/cash-balances/${id}`);
};

export default {
  getCash,
  createCash,
  updateCash,
  deleteCash,
  getCashBalances,
  createCashBalance,
  updateCashBalance,
  deleteCashBalance,
};
