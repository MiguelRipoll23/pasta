import api from "../httpClient";
import { withDefined } from "../../utils/request-body-utils";

export const getRoboadvisors = async (
  bankAccountId?: number,
  name?: string,
  limit = 100,
  cursor?: string,
) => {
  const body = withDefined({ limit }, { bankAccountId, name, cursor });
  const response = await api.post("/api/v1/bank-account-roboadvisors/find", {
    ...body,
    sortField: "name",
    sortOrder: "asc",
  });
  return response.data.results;
};

export const createRoboadvisor = async (data: {
  bankAccountId: number;
  name: string;
  riskLevel?: number;
  managementFeePercentage: number;
  custodyFeePercentage: number;
  fundTerPercentage: number;
  totalFeePercentage: number;
  managementFeeFrequency: "monthly" | "quarterly" | "yearly";
  custodyFeeFrequency: "monthly" | "quarterly" | "yearly";
  terPricedInNav?: boolean;
  taxPercentage?: number;
}) => {
  const response = await api.post("/api/v1/bank-account-roboadvisors", data);
  return response.data;
};

export const updateRoboadvisor = async (
  id: number,
  data: {
    name?: string;
    riskLevel?: number;
    managementFeePercentage?: number;
    custodyFeePercentage?: number;
    fundTerPercentage?: number;
    totalFeePercentage?: number;
    managementFeeFrequency?: "monthly" | "quarterly" | "yearly";
    custodyFeeFrequency?: "monthly" | "quarterly" | "yearly";
    terPricedInNav?: boolean;
    taxPercentage?: number;
  },
) => {
  const response = await api.patch(`/api/v1/bank-account-roboadvisors/${id}`, data);
  return response.data;
};

export const deleteRoboadvisor = async (id: number) => {
  await api.delete(`/api/v1/bank-account-roboadvisors/${id}`);
};

// Roboadvisor Balances
export const getRoboadvisorBalances = async (
  roboadvisorId?: number,
  limit = 100,
  cursor?: string,
) => {
  const body = withDefined(
    { limit, sortField: "date", sortOrder: "desc" },
    { roboadvisorId: roboadvisorId, cursor },
  );
  const response = await api.post(
    "/api/v1/bank-account-roboadvisor-balances/find",
    body,
  );
  return response.data;
};

export const createRoboadvisorBalance = async (data: {
  roboadvisorId: number;
  date: string;
  type: "deposit" | "withdrawal" | "adjustment";
  amount: string;
  currencyCode: string;
}) => {
  const response = await api.post("/api/v1/bank-account-roboadvisor-balances", data);
  return response.data;
};

export const updateRoboadvisorBalance = async (
  id: number,
  data: {
    date?: string;
    type?: "deposit" | "withdrawal" | "adjustment";
    amount?: string;
    currencyCode?: string;
  },
) => {
  const response = await api.patch(`/api/v1/bank-account-roboadvisor-balances/${id}`, data);
  return response.data;
};

export const deleteRoboadvisorBalance = async (id: number) => {
  await api.delete(`/api/v1/bank-account-roboadvisor-balances/${id}`);
};

// Roboadvisor Funds
export const getRoboadvisorFunds = async (
  roboadvisorId?: number,
  limit = 100,
  cursor?: string,
) => {
  const body = withDefined({ limit }, { roboadvisorId: roboadvisorId, cursor });
  const response = await api.post("/api/v1/bank-account-roboadvisor-funds/find", body);
  return response.data.results;
};

export const createRoboadvisorFund = async (data: {
  roboadvisorId: number;
  name: string;
  isin: string;
  assetClass: string;
  region: string;
  fundCurrencyCode: string;
  weight: number;
  shareCount?: number;
}) => {
  const response = await api.post("/api/v1/bank-account-roboadvisor-funds", data);
  return response.data;
};

export const updateRoboadvisorFund = async (
  id: number,
  data: {
    name?: string;
    isin?: string;
    assetClass?: string;
    region?: string;
    fundCurrencyCode?: string;
    weight?: number;
    shareCount?: number;
  },
) => {
  const response = await api.patch(`/api/v1/bank-account-roboadvisor-funds/${id}`, data);
  return response.data;
};

export const deleteRoboadvisorFund = async (id: number) => {
  await api.delete(`/api/v1/bank-account-roboadvisor-funds/${id}`);
};

export default {
  getRoboadvisors,
  createRoboadvisor,
  updateRoboadvisor,
  deleteRoboadvisor,
  getRoboadvisorBalances,
  createRoboadvisorBalance,
  updateRoboadvisorBalance,
  deleteRoboadvisorBalance,
  getRoboadvisorFunds,
  createRoboadvisorFund,
  updateRoboadvisorFund,
  deleteRoboadvisorFund,
};
