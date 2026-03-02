export interface KpiData {
  liquidMoney: number;
  investedMoney: number;
  totalInvestedCost: number;
  monthlyExpenses: number;
  monthlyInterestIncome: number;
  monthlyBills: number;
  monthlyReceipts: number;
  monthlySubscriptions: number;
  currencyCode: string;
}

export interface NetWorthPoint {
  date: string;
  value?: number;
  projection?: number;
}

export interface ChartData {
  portfolio: { name: string; value: number }[];
  liquidFlow: {
    nodes: { name: string }[];
    links: { source: number; target: number; value: number }[];
  };
  liquidFlowSummary: {
    gained: number;
    lost: number;
    netChange: number;
  };
  netWorth: NetWorthPoint[];
  bills: Record<string, string | number | null>[];
  billCategories: string[];
  receipts: { name: string; total: number }[];
  totalReceipts: number;
  subscriptions: { name: string; total: number }[];
  totalSubscriptions: number;
  favoritedBillCategories: Set<string>;
  billCategoryColors: Record<string, string>;
}

export interface BalanceEvent {
  date: string;
  type: string;
  id: number;
  balance: number;
  symbol?: string;
  value?: number;
}
