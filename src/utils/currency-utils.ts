/**
 * Currency formatting utility with proper symbol alignment
 * 
 * Rules:
 * - Left-aligned symbols: $ (USD), £ (GBP), ₹ (INR), ₽ (RUB), ₩ (KRW)
 * - Right-aligned symbols: € (EUR), ¥ (JPY/CNY), kr (NOK/SEK), ₱ (PHP)
 */

// Currencies that have left-aligned symbols (symbol BEFORE amount)
const LEFT_ALIGNED_SYMBOLS = new Set([
  'USD', 'GBP', 'INR', 'RUB', 'KRW', 'MXN',
]);

// Currencies where symbol appears AFTER the amount (right-aligned)
const RIGHT_ALIGNED_SYMBOLS = new Set([
  'EUR', 'JPY', 'CNY', 'NOK', 'SEK', 'PHP', 'AUD', 'CAD', 'NZD', 'SGD', 'CHF'
]);

/**
 * Gets the alignment direction for a currency symbol
 * @param currencyCode - ISO 4217 currency code
 * @returns 'left' or 'right'
 */
export const getCurrencyAlignment = (currencyCode: string): 'left' | 'right' => {
  const code = currencyCode.toUpperCase();
  
  if (RIGHT_ALIGNED_SYMBOLS.has(code)) {
    return 'right';
  }
  if (LEFT_ALIGNED_SYMBOLS.has(code)) {
    return 'left';
  }
  
  // Default to left for unknown currencies
  return 'left';
};

/**
 * Formats a currency value with proper alignment
 */
export interface FormattedCurrency {
  formatted: string;
  symbol: string;
  amount: string;
  alignment: 'left' | 'right';
}

export const formatCurrency = (
  value: number,
  currencyCode: string,
  locale: string = 'en-US'
): FormattedCurrency => {
  const alignment = getCurrencyAlignment(currencyCode);
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
  });
  
  const formatted = formatter.format(value);
  
  // Extract symbol and amount using formatToParts
  const parts = formatter.formatToParts(value);
  const symbol = parts.find(p => p.type === 'currency')?.value || '';
  const amount = parts
    .filter(p => p.type !== 'currency')
    .map(p => p.value)
    .join('');
  
  return {
    formatted,
    symbol,
    amount,
    alignment,
  };
};

/**
 * Formats currency with alignment for display
 * @param value - Numeric value to format
 * @param currencyCode - ISO 4217 currency code
 * @param locale - Optional locale string
 * @returns Formatted string with proper symbol alignment
 */
export const formatCurrencyWithAlignment = (
  value: number,
  currencyCode: string,
  locale: string = 'en-US'
): string => {
  const result = formatCurrency(value, currencyCode, locale);
  
  if (result.alignment === 'left') {
    return `${result.symbol} ${result.amount}`;
  } else {
    return `${result.amount} ${result.symbol}`;
  }
};

/**
 * Creates a CSS class for currency alignment
 * @param currencyCode - ISO 4217 currency code
 * @returns CSS class name
 */
export const getCurrencyAlignmentClass = (currencyCode: string): string => {
  const alignment = getCurrencyAlignment(currencyCode);
  return `currency-${alignment}`;
};
