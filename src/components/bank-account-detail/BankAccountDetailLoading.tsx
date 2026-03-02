import React from "react";
import { Skeleton } from "../Skeleton";
import type { BankAccountDetailLoadingProps } from "../../interfaces/bank-account-detail/bank-account-detail-loading-props-interface";

export const BankAccountDetailLoading: React.FC<BankAccountDetailLoadingProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col relative max-md:rounded-none max-md:border-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20 rounded-[18px]" />
          <Skeleton className="h-10 w-20 rounded-[18px]" />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap justify-start gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-[calc(50%-0.5rem)] sm:w-28 h-16 rounded-lg" />
          ))}
        </div>
      </div>

      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-800 mb-6">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-20 rounded-[18px]" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border-2 border-blue-500 dark:border-blue-400 rounded-lg overflow-hidden">
            <div className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="border-t-2 border-blue-500 dark:border-blue-400 px-3 py-2 flex justify-end gap-1" style={{ background: "linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))" }}>
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
