import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PortfolioAllocationCardProps } from "../../interfaces/dashboard/portfolio-allocation-card-props-interface";
import { Skeleton } from "../Skeleton";

export const PortfolioAllocationCard: React.FC<PortfolioAllocationCardProps> = ({
  loadingCharts,
  charts,
  format,
}) => (
  <div className="group relative bg-white dark:bg-gray-900/80 rounded-2xl p-6 h-96 flex flex-col transition-all duration-300 ease-out hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.5)] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <h2 className="relative z-10 text-xl font-semibold mb-4">Portfolio Allocation</h2>
    <div className="relative z-10 flex-1" style={{ minHeight: 0 }}>
      {loadingCharts
        ? <Skeleton className="h-full w-full" />
        : charts && (
          <ResponsiveContainer width="100%" height="100%" style={{ outline: "none" }} className="focus:outline-none">
            <PieChart>
              <Pie
                data={charts.portfolio}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  `${name ?? "Unknown"} ${((percent ?? 0) * 100).toFixed(2)}%`}
              >
                <Cell fill="#10b981" stroke="none" />
                <Cell fill="#ec4899" stroke="none" />
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg)",
                  borderColor: "var(--tooltip-border)",
                  color: "var(--tooltip-text)",
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg shadow-lg text-xs">
                        <p className="font-bold mb-1 text-gray-500">{payload[0].name}</p>
                        <p style={{ color: payload[0].payload.fill || payload[0].color }}>
                          Value: <span className="font-mono">{format(payload[0].value as number)}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
    </div>
  </div>
);
