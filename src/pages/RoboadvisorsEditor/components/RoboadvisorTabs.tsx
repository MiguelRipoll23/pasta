import React from "react";
import { NavLink } from "react-router-dom";
import { Wallet, PieChart, Banknote } from "lucide-react";
import { clsx } from "clsx";

export const RoboadvisorTabs: React.FC<{ roboadvisorId?: string; activeTab?: string }> = ({ roboadvisorId, activeTab }) => {
  const id = roboadvisorId || "";
  return (
    <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-800 mb-6">
      <NavLink
        to={`/editors/roboadvisors/${id}/balances`}
        className={({ isActive }) =>
          clsx(
            "pb-3 px-4 text-sm font-medium transition-colors border-b-2 cursor-pointer flex items-center gap-2",
            isActive || activeTab === "balances"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-500 dark:text-gray-400"
          )
        }
      >
        <Wallet size={16} /> Balances
      </NavLink>
      <NavLink
        to={`/editors/roboadvisors/${id}/funds`}
        className={({ isActive }) =>
          clsx(
            "pb-3 px-4 text-sm font-medium transition-colors border-b-2 cursor-pointer flex items-center gap-2",
            isActive || activeTab === "funds"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-500 dark:text-gray-400"
          )
        }
      >
        <PieChart size={16} /> Funds
      </NavLink>
      <NavLink
        to={`/editors/roboadvisors/${id}/fees`}
        className={({ isActive }) =>
          clsx(
            "pb-3 px-4 text-sm font-medium transition-colors border-b-2 cursor-pointer flex items-center gap-2",
            isActive || activeTab === "fees"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-500 dark:text-gray-400"
          )
        }
      >
        <Banknote size={16} /> Fees
      </NavLink>
    </div>
  );
};

export default RoboadvisorTabs;
