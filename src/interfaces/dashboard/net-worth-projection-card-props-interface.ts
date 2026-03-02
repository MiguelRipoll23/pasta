import type { ChartData } from "../dashboard-data-interface";

export interface NetWorthProjectionCardProps {
  loadingCharts: boolean;
  charts: ChartData | null;
  format: (value: number | null) => string;
  formatDate: (dateStr: string | number | undefined) => string;
}
