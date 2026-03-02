import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { clsx } from "clsx";
import { Equal, TrendingUp } from "lucide-react";
import type { BillsHistoryCardProps } from "../../interfaces/dashboard/bills-history-card-props-interface";
import { Skeleton } from "../Skeleton";

export const BillsHistoryCard: React.FC<BillsHistoryCardProps> = ({
  loadingCharts,
  charts,
  visibleBillCategories,
  setVisibleBillCategories,
  showTrends,
  setShowTrends,
  getBillColor,
  format,
  formatDate,
}) => (
  <div className="group relative bg-white dark:bg-gray-900/80 rounded-2xl p-6 flex flex-col transition-all duration-300 ease-out hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.5)] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <h2 className="relative z-10 text-xl font-semibold mb-4 text-left">Bills History</h2>
    <div className="relative z-10" style={{ height: 384, width: "100%" }}>
      {loadingCharts
        ? <Skeleton className="h-full w-full" />
        : charts && (
          <ResponsiveContainer width="100%" height="100%" style={{ outline: "none" }} className="focus:outline-none">
            <LineChart data={charts.bills}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatDate} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg)",
                  borderColor: "var(--tooltip-border)",
                  color: "var(--tooltip-text)",
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const items = payload.filter((p) => !String(p.dataKey).includes("Trend"));
                    return (
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg shadow-lg text-xs">
                        <p className="mb-1 text-gray-500">{formatDate(label)}</p>
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
              {charts.billCategories.map((category, index) =>
                visibleBillCategories.has(category) && (
                  <React.Fragment key={category}>
                    <Line type="monotone" dataKey={category} stroke={getBillColor(category, index)} strokeWidth={2} dot={{ r: 4 }} connectNulls={true} />
                    {showTrends && (
                      <Line
                        type="monotone"
                        dataKey={`${category} Trend`}
                        stroke={getBillColor(category, index)}
                        strokeWidth={2.5}
                        strokeDasharray="5 5"
                        dot={false}
                        connectNulls={true}
                        opacity={0.85}
                      />
                    )}
                  </React.Fragment>
                )
              )}
              {visibleBillCategories.has("Total") && (
                <React.Fragment key="Total">
                  <Line type="monotone" dataKey="Total" stroke={getBillColor("Total", 0)} strokeWidth={3.5} dot={{ r: 4.5 }} connectNulls={true} />
                  {showTrends && (
                    <Line
                      type="monotone"
                      dataKey="Total Trend"
                      stroke={getBillColor("Total", 0)}
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={false}
                      connectNulls={true}
                      opacity={0.95}
                    />
                  )}
                </React.Fragment>
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
    </div>

    {!loadingCharts && charts && (
      <div className="relative z-20 flex flex-wrap justify-center gap-2 mt-6 pt-6">
        <button
          onClick={() => setVisibleBillCategories(new Set())}
          disabled={visibleBillCategories.size === 0}
          className="flex items-center gap-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer h-8 border bg-red-500 dark:bg-red-600 border-red-500 dark:border-red-600 text-white dark:text-white hover:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-900/10 disabled:border disabled:border-gray-200 dark:disabled:border-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600"
        >
          Clear
        </button>

        <button
          onClick={() => setShowTrends(!showTrends)}
          className={clsx(
            "flex items-center gap-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer h-8 border",
            showTrends
              ? "bg-amber-500 dark:bg-amber-600 border-amber-500 dark:border-amber-600 text-white dark:text-white"
              : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 hover:border-gray-200 dark:hover:border-gray-700"
          )}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Trends
        </button>

        <button
          onClick={() => {
            const updated = new Set(visibleBillCategories);
            if (updated.has("Total")) {
              updated.delete("Total");
            } else {
              updated.add("Total");
            }
            setVisibleBillCategories(updated);
          }}
          className={clsx(
            "flex items-center gap-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer h-8 border",
            visibleBillCategories.has("Total")
              ? "bg-emerald-500 dark:bg-emerald-600 border-emerald-500 dark:border-emerald-600 text-white dark:text-white"
              : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 hover:border-gray-200 dark:hover:border-gray-700"
          )}
        >
          <Equal className={clsx("w-3.5 h-3.5", visibleBillCategories.has("Total") && "text-white dark:text-white")} />
          Total
        </button>

        {charts.billCategories.map((category, index) => {
          const checked = visibleBillCategories.has(category);
          const color = getBillColor(category, index);
          return (
            <button
              key={category}
              onClick={() => {
                const updated = new Set(visibleBillCategories);
                if (updated.has(category)) {
                  updated.delete(category);
                } else {
                  updated.add(category);
                }
                setVisibleBillCategories(updated);
              }}
              className={clsx(
                "relative flex items-center gap-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer h-8 border",
                checked
                  ? "bg-emerald-500 dark:bg-emerald-600 border-emerald-500 dark:border-emerald-600 text-white dark:text-white"
                  : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 hover:border-gray-200 dark:hover:border-gray-700"
              )}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              {category}
            </button>
          );
        })}
      </div>
    )}
  </div>
);
