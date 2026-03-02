import React from "react";
import { AlertTriangle } from "lucide-react";

type ErrorPageProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const ErrorPage: React.FC<ErrorPageProps> = ({
  title = "Configuration error",
  description = "VITE_API_BASE_URL is not defined.\nPlease include it in your environment variables",
  actionLabel,
  onAction,
}) => (
  <div className="min-h-screen bg-white dark:bg-gray-900 md:bg-gray-50 flex flex-col items-center justify-center p-4">
    <div className="w-full md:max-w-[480px] flex-none">
      <div className="bg-white dark:bg-gray-900 md:dark:bg-gray-900 p-6 md:p-8 backdrop-blur md:rounded-2xl md:shadow-xl md:border md:border-gray-200 md:dark:border-gray-800 text-center w-full md:mx-auto md:min-h-[260px] md:flex md:flex-col md:items-center md:justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{title}</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 whitespace-pre-line">{description}</p>
        </div>

        {actionLabel && onAction ? (
          <div className="flex justify-center mt-4">
            <button onClick={onAction} className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl font-semibold text-sm leading-none transition-all active:translate-y-[1px] active:scale-[0.995] cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600">
              {actionLabel}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

export default ErrorPage;
