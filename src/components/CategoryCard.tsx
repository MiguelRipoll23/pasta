import { Edit2, Heart, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import type { CategoryCardProps } from "../interfaces/category-card-props-interface";

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onToggleFavorite,
  onEdit,
  onDelete,
}) => {
  const normalize = (c: string) =>
    c
      ? c.replace(/_/g, " ").charAt(0).toUpperCase() +
        c.replace(/_/g, " ").slice(1).toLowerCase()
      : "Uncategorized";

  // Use the custom color if provided, otherwise fallback to red for favorites or emerald for others
  const backgroundColor = category.hexColor || (category.favoritedAt ? "#ef4444" : "#10b981");

  return (
    <div
      className="group flex items-start gap-3 p-4 rounded-3xl transition-all duration-200 shadow-sm"
      style={{ backgroundColor }}
    >


      <div className="flex-1 min-w-0 space-y-2">
        <h5 className="font-bold text-white truncate">{normalize(category.name)}</h5>

        <div className="border-t border-white/30 pt-2 flex justify-end">
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleFavorite}
              className={clsx(
                "p-1.5 rounded-lg transition-all cursor-pointer text-white/80 hover:text-white hover:bg-white/20",
                category.favoritedAt && "text-white",
              )}
              title={category.favoritedAt ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={16} className={clsx(category.favoritedAt && "fill-current")} />
            </button>
            <button
              onClick={onEdit}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all cursor-pointer"
              title="Edit category"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all cursor-pointer"
              title="Delete category"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
