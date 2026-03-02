import clsx from "clsx";
import type { StatsCardProps } from "../interfaces/stats-card-props-interface";

export const StatsCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  gradientFrom,
  gradientTo,
}: StatsCardProps) => (
  <div
    className={clsx(
      "group relative rounded-xl p-3 flex flex-col items-center text-center transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-0.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.5)] overflow-hidden",
      "bg-gradient-to-b",
      gradientFrom,
      gradientTo,
    )}
  >
    <div className="relative z-10 flex flex-col items-center">
      <div className="p-1 mb-2">
        <Icon className="w-10 h-10 text-white" />
      </div>
      <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
        {title}
      </p>
      <p className="text-xl font-bold text-white truncate">{value}</p>
      {subValue && <div className="mt-1 text-white">{subValue}</div>}
    </div>
  </div>
);
