import type React from "react";
import type { ChartData } from "../dashboard-data-interface";

export interface BillsHistoryCardProps {
  loadingCharts: boolean;
  charts: ChartData | null;
  visibleBillCategories: Set<string>;
  setVisibleBillCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  showTrends: boolean;
  setShowTrends: React.Dispatch<React.SetStateAction<boolean>>;
  getBillColor: (category: string, index: number) => string;
  format: (value: number | null) => string;
  formatDate: (dateStr: string | number | undefined) => string;
}
