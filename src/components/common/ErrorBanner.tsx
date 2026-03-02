import React from "react";
import { AlertCircle } from "lucide-react";

type Props = {
  title?: string;
  message: string;
};

export const ErrorBanner: React.FC<Props> = ({ title = "Unable to load data", message }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 mb-6">
      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-red-900 dark:text-red-300">{title}</h3>
        <p className="text-sm text-red-700 dark:text-red-400 mt-1">{message}</p>
      </div>
    </div>
  );
};

export default ErrorBanner;
