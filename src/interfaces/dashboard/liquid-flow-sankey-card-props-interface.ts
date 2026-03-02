import type { ChartData } from "../dashboard-data-interface";

export interface LiquidFlowSankeyCardProps {
  loadingCharts: boolean;
  charts: ChartData | null;
  format: (value: number | null) => string;
}
