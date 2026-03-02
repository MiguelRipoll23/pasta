/**
 * Formats a date string or Date object to the format: "15 Feb 2026"
 */
export const formatDate = (dateInput: string | Date | undefined | null): string => {
  if (!dateInput) return "";
  
  const date = new Date(dateInput);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return String(dateInput);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};
