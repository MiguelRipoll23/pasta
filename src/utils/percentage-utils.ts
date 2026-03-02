/**
 * Converts a decimal value to a percentage string for display in form inputs.
 * Example: 0.0175 -> "2" (rounded), 0.025 -> "3" (rounded)
 * 
 * @param value - Decimal value (e.g., 0.0175 for 1.75%)
 * @returns Rounded percentage as string (e.g., "2" for ~1.75%)
 */
export function formatDecimalAsRoundedPercentageString(value?: number | null): string {
  if (value === null || value === undefined) return "";
  return Math.round(value * 100).toString();
}

/**
 * Converts a decimal or string value to a percentage string for display in form inputs.
 * Handles both number and string inputs.
 * Example: 0.0175 -> "2" (rounded), "0.025" -> "3" (rounded)
 * 
 * @param value - Decimal value as number or string
 * @returns Rounded percentage as string
 */
export function formatDecimalAsRoundedPercentageStringFlexible(value?: string | number | null): string {
  if (value === null || value === undefined) return "";
  const numeric = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numeric)) return "";
  return Math.round(numeric * 100).toString();
}

/**
 * Converts a decimal value to a formatted percentage string with 2 decimal places.
 * Example: 0.0175 -> "1.75%", 0.025 -> "2.50%"
 * 
 * @param value - Decimal value (e.g., 0.0175 for 1.75%)
 * @returns Formatted percentage with % symbol (e.g., "1.75%")
 */
export function formatDecimalAsPercentageDisplay(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

/**
 * Converts a string decimal value to a formatted percentage string with 2 decimal places.
 * Used for fee percentages stored as strings in the database.
 * Example: "0.0175" -> "1.75%", "0.025" -> "2.50%"
 *
 * @param fee - String decimal value (e.g., "0.0175" for 1.75%)
 * @returns Formatted percentage with % symbol (e.g., "1.75%")
 */
export function formatFeePercentage(fee: string | number): string {
  const value = typeof fee === 'string' ? parseFloat(fee) : fee;
  return `${(value * 100).toFixed(2)}%`;
}

/**
 * Converts a percentage input string to a decimal value for API submission.
 * Example: "1.75" -> 0.0175, "2" -> 0.02
 *
 * @param percentageString - Percentage as string (e.g., "1.75" for 1.75%)
 * @returns Decimal value (e.g., 0.0175), or null if invalid
 */
export function convertPercentageStringToDecimal(percentageString: string): number | null {
  const trimmed = percentageString.trim();
  if (trimmed === "") return null;

  const numericValue = parseFloat(trimmed);
  if (isNaN(numericValue)) return null;

  return numericValue / 100;
}

/**
 * Converts a decimal value to a percentage string for display in form inputs.
 * Preserves up to 2 decimal places to avoid rounding to 0 for small values.
 * Example: 0.0157 -> "1.57", 0.0049 -> "0.49", 0.025 -> "2.5"
 *
 * @param value - Decimal value as string or number (e.g., 0.0157 for 1.57%)
 * @returns Percentage string with up to 2 decimal places
 */
export function formatDecimalAsPercentageForInput(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") return "";
  const numeric = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numeric)) return "";
  // Multiply by 100 to convert decimal to percentage, keep up to 2 decimal places
  const percentage = numeric * 100;
  // Remove trailing zeros after decimal point
  return percentage.toFixed(2).replace(/\.?0+$/, "");
}
