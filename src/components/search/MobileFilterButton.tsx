'use client';

import React from 'react';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileFilterButtonProps {
  className?: string;
  onClick: () => void;
  filterCount?: number;
}

export const MobileFilterButton: React.FC<MobileFilterButtonProps> = ({
  className,
  onClick,
  filterCount = 0,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 bg-[var(--color-background-surface)] border border-[var(--color-border-primary)] rounded-md text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2',
        className
      )}
      aria-label="Open filters"
    >
      <Filter className="h-4 w-4" />
      <span>Filters</span>
      {filterCount > 0 && (
        <span className="bg-[var(--color-primary-600)] text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
          {filterCount}
        </span>
      )}
    </button>
  );
};
