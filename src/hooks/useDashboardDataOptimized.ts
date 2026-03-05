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
        liquidMoney: parseFloat(kpisData.liquidMoney),
        investedMoney: parseFloat(kpisData.investedMoney),
        totalInvestedCost: parseFloat(kpisData.totalInvestedCost),
        monthlyExpenses:
          parseFloat(kpisData.monthlyBills) +
          parseFloat(kpisData.monthlyReceipts) +
          parseFloat(kpisData.monthlySubscriptions),
        monthlyInterestIncome: parseFloat(kpisData.monthlyInterestIncome),
        monthlyBills: parseFloat(kpisData.monthlyBills),
        monthlyReceipts: parseFloat(kpisData.monthlyReceipts),
        monthlySubscriptions: parseFloat(kpisData.monthlySubscriptions),
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
          portfolio: portfolioData.portfolio.map((item) => ({
            name: item.name,
            value: parseFloat(item.value),
          })),
          liquidFlow: {
            nodes: moneyFlowData.liquidFlow.nodes,
            links: moneyFlowData.liquidFlow.links.map((link) => ({
              ...link,
              value: parseFloat(link.value),
            })),
          },
          liquidFlowSummary: {
            gained: parseFloat(moneyFlowData.liquidFlowSummary.gained),
            lost: parseFloat(moneyFlowData.liquidFlowSummary.lost),
            netChange: parseFloat(moneyFlowData.liquidFlowSummary.netChange),
          },
          netWorth: netWorthData.netWorth.map((point) => ({
            date: point.date,
            value: point.value !== undefined ? parseFloat(point.value) : undefined,
            projection: point.projection !== undefined ? parseFloat(point.projection) : undefined,
          })),
          bills: monthlyExpensesData.bills,
          billCategories: monthlyExpensesData.billCategories,
          billCategoryColors: monthlyExpensesData.billCategoryColors,
          // Convert string[] → Set<string> for compatibility with BillsHistoryCard
          favoritedBillCategories: new Set(monthlyExpensesData.favoritedBillCategories),
          receipts: listsData.receipts.map((item) => ({
            name: item.name,
            total: parseFloat(item.total),
          })),
          totalReceipts: parseFloat(listsData.totalReceipts),
          subscriptions: listsData.subscriptions.map((item) => ({
            name: item.name,
            total: parseFloat(item.total),
          })),
          totalSubscriptions: parseFloat(listsData.totalSubscriptions),
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
