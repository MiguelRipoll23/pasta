import React from "react";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { formatFeePercentage } from "../../../utils/percentage-utils";

export const RoboadvisorHeader: React.FC<{
  name: string;
  bankName: string;
  riskLevel?: number | null;
  totalFee?: number | null;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ name, bankName, riskLevel, totalFee, onBack, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {bankName} • Risk {riskLevel || 4}/7 • Total Fee {totalFee != null ? formatFeePercentage(totalFee) : "—"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl font-semibold text-sm leading-none transition-all active:translate-y-[1px] active:scale-[0.995] cursor-pointer bg-emerald-500/10 text-emerald-900 dark:text-white hover:bg-emerald-500/20"
        >
          <Edit2 size={16} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl font-semibold text-sm leading-none transition-all active:translate-y-[1px] active:scale-[0.995] cursor-pointer bg-[#ff4d43] text-white hover:opacity-90"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

export default RoboadvisorHeader;
