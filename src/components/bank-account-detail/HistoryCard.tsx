import React from "react";
import type { HistoryCardProps } from "../../interfaces/bank-account-detail/history-card-props-interface";

export const HistoryCard: React.FC<HistoryCardProps> = ({ children, actions }) => (
  <div className="bg-white dark:bg-gray-900 border-2 border-emerald-500 dark:border-emerald-400 rounded-lg overflow-hidden transition-all">
    <div className="px-4 py-3 bg-white dark:bg-gray-900">{children}</div>
    <div
      className="border-t-2 border-emerald-500 dark:border-emerald-400 px-3 py-2 flex justify-end gap-1"
      style={{ background: "linear-gradient(135deg, rgb(16, 185, 129), rgb(5, 150, 105))" }}
    >
      {actions}
    </div>
  </div>
);
