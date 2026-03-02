import React from "react";
import { Skeleton } from "../Skeleton";

import type { MonthlyListCardProps } from "../../interfaces/components/monthly-list-card-props-interface";

export const MonthlyListCard: React.FC<MonthlyListCardProps> = ({
  title,
  subtitle,
  loading,
  items,
  emptyLabel,
  borderClassName,
  format,
}) => (
  <div className="group relative bg-white dark:bg-gray-900/80 rounded-2xl p-6 flex flex-col transition-all duration-300 ease-out hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.5)] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10 flex justify-between items-center mb-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-black dark:text-white">{title}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
    <div className="relative z-10 flex-1 pr-2 space-y-2">
      {loading
        ? [...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between items-center p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-transparent">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))
        : items?.map((item, i) => (
          <div key={i} className={`flex justify-between items-center p-4 bg-white dark:bg-gray-900 rounded border-2 border-dashed font-mono ${borderClassName}`}>
            <span className="text-sm text-black dark:text-gray-300">{item.name}</span>
            <span className="text-sm text-black dark:text-white">{format(item.total)}</span>
          </div>
        ))}
      {!loading && (!items || items.length === 0) && (
        <div className="h-32 flex items-center justify-center text-gray-400 italic text-sm">{emptyLabel}</div>
      )}
    </div>
  </div>
);
