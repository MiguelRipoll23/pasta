import api from "../httpClient";
import { withDefined } from "../../utils/request-body-utils";

export const getCryptoExchanges = async (limit = 100) => {
  const response = await api.post("/api/v1/crypto-exchanges/find", {
    limit,
    sortField: "name",
    sortOrder: "asc",
  });
  return response.data.results;
};

export const createCryptoExchange = async (name: string, taxPercentage?: number | null) => {
  const response = await api.post("/api/v1/crypto-exchanges", {
    name,
    taxPercentage,
  });
  return response.data;
};

export const updateCryptoExchange = async (
  id: number,
  name: string,
  taxPercentage?: number | null,
) => {
  const response = await api.patch(`/api/v1/crypto-exchanges/${id}`, {
    name,
    taxPercentage,
  });
  return response.data;
};

export const deleteCryptoExchange = async (id: number) => {
  await api.delete(`/api/v1/crypto-exchanges/${id}`);
};

export const getCryptoExchangeBalances = async (cryptoExchangeId?: number, limit = 100) => {
  const body = withDefined(
    {
      limit,
      sortOrder: "desc",
    },
    { cryptoExchangeId },
  );
  const response = await api.post(
    "/api/v1/crypto-exchange-balances/find",
    body,
  );
  return response.data.results;
};

export const createCryptoExchangeBalance = async (data: {
  cryptoExchangeId: number;
  balance: string;
  symbolCode: string;
  investedAmount?: string;
  investedCurrencyCode?: string;
}) => {
  const response = await api.post("/api/v1/crypto-exchange-balances", data);
  return response.data;
};

export const updateCryptoExchangeBalance = async (
  id: number,
  data: {
    balance: string;
    symbolCode: string;
    investedAmount?: string;
    investedCurrencyCode?: string;
  },
) => {
  const response = await api.patch(
    `/api/v1/crypto-exchange-balances/${id}`,
    data,
  );
  return response.data;
};

export const deleteCryptoExchangeBalance = async (id: number) => {
  await api.delete(`/api/v1/crypto-exchange-balances/${id}`);
};

export default {
  getCryptoExchanges,
  createCryptoExchange,
  updateCryptoExchange,
  deleteCryptoExchange,
  getCryptoExchangeBalances,
  createCryptoExchangeBalance,
  updateCryptoExchangeBalance,
  deleteCryptoExchangeBalance,
};
