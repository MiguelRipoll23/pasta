import type { ChartData } from "../dashboard-data-interface";

export interface PortfolioAllocationCardProps {
  loadingCharts: boolean;
  charts: ChartData | null;
  format: (value: number | null) => string;
}
