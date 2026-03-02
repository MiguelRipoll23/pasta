import {
  useBankAccounts,
  useBankAccountBalances,
  useCryptoExchangeBalances,
  useCryptoExchanges,
  useCashBalances,
  useBills,
  useReceipts,
  useSubscriptions,
  useSalaryChanges,
  useBillCategories,
  useRoboadvisors,
  useRoboadvisorBalances,
} from "./useFinanceData";
import { useDashboardKpis } from "./dashboard/useDashboardKpis";
import { useDashboardCharts } from "./dashboard/useDashboardCharts";
import type { Bill } from "../interfaces/bill-interface";
import type { Receipt } from "../interfaces/receipt-interface";
import type { Subscription } from "../interfaces/subscription-interface";
import type { SalaryChange } from "../interfaces/salary-change-interface";
import type { BankAccountBalance } from "../interfaces/bank-account-balance-interface";
import type { CashBalance } from "../interfaces/cash-balance-interface";
import type { BankAccountRoboadvisorBalance } from "../interfaces/bank-account-roboadvisor-balance-interface";

/**
 * Custom hook for Dashboard data that uses React Query
 * Provides progressive loading and automatic caching
 */
export function useDashboardDataOptimized() {
  // Fetch all data using React Query hooks - loads progressively
  const { data: bankAccounts = [], isLoading: bankAccountsLoading, error: bankAccountsError } = useBankAccounts();
  const { data: cryptoExchanges = [], isLoading: cryptoExchangesLoading, error: cryptoExchangesError } = useCryptoExchanges();
  const { data: roboadvisors = [], isLoading: roboadvisorsLoading, error: roboadvisorsError } = useRoboadvisors();
  const { data: billsData, isLoading: billsLoading, error: billsError } = useBills();
  const { data: receiptsData, isLoading: receiptsLoading, error: receiptsError } = useReceipts();
  const { data: subscriptionsData, isLoading: subscriptionsLoading, error: subscriptionsError } = useSubscriptions();
  const { data: salaryChangesData, isLoading: salaryChangesLoading, error: salaryChangesError } = useSalaryChanges();
  const { data: billCategoriesFromApi = [], isLoading: billCategoriesLoading, error: billCategoriesError } = useBillCategories();
  
  const { data: allBankBalancesData, isLoading: bankBalancesLoading, error: bankBalancesError } = useBankAccountBalances();
  const { data: allCashBalancesData, isLoading: cashBalancesLoading, error: cashBalancesError } = useCashBalances();
  const { data: allCryptoBalances = [], isLoading: cryptoBalancesLoading, error: cryptoBalancesError } = useCryptoExchangeBalances();
  const { data: allRoboadvisorBalancesData, isLoading: roboadvisorBalancesLoading, error: roboadvisorBalancesError } = useRoboadvisorBalances();

  const bills = (billsData?.results || []) as Bill[];
  const receipts = (receiptsData || []) as Receipt[];
  const subscriptions = (subscriptionsData || []) as Subscription[];
  const salaryChanges = (salaryChangesData?.results || []) as SalaryChange[];
  const allBankBalances = (allBankBalancesData?.results || []) as BankAccountBalance[];
  const allCashBalances = (allCashBalancesData?.results || []) as CashBalance[];
  const allRoboadvisorBalances = (allRoboadvisorBalancesData?.results || []) as BankAccountRoboadvisorBalance[];

  // Check for any errors in KPI-related queries
  const kpisError = bankAccountsError || bankBalancesError || cashBalancesError || cryptoBalancesError || cryptoExchangesError || roboadvisorBalancesError || roboadvisorsError;
  
  // Check for any errors in chart-related queries
  const chartsError = billsError || receiptsError || subscriptionsError || salaryChangesError || billCategoriesError;

  // Calculate loading states - Don't wait for interest rates (they're optional)
  const loadingKpis = bankAccountsLoading || bankBalancesLoading || 
    cashBalancesLoading || cryptoBalancesLoading || cryptoExchangesLoading ||
    roboadvisorBalancesLoading || roboadvisorsLoading;
  
  const loadingCharts = billsLoading || receiptsLoading || subscriptionsLoading || 
    salaryChangesLoading || billCategoriesLoading;

  const kpis = useDashboardKpis(
    allBankBalances,
    allCashBalances,
    allCryptoBalances,
    allRoboadvisorBalances,
    bankAccounts,
    roboadvisors,
    cryptoExchanges,
    bills,
    receipts,
    subscriptions,
    loadingKpis
  );

  // Calculate chart data - memoized for performance
  const charts = useDashboardCharts(
    bills,
    receipts,
    subscriptions,
    salaryChanges,
    billCategoriesFromApi,
    allBankBalances,
    allCashBalances,
    allCryptoBalances,
    roboadvisors,
    kpis,
    loadingCharts
  );

  // Find latest salary change amount
  let latestSalaryChangeAmount = 0;
  if (salaryChanges && salaryChanges.length > 0) {
    const latest = salaryChanges.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b);
    latestSalaryChangeAmount = parseFloat(latest.netAmount) || 0;
  }
  return {
    kpis,
    charts,
    latestSalaryChangeAmount,
    loadingKpis,
    loadingCharts,
    kpisError,
    chartsError,
    rawData: {
      bankAccounts,
      cryptoExchanges,
      bills,
      receipts,
      subscriptions,
      salaryChanges,
      billCategoriesFromApi,
      allBankBalances,
      allCashBalances,
      allCryptoBalances,
    },
  };
}
