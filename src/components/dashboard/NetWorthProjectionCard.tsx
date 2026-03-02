import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { NetWorthProjectionCardProps } from "../../interfaces/dashboard/net-worth-projection-card-props-interface";
import { Skeleton } from "../Skeleton";

export const NetWorthProjectionCard: React.FC<NetWorthProjectionCardProps> = ({
  loadingCharts,
  charts,
  format,
  formatDate,
}) => (
  <div className="group relative bg-white dark:bg-gray-900/80 rounded-2xl p-6 h-96 flex flex-col transition-all duration-300 ease-out hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.5)] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      <h2 className="text-xl font-semibold mb-4 text-left flex items-baseline gap-2">
        <span>Net Worth & Projection</span>
      </h2>
    </div>
    <div className="relative z-10 flex-1" style={{ minHeight: 0 }}>
      {loadingCharts
        ? <Skeleton className="h-full w-full" />
        : charts && (
          <ResponsiveContainer width="100%" height="100%" style={{ outline: "none" }} className="focus:outline-none">
            <LineChart data={charts.netWorth}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatDate} />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}`}
                domain={[(dataMin) => Math.floor(dataMin * 0.98), "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg)",
                  borderColor: "var(--tooltip-border)",
                  color: "var(--tooltip-text)",
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const historical = payload.find((p) => p.dataKey === "value");
                    const items = historical ? payload.filter((p) => p.dataKey !== "projection") : payload;

                    return (
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg shadow-lg text-xs">
                        <p className="font-bold mb-1 text-gray-500">{formatDate(label)}</p>
                        {items.map((item, i) => (
                          <p key={i} style={{ color: item.color }}>
                            {item.name}: <span className="font-mono">{item.value ? format(item.value as number) : "N/A"}</span>
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="mr-4 text-xs font-medium">{value}</span>}
              />
              <Line name="Historical" type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} connectNulls={false} isAnimationActive={false} />
              <Line
                name="Projected"
                type="monotone"
                dataKey="projection"
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
    </div>
  </div>
);
