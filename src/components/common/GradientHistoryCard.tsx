import React from "react";

import type { GradientHistoryCardProps } from "../../interfaces/components/gradient-history-card-props-interface";

export const GradientHistoryCard: React.FC<GradientHistoryCardProps> = ({
  children,
  actions,
  borderClassName,
  gradient,
}) => (
  <div className={`bg-white dark:bg-gray-900 border-2 rounded-lg overflow-hidden transition-all ${borderClassName}`}>
    <div className="px-4 py-3 bg-white dark:bg-gray-900">{children}</div>
    <div className={`border-t-2 px-3 py-2 flex justify-end gap-1 ${borderClassName}`} style={{ background: gradient }}>
      {actions}
    </div>
  </div>
);
