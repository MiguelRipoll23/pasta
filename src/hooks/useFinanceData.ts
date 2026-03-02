import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getBankAccounts } from '../services/api/accounts';
import { getBankAccountBalances } from '../services/api/accounts';
import { getBankAccountInterestRates } from '../services/api/accounts';
import { getCryptoExchanges } from '../services/api/cryptoExchanges';
import { getCryptoExchangeBalances } from '../services/api/cryptoExchanges';
import { getCash } from '../services/api/cash';
import { getCashBalances } from '../services/api/cash';
import { getReceipts } from '../services/api/billing';
import { getBills } from '../services/api/bills';
import { getSubscriptions } from '../services/api/subscriptions';
import { getBillCategories } from '../services/api/billCategories';
import { getSalaryChanges } from '../services/api/salaryChanges';
import { getRoboadvisors } from '../services/api/roboadvisor';
import { getRoboadvisorBalances } from '../services/api/roboadvisor';
import { getRoboadvisorFunds } from '../services/api/roboadvisor';
import { getMerchants, getReceipts as getMerchantReceipts } from '../services/api/merchants';
import { getChatModels } from '../services/api/chat';

// Query keys for cache management
export const queryKeys = {
  bankAccounts: ['bankAccounts'] as const,
  bankAccountBalances: (accountId?: number) =>
    accountId ? ['bankAccountBalances', accountId] : ['bankAccountBalances'] as const,
  bankAccountInterestRates: (accountId?: number) =>
    accountId ? ['bankAccountInterestRates', accountId] : ['bankAccountInterestRates'] as const,

  cryptoExchanges: ['cryptoExchanges'] as const,
  cryptoExchangeBalances: (exchangeId?: number) =>
    exchangeId ? ['cryptoExchangeBalances', exchangeId] : ['cryptoExchangeBalances'] as const,

  cash: ['cash'] as const,
  cashBalances: (cashId?: number) =>
    cashId ? ['cashBalances', cashId] : ['cashBalances'] as const,

  bills: ['bills'] as const,
  receipts: ['receipts'] as const,
  subscriptions: ['subscriptions'] as const,
  billCategories: ['billCategories'] as const,

  merchants: ['merchants'] as const,
  merchantReceipts: (merchantId?: number) =>
    merchantId ? ['merchantReceipts', merchantId] : ['merchantReceipts'] as const,

  salaryChanges: ['salaryChanges'] as const,

  roboadvisors: ['roboadvisors'] as const,
  roboadvisorBalances: (roboadvisorId?: number) =>
    roboadvisorId ? ['roboadvisorBalances', roboadvisorId] : ['roboadvisorBalances'] as const,
  roboadvisorFunds: (roboadvisorId?: number) =>
    roboadvisorId ? ['roboadvisorFunds', roboadvisorId] : ['roboadvisorFunds'] as const,

  chatModels: ['chatModels'] as const,
};

// Bank Accounts Hooks
export function useBankAccounts() {
  return useQuery({
    queryKey: queryKeys.bankAccounts,
    queryFn: () => getBankAccounts(),
  });
}

export function useBankAccountBalances(accountId?: number) {
  return useQuery({
    queryKey: queryKeys.bankAccountBalances(accountId),
    queryFn: () => getBankAccountBalances(accountId),
  });
}

export function useInfiniteBankAccountBalances(accountId?: number, limit = 20) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.bankAccountBalances(accountId), 'infinite'],
    queryFn: ({ pageParam }) => getBankAccountBalances(accountId, limit, pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    enabled: accountId !== undefined,
  });
}

export function useBankAccountInterestRates(accountId?: number) {
  return useQuery({
    queryKey: queryKeys.bankAccountInterestRates(accountId),
    queryFn: () => getBankAccountInterestRates(accountId!),
    enabled: accountId !== undefined,
  });
}

export function useInfiniteBankAccountInterestRates(accountId: number, limit = 20) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.bankAccountInterestRates(accountId), 'infinite'],
    queryFn: ({ pageParam }) => getBankAccountInterestRates(accountId, limit, pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    enabled: accountId !== undefined,
  });
}

// Crypto Exchange Hooks
export function useCryptoExchanges() {
  return useQuery({
    queryKey: queryKeys.cryptoExchanges,
    queryFn: () => getCryptoExchanges(),
  });
}

export function useCryptoExchangeBalances(exchangeId?: number) {
  return useQuery({
    queryKey: queryKeys.cryptoExchangeBalances(exchangeId),
    queryFn: () => getCryptoExchangeBalances(exchangeId),
  });
}

// Cash Hooks
export function useCash() {
  return useQuery({
    queryKey: queryKeys.cash,
    queryFn: () => getCash(),
  });
}

export function useCashBalances(cashId?: number) {
  return useQuery({
    queryKey: queryKeys.cashBalances(cashId),
    queryFn: () => getCashBalances(cashId),
  });
}

export function useInfiniteCashBalances(cashId?: number, limit = 20) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.cashBalances(cashId), 'infinite'],
    queryFn: ({ pageParam }) => getCashBalances(cashId, limit, pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    enabled: cashId !== undefined,
  });
}

// Bills & Categories Hooks
export function useBills() {
  return useQuery({
    queryKey: queryKeys.bills,
    queryFn: () => getBills(),
  });
}

export function useInfiniteBills(limit = 20) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.bills, 'infinite'],
    queryFn: ({ pageParam }) => getBills(limit, pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
}

export function useReceipts() {
  return useQuery({
    queryKey: queryKeys.receipts,
    queryFn: () => getReceipts(),
  });
}

export function useSubscriptions() {
  return useQuery({
    queryKey: queryKeys.subscriptions,
    queryFn: () => getSubscriptions(),
  });
}

export function useBillCategories() {
  return useQuery({
    queryKey: queryKeys.billCategories,
    queryFn: () => getBillCategories(),
  });
}

// Merchants Hooks
export function useMerchants() {
  return useQuery({
    queryKey: queryKeys.merchants,
    queryFn: () => getMerchants(),
  });
}

export function useMerchantReceipts(merchantId?: number) {
  return useQuery({
    queryKey: queryKeys.merchantReceipts(merchantId),
    queryFn: () => getMerchantReceipts(merchantId),
  });
}

export function useInfiniteMerchantReceipts(merchantId?: number, limit = 20) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.merchantReceipts(merchantId), 'infinite'],
    queryFn: ({ pageParam }) => getMerchantReceipts(merchantId, limit, pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
}

// Salary Changes Hook
export function useSalaryChanges() {
  return useQuery({
    queryKey: queryKeys.salaryChanges,
    queryFn: () => getSalaryChanges(),
  });
}

export function useInfiniteSalaryChanges(limit = 20) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.salaryChanges, 'infinite'],
    queryFn: ({ pageParam }) => getSalaryChanges(limit, pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
}

// Roboadvisor Hooks
export function useRoboadvisors() {
  return useQuery({
    queryKey: queryKeys.roboadvisors,
    queryFn: () => getRoboadvisors(),
  });
}

export function useRoboadvisorBalances(roboadvisorId?: number) {
  return useQuery({
    queryKey: queryKeys.roboadvisorBalances(roboadvisorId),
    queryFn: () => getRoboadvisorBalances(roboadvisorId),
  });
}

export function useInfiniteRoboadvisorBalances(roboadvisorId?: number, limit = 20) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.roboadvisorBalances(roboadvisorId), 'infinite'],
    queryFn: ({ pageParam }) => getRoboadvisorBalances(roboadvisorId, limit, pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    enabled: roboadvisorId !== undefined,
  });
}

export function useRoboadvisorFunds(roboadvisorId?: number) {
  return useQuery({
    queryKey: queryKeys.roboadvisorFunds(roboadvisorId),
    queryFn: () => getRoboadvisorFunds(roboadvisorId),
    enabled: roboadvisorId !== undefined,
  });
}

// Chat Models Hook
export function useChatModels() {
  return useQuery({
    queryKey: queryKeys.chatModels,
    queryFn: () => getChatModels(),
    staleTime: 1000 * 60 * 60, // 1 hour - models don't change often
  });
}

// Cache invalidation utilities
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return {
    invalidateBankAccounts: () => queryClient.invalidateQueries({ queryKey: queryKeys.bankAccounts }),
    invalidateBankAccountBalances: (accountId?: number) => 
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccountBalances(accountId) }),
    invalidateBankAccountInterestRates: (accountId?: number) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccountInterestRates(accountId) }),
    
    invalidateCryptoExchanges: () => queryClient.invalidateQueries({ queryKey: queryKeys.cryptoExchanges }),
    invalidateCryptoExchangeBalances: (exchangeId?: number) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.cryptoExchangeBalances(exchangeId) }),
    
    invalidateCash: () => queryClient.invalidateQueries({ queryKey: queryKeys.cash }),
    invalidateCashBalances: (cashId?: number) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.cashBalances(cashId) }),
    
    invalidateBills: () => queryClient.invalidateQueries({ queryKey: queryKeys.bills }),
    invalidateReceipts: () => queryClient.invalidateQueries({ queryKey: queryKeys.receipts }),
    invalidateSubscriptions: () => queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions }),
    invalidateBillCategories: () => queryClient.invalidateQueries({ queryKey: queryKeys.billCategories }),
    
    invalidateMerchants: () => queryClient.invalidateQueries({ queryKey: queryKeys.merchants }),
    invalidateMerchantReceipts: (merchantId?: number) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantReceipts(merchantId) }),

    invalidateSalaryChanges: () => queryClient.invalidateQueries({ queryKey: queryKeys.salaryChanges }),
    
    invalidateRoboadvisors: () => queryClient.invalidateQueries({ queryKey: queryKeys.roboadvisors }),
    invalidateRoboadvisorBalances: (roboadvisorId?: number) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.roboadvisorBalances(roboadvisorId) }),
    invalidateRoboadvisorFunds: (roboadvisorId?: number) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.roboadvisorFunds(roboadvisorId) }),

    invalidateChatModels: () => queryClient.invalidateQueries({ queryKey: queryKeys.chatModels }),

    invalidateDashboardData: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccountBalances() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cryptoExchanges });
      queryClient.invalidateQueries({ queryKey: queryKeys.cryptoExchangeBalances() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cashBalances() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bills });
      queryClient.invalidateQueries({ queryKey: queryKeys.receipts });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions });
      queryClient.invalidateQueries({ queryKey: queryKeys.salaryChanges });
      queryClient.invalidateQueries({ queryKey: queryKeys.billCategories });
      queryClient.invalidateQueries({ queryKey: queryKeys.roboadvisors });
      queryClient.invalidateQueries({ queryKey: queryKeys.roboadvisorBalances() });
    },
  };
}
