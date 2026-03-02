import type { BillCategory } from "../interfaces/bill-category-interface";

export interface CategoryCardProps {
  category: BillCategory;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
}
