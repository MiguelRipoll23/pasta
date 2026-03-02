import React from "react";
import { ShoppingCart } from "lucide-react";
import type { Merchant } from "../../../interfaces/merchant-interface";

interface MerchantCardProps {
  item: Merchant;
  onSelect: (item: Merchant) => void;
}

const MerchantCard: React.FC<MerchantCardProps> = ({ item, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className="group rounded-xl p-4 cursor-pointer hover:opacity-90 transition-opacity"
      style={{ background: "linear-gradient(to bottom, rgb(52, 211, 153), rgb(16, 185, 129))" }}
    >
      <div className="flex items-start mb-3">
        <div className="text-white">
          <ShoppingCart size={20} />
        </div>
      </div>
      <h4 className="font-semibold text-white truncate">{item.name}</h4>
    </div>
  );
};

export default MerchantCard;
