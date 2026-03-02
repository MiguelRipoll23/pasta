import { useMemo } from "react";
import type { Bill } from "../../interfaces/bill-interface";
import type { Receipt } from "../../interfaces/receipt-interface";
import type { Subscription } from "../../interfaces/subscription-interface";
import type { BillCategory } from "../../interfaces/bill-category-interface";
import type { BankAccountBalance } from "../../interfaces/bank-account-balance-interface";
import type { CashBalance } from "../../interfaces/cash-balance-interface";
import type { CryptoExchangeBalance } from "../../interfaces/crypto-exchange-balance-interface";
import type { BankAccountRoboadvisor } from "../../interfaces/bank-account-roboadvisor-interface";
import type { 
  ChartData, 
  NetWorthPoint, 
  BalanceEvent, 
  KpiData 
} from "../../interfaces/dashboard-data-interface";

interface SalaryChange {
  netAmount: string;
  recurrence: "weekly" | "bi-weekly" | "monthly" | "yearly";
}

const toMonthlyAmount = (amount: number, recurrence: SalaryChange["recurrence"]): number => {
  switch (recurrence) {
    case "weekly":
      return amount * 4.33;
    case "bi-weekly":
      return amount * 2.17;
    case "yearly":
      return amount / 12;
    case "monthly":
    default:
      return amount;
  }
};

const normalize = (c: string) => (c ? c.replace(/_/g, " ").charAt(0).toUpperCase() + c.replace(/_/g, " ").slice(1).toLowerCase() : "Uncategorized");

export function useDashboardCharts(
  bills: Bill[],
  receipts: Receipt[],
  subscriptions: Subscription[],
  salaryChanges: SalaryChange[],
  billCategoriesFromApi: BillCategory[],
  allBankBalances: BankAccountBalance[],
  allCashBalances: CashBalance[],
  allCryptoBalances: CryptoExchangeBalance[],
  roboadvisors: BankAccountRoboadvisor[],
  kpis: KpiData | null,
  loadingCharts: boolean
): ChartData | null {
  return useMemo((): ChartData | null => {
    if (loadingCharts || !kpis) return null;

    // Bills history by category
    const billsMap: Record<string, Record<string, string | number | null>> = {};
    const billCategories = new Set<string>();

    (bills || []).forEach((b: Bill) => {
      const month = b.date.substring(0, 7);
      if (!billsMap[month]) billsMap[month] = { date: month };
      const cat = normalize(b.category);
      billCategories.add(cat);
      const amount = parseFloat(String(b.totalAmount || "0"));
      billsMap[month][cat] = ((billsMap[month][cat] as number) || 0) + (isNaN(amount) ? 0 : amount);
    });

    const sortedBillCats = Array.from(billCategories);
    const billHistory = Object.keys(billsMap)
      .sort()
      .map((m) => {
        const p = { ...billsMap[m] };
        let total = 0;
        sortedBillCats.forEach((c) => {
          if (p[c] === undefined) p[c] = null;
          else total += p[c] as number;
        });
        p["Total"] = total;
        return p;
      });

    const categoriesToTrend = [...sortedBillCats, "Total"];
    categoriesToTrend.forEach((cat) => {
      const dataPoints = billHistory
        .map((p, index) => ({ x: index, y: p[cat] }))
        .filter((p) => p.y !== null && p.y !== undefined);

      if (dataPoints.length > 1) {
        const n = dataPoints.length;
        let sumX = 0,
          sumY = 0,
          sumXY = 0,
          sumX2 = 0;
        dataPoints.forEach((p) => {
          sumX += p.x;
          sumY += p.y as number;
          sumXY += p.x * (p.y as number);
          sumX2 += p.x * p.x;
        });

        const denominator = n * sumX2 - sumX * sumX;
        if (denominator !== 0) {
          const m = (n * sumXY - sumX * sumY) / denominator;
          const b = (sumY - m * sumX) / n;

          billHistory.forEach((p, index) => {
            p[`${cat} Trend`] = m * index + b;
          });
        }
      }
    });

    // Receipts by merchant
    const now = new Date();
    const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const receiptsListMap: Record<string, number> = {};
    let currentMonthReceiptsTotal = 0;

    (receipts || []).forEach((r: Receipt) => {
      const dateStr = r.date || r.receiptDate;
      if (dateStr?.substring(0, 7) === curMonth) {
        const mName = r.merchant?.name || "Unknown Merchant";
        const amount = r.totalAmount ? parseFloat(String(r.totalAmount)) : 0;
        if (!isNaN(amount)) {
          receiptsListMap[mName] = (receiptsListMap[mName] || 0) + amount;
          currentMonthReceiptsTotal += amount;
        }
      }
    });

    const sortedReceiptsList = Object.entries(receiptsListMap)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    // Subscriptions list
    const subscriptionsListMap: Record<string, number> = {};
    let currentMonthSubscriptionsTotal = 0;

    if (Array.isArray(subscriptions)) {
      subscriptions.forEach((s: Subscription) => {
        const name = s.plan ? `${s.name} (${s.plan})` : s.name;
        const amount = s.amount ? parseFloat(String(s.amount)) : 0;
        if (!isNaN(amount)) {
          let monthlyAmount = amount;
          
          switch (s.recurrence) {
            case "weekly":
              monthlyAmount = amount * 4.33;
              break;
            case "bi-weekly":
              monthlyAmount = amount * 2.17;
              break;
            case "yearly":
              monthlyAmount = amount / 12;
              break;
            case "monthly":
            default:
              monthlyAmount = amount;
          }

          subscriptionsListMap[name] = (subscriptionsListMap[name] || 0) + monthlyAmount;
          currentMonthSubscriptionsTotal += monthlyAmount;
        }
      });
    }

    const sortedSubscriptionsList = Object.entries(subscriptionsListMap)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    const portfolioData = [{ name: "Liquid", value: kpis.liquidMoney }, { name: "Invested", value: kpis.investedMoney }];

    let monthlySalary = 0;
    if (Array.isArray(salaryChanges) && salaryChanges.length > 0) {
      const mostRecentSalary = salaryChanges[0];
      const amount = parseFloat(mostRecentSalary.netAmount || "0");
      if (!isNaN(amount)) {
        monthlySalary = toMonthlyAmount(amount, mostRecentSalary.recurrence);
      }
    }

    const monthlyInterest = Math.max(kpis.monthlyInterestIncome, 0);
    const billsOut = Math.max(kpis.monthlyBills, 0);
    const receiptsOut = Math.max(kpis.monthlyReceipts, 0);
    const subscriptionsOut = Math.max(kpis.monthlySubscriptions, 0);
    const totalOut = billsOut + receiptsOut + subscriptionsOut;
    const totalIn = Math.max(monthlySalary, 0) + monthlyInterest;
    const netFlow = totalIn - totalOut;

    const liquidFlowNodeNames = ["Salary", "Interest", "Liquid Money", "Bills", "Merchants", "Subscriptions"] as const;
    const liquidFlowNodes = liquidFlowNodeNames.map((name) => ({ name }));
    const getLiquidFlowNodeIndex = (name: (typeof liquidFlowNodeNames)[number]) => liquidFlowNodeNames.indexOf(name);

    const liquidFlow = {
      nodes: liquidFlowNodes,
      links: [
        {
          source: getLiquidFlowNodeIndex("Salary"),
          target: getLiquidFlowNodeIndex("Liquid Money"),
          value: Math.max(monthlySalary, 0),
        },
        {
          source: getLiquidFlowNodeIndex("Interest"),
          target: getLiquidFlowNodeIndex("Liquid Money"),
          value: monthlyInterest,
        },
        {
          source: getLiquidFlowNodeIndex("Liquid Money"),
          target: getLiquidFlowNodeIndex("Bills"),
          value: billsOut,
        },
        {
          source: getLiquidFlowNodeIndex("Liquid Money"),
          target: getLiquidFlowNodeIndex("Merchants"),
          value: receiptsOut,
        },
        {
          source: getLiquidFlowNodeIndex("Liquid Money"),
          target: getLiquidFlowNodeIndex("Subscriptions"),
          value: subscriptionsOut,
        },
      ].filter((link) => link.value > 0),
    };

    // Net worth historical data calculation
    const allBalanceEvents: BalanceEvent[] = [];
    (allBankBalances || []).forEach((b: BankAccountBalance) => {
      const balance = parseFloat(String(b.balance || "0"));
      if (!isNaN(balance)) {
        allBalanceEvents.push({ date: b.createdAt.split("T")[0], type: "bank", id: b.bankAccountId, balance });
      }
    });
    (allCashBalances || []).forEach((b: CashBalance) => {
      const balance = parseFloat(String(b.balance || "0"));
      if (!isNaN(balance)) {
        allBalanceEvents.push({ date: b.createdAt.split("T")[0], type: "cash", id: b.cashId, balance });
      }
    });
    (allCryptoBalances || []).forEach((b: CryptoExchangeBalance) => {
      const fallbackValue = b.symbolCode === "USDT" || b.symbolCode === "USDC" ? parseFloat(String(b.balance || "0")) : 0;
      const invested = b.investedAmount ? parseFloat(String(b.investedAmount)) : fallbackValue;
      const balance = parseFloat(String(b.balance || "0"));
      if (!isNaN(balance)) {
        allBalanceEvents.push({ date: b.createdAt.split("T")[0], type: "crypto", id: b.cryptoExchangeId, balance, symbol: b.symbolCode, value: isNaN(invested) ? fallbackValue : invested });
      }
    });
    (roboadvisors || []).forEach((advisor: BankAccountRoboadvisor) => {
      const currentValue = advisor.latestCalculation?.currentValue;
      if (currentValue) {
        const value = parseFloat(String(currentValue));
        if (!isNaN(value)) {
          allBalanceEvents.push({ date: advisor.latestCalculation?.calculatedAt?.split("T")[0] || new Date().toISOString().split("T")[0], type: "roboadvisor", id: advisor.id, balance: value, value });
        }
      }
    });

    allBalanceEvents.sort((a, b) => a.date.localeCompare(b.date));
    const nwMap: Record<string, number> = {};
    const curBals: Record<string, number> = {};
    Array.from(new Set(allBalanceEvents.map((e) => e.date))).forEach((date) => {
      allBalanceEvents.filter((e) => e.date === date).forEach((e) => {
        curBals[`${e.type}-${e.id}-${e.symbol || ""}`] = e.value ?? e.balance;
      });
      let total = 0;
      Object.entries(curBals).forEach(([key, val]) => {
        if (key.startsWith("bank-") || key.startsWith("cash-") || key.startsWith("crypto-") || key.startsWith("roboadvisor-")) total += val;
      });
      nwMap[date] = total;
    });

    const allHistory = Object.entries(nwMap).sort((a, b) => a[0].localeCompare(b[0])).map(([date, value]) => ({ date, value }));

    const monthlyMap: Record<string, NetWorthPoint> = {};
    allHistory.forEach((entry) => {
      const month = entry.date.substring(0, 7);
      if (!monthlyMap[month] || entry.date > monthlyMap[month].date) monthlyMap[month] = entry;
    });

    const history = Object.values(monthlyMap).sort((a, b) => a.date.localeCompare(b.date));

    const projection: NetWorthPoint[] = [];
    if (history.length) {
      const last = history[history.length - 1];
      const monthlyGrowth = kpis.monthlyInterestIncome;
      const lastValue = last.value ?? 0;

      last.projection = lastValue;
      for (let i = 1; i <= 6; i++) {
        const d = new Date(last.date);
        d.setMonth(d.getMonth() + i);
        projection.push({ date: d.toISOString().split("T")[0], projection: lastValue + monthlyGrowth * i + monthlySalary * i });
      }
    }

    const netWorthData = [...history, ...projection];

    const favoritedCategories = new Set<string>();
    const categoryColors: Record<string, string> = {};
    const usedColors = new Set<string>();
    const DEFAULT_LINE_COLORS = ["#10b981", "#3b82f6", "#f87171", "#fbbf24", "#a78bfa", "#f472b6", "#2dd4bf"];

    if (Array.isArray(billCategoriesFromApi)) {
      (billCategoriesFromApi || []).forEach((cat) => {
        if (cat.name) {
          const normalizedName = normalize(cat.name);
          if (cat.hexColor) {
            categoryColors[normalizedName] = cat.hexColor;
            usedColors.add(cat.hexColor.toLowerCase());
          }
          if (cat.favoritedAt !== null) {
            const matchingCat = sortedBillCats.find((billCat) => normalize(billCat) === normalizedName);
            if (matchingCat) favoritedCategories.add(matchingCat);
          }
        }
      });
    }

    let defaultColorIndex = 0;
    sortedBillCats.forEach((cat) => {
      if (!categoryColors[cat]) {
        let attempts = 0;
        while (attempts < DEFAULT_LINE_COLORS.length) {
          const candidateColor = DEFAULT_LINE_COLORS[defaultColorIndex % DEFAULT_LINE_COLORS.length];
          if (!usedColors.has(candidateColor.toLowerCase())) {
            categoryColors[cat] = candidateColor;
            usedColors.add(candidateColor.toLowerCase());
            defaultColorIndex++;
            break;
          }
          defaultColorIndex++;
          attempts++;
        }
        if (!categoryColors[cat]) {
          categoryColors[cat] = DEFAULT_LINE_COLORS[defaultColorIndex % DEFAULT_LINE_COLORS.length];
          defaultColorIndex++;
        }
      }
    });
    categoryColors["Total"] = DEFAULT_LINE_COLORS[0];

    return {
      portfolio: portfolioData,
      liquidFlow,
      liquidFlowSummary: {
        gained: totalIn,
        lost: totalOut,
        netChange: netFlow,
      },
      netWorth: netWorthData,
      bills: billHistory,
      billCategories: sortedBillCats,
      receipts: sortedReceiptsList,
      totalReceipts: currentMonthReceiptsTotal,
      subscriptions: sortedSubscriptionsList,
      totalSubscriptions: currentMonthSubscriptionsTotal,
      favoritedBillCategories: favoritedCategories,
      billCategoryColors: categoryColors,
    };
  }, [
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
    loadingCharts,
  ]);
}

export default useDashboardCharts;
