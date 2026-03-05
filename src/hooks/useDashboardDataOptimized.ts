import {
  useDashboardKpis,
  useDashboardNetWorth,
  useDashboardPortfolio,
  useDashboardMoneyFlow,
  useDashboardMonthlyExpenses,
  useDashboardLists,
} from "./dashboard/useDashboardQueries";
import type { KpiData, ChartData } from "../interfaces/dashboard-data-interface";

/**
 * Custom hook for Dashboard data using the optimized server-side aggregate endpoints.
 * Replaces the previous multi-request approach with 6 focused API calls.
 */
export function useDashboardDataOptimized() {
  const { data: kpisData, isLoading: loadingKpis, error: kpisError } =
    useDashboardKpis();
  const { data: netWorthData, isLoading: loadingNetWorth, error: netWorthError } =
    useDashboardNetWorth();
  const { data: portfolioData, isLoading: loadingPortfolio, error: portfolioError } =
    useDashboardPortfolio();
  const { data: moneyFlowData, isLoading: loadingMoneyFlow, error: moneyFlowError } =
    useDashboardMoneyFlow();
  const {
    data: monthlyExpensesData,
    isLoading: loadingMonthlyExpenses,
    error: monthlyExpensesError,
  } = useDashboardMonthlyExpenses();
  const { data: listsData, isLoading: loadingLists, error: listsError } =
    useDashboardLists();

  const loadingCharts =
    loadingNetWorth || loadingPortfolio || loadingMoneyFlow || loadingMonthlyExpenses || loadingLists;

  const chartsError = netWorthError || portfolioError || moneyFlowError || monthlyExpensesError || listsError;

  // Map server KPIs response → KpiData interface used by DashboardPage
  const kpis: KpiData | null = kpisData
    ? {
        liquidMoney: kpisData.liquidMoney,
        investedMoney: kpisData.investedMoney,
        totalInvestedCost: kpisData.totalInvestedCost,
        monthlyExpenses:
          kpisData.monthlyBills +
          kpisData.monthlyReceipts +
          kpisData.monthlySubscriptions,
        monthlyInterestIncome: kpisData.monthlyInterestIncome,
        monthlyBills: kpisData.monthlyBills,
        monthlyReceipts: kpisData.monthlyReceipts,
        monthlySubscriptions: kpisData.monthlySubscriptions,
        currencyCode: kpisData.currencyCode,
      }
    : null;

  // Map all chart responses → ChartData interface used by DashboardPage
  const charts: ChartData | null =
    !loadingCharts &&
    netWorthData &&
    portfolioData &&
    moneyFlowData &&
    monthlyExpensesData &&
    listsData
      ? {
          portfolio: portfolioData.portfolio,
          liquidFlow: moneyFlowData.liquidFlow,
          liquidFlowSummary: moneyFlowData.liquidFlowSummary,
          netWorth: netWorthData.netWorth,
          bills: monthlyExpensesData.bills,
          billCategories: monthlyExpensesData.billCategories,
          billCategoryColors: monthlyExpensesData.billCategoryColors,
          // Convert string[] → Set<string> for compatibility with BillsHistoryCard
          favoritedBillCategories: new Set(monthlyExpensesData.favoritedBillCategories),
          receipts: listsData.receipts,
          totalReceipts: listsData.totalReceipts,
          subscriptions: listsData.subscriptions,
          totalSubscriptions: listsData.totalSubscriptions,
        }
      : null;

  return {
    kpis,
    charts,
    loadingKpis,
    loadingCharts,
    kpisError,
    chartsError,
  };
}
