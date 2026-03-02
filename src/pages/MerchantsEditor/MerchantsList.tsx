import React from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { Skeleton } from "../../components/Skeleton";
import ErrorBanner from "../../components/common/ErrorBanner";
import MerchantCard from "./components/MerchantCard";
import type { Merchant } from "../../interfaces/merchant-interface";

interface MerchantsListProps {
  merchants: Merchant[];
  loading: boolean;
  error: string | null;
  onCreate: () => void;
  onSelect: (merchant: Merchant) => void;
}

export const MerchantsList: React.FC<MerchantsListProps> = ({
  merchants,
  loading,
  error,
  onCreate,
  onSelect,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col relative max-md:rounded-none max-md:border-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Merchants</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {merchants.length} merchants
          </p>
        </div>

        <div className="flex items-center">
          <button
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl font-semibold text-sm leading-none transition-all active:translate-y-[1px] active:scale-[0.995] cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600"
          >
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="flex-1">
        {loading ? (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : merchants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl flex items-center justify-center mb-5">
              <ShoppingCart size={40} className="text-orange-600 dark:text-orange-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No merchants yet
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Add your first merchant to start tracking receipts.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {merchants.map((merchant) => (
              <MerchantCard key={merchant.id} item={merchant} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantsList;
