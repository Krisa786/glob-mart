import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryTreeSkeletonProps {
  className?: string;
}

export const CategoryTreeSkeleton: React.FC<CategoryTreeSkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'bg-[var(--color-background-surface)] rounded-lg border border-[var(--color-border-primary)] p-4',
        className
      )}
    >
      <div className="animate-pulse">
        <div className="h-6 bg-[var(--color-border-primary)] rounded mb-4 w-24"></div>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-[var(--color-border-primary)] rounded"></div>
              <div className="h-4 bg-[var(--color-border-primary)] rounded flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
