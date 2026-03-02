import React from 'react';
import { clsx } from 'clsx';

import type { SkeletonProps } from "../interfaces/components/skeleton-props-interface";

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div 
      className={clsx(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded",
        className
      )} 
      style={{
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  );
};

// Add shimmer animation to global styles
export const SkeletonStyles = () => (
  <style>{`
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `}</style>
);
