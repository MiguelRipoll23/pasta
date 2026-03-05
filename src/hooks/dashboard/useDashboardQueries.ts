import { useQuery } from "@tanstack/react-query";
import {
  getDashboardKpis,
  getDashboardNetWorth,
  getDashboardPortfolio,
  getDashboardMoneyFlow,
  getDashboardMonthlyExpenses,
  getDashboardLists,
} from "../../services/api/dashboard";

export const dashboardQueryKeys = {
  kpis: ["dashboard", "kpis"] as const,
  netWorth: ["dashboard", "netWorth"] as const,
  portfolio: ["dashboard", "portfolio"] as const,
  moneyFlow: ["dashboard", "moneyFlow"] as const,
  monthlyExpenses: ["dashboard", "monthlyExpenses"] as const,
  lists: ["dashboard", "lists"] as const,
};

export function useDashboardKpis() {
  return useQuery({
    queryKey: dashboardQueryKeys.kpis,
    queryFn: getDashboardKpis,
  });
}

export function useDashboardNetWorth() {
  return useQuery({
    queryKey: dashboardQueryKeys.netWorth,
    queryFn: getDashboardNetWorth,
  });
}

export function useDashboardPortfolio() {
  return useQuery({
    queryKey: dashboardQueryKeys.portfolio,
    queryFn: getDashboardPortfolio,
  });
}

export function useDashboardMoneyFlow() {
  return useQuery({
    queryKey: dashboardQueryKeys.moneyFlow,
    queryFn: getDashboardMoneyFlow,
  });
}

export function useDashboardMonthlyExpenses() {
  return useQuery({
    queryKey: dashboardQueryKeys.monthlyExpenses,
    queryFn: getDashboardMonthlyExpenses,
  });
}

export function useDashboardLists() {
  return useQuery({
    queryKey: dashboardQueryKeys.lists,
    queryFn: getDashboardLists,
  });
}
