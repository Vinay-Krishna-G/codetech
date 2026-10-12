import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="animate-pulse bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-4">
    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
    <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
    <div className="space-y-2 pt-2">
      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-4/5"></div>
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="animate-pulse space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="h-12 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg w-full flex items-center px-4 space-x-4"
      >
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-28"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-40"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-32 hidden md:block"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-20 ml-auto"></div>
      </div>
    ))}
  </div>
);
