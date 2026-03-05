import api from "../httpClient";
import type {
  DashboardKpisResponse,
  DashboardNetWorthResponse,
  DashboardPortfolioResponse,
  DashboardMoneyFlowResponse,
  DashboardMonthlyExpensesResponse,
  DashboardListsResponse,
} from "../../interfaces/dashboard-api-interface";

export const getDashboardKpis = async (): Promise<DashboardKpisResponse> => {
  const response = await api.get("/api/v1/dashboard/kpis");
  return response.data;
};

export const getDashboardNetWorth = async (): Promise<DashboardNetWorthResponse> => {
  const response = await api.get("/api/v1/dashboard/net-worth");
  return response.data;
};

export const getDashboardPortfolio = async (): Promise<DashboardPortfolioResponse> => {
  const response = await api.get("/api/v1/dashboard/portfolio");
  return response.data;
};

export const getDashboardMoneyFlow = async (): Promise<DashboardMoneyFlowResponse> => {
  const response = await api.get("/api/v1/dashboard/money-flow");
  return response.data;
};

export const getDashboardMonthlyExpenses = async (): Promise<DashboardMonthlyExpensesResponse> => {
  const response = await api.get("/api/v1/dashboard/monthly-expenses");
  return response.data;
};

export const getDashboardLists = async (): Promise<DashboardListsResponse> => {
  const response = await api.get("/api/v1/dashboard/lists");
  return response.data;
};

export default {
  getDashboardKpis,
  getDashboardNetWorth,
  getDashboardPortfolio,
  getDashboardMoneyFlow,
  getDashboardMonthlyExpenses,
  getDashboardLists,
};
