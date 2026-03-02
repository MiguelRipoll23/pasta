import type { BankAccount } from "../interfaces/bank-account-interface";
import type { BankAccountBalance } from "../interfaces/bank-account-detail/bank-account-balance-interface";

export const getBankAccountSummary = (account: BankAccount, balances: BankAccountBalance[]) => {
  const currentBalance = balances.length > 0 ? parseFloat(balances[0].balance) : 0;
  const currencyCode = balances.length > 0 ? balances[0].currencyCode : "EUR";
  const latestRate = balances.length > 0 ? balances[0].interestRate : null;
  const monthlyProfit = account.latestCalculation?.monthlyProfit ? parseFloat(account.latestCalculation.monthlyProfit) : 0;
  const annualProfit = account.latestCalculation?.annualProfit ? parseFloat(account.latestCalculation.annualProfit) : 0;

  return {
    currentBalance,
    currencyCode,
    latestRate,
    monthlyProfit,
    annualProfit,
  };
};
