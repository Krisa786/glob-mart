import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryPageSkeletonProps {
  className?: string;
}

export const CategoryPageSkeleton: React.FC<CategoryPageSkeletonProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        'min-h-screen bg-[var(--color-background-primary)]',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs Skeleton */}
        <div className="mb-6">
          <div className="animate-pulse flex items-center space-x-2">
            <div className="h-4 w-4 bg-[var(--color-border-primary)] rounded"></div>
            <div className="h-4 w-4 bg-[var(--color-border-primary)] rounded"></div>
            <div className="h-4 w-24 bg-[var(--color-border-primary)] rounded"></div>
          </div>
        </div>

        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="animate-pulse">
            <div className="h-10 bg-[var(--color-border-primary)] rounded mb-4 w-64"></div>
            <div className="h-6 bg-[var(--color-border-primary)] rounded mb-2 w-96"></div>
            <div className="h-4 bg-[var(--color-border-primary)] rounded w-32"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="animate-pulse bg-[var(--color-background-surface)] rounded-lg border border-[var(--color-border-primary)] p-4">
                <div className="h-6 bg-[var(--color-border-primary)] rounded mb-4 w-24"></div>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-[var(--color-border-primary)] rounded"></div>
                      <div className="h-4 bg-[var(--color-border-primary)] rounded flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="lg:col-span-3">
            <div className="animate-pulse">
              <div className="h-8 bg-[var(--color-border-primary)] rounded mb-6 w-48"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-[var(--color-background-surface)] rounded-lg border border-[var(--color-border-primary)] p-6"
                  >
                    <div className="h-6 bg-[var(--color-border-primary)] rounded mb-2 w-32"></div>
                    <div className="h-4 bg-[var(--color-border-primary)] rounded mb-2 w-full"></div>
                    <div className="h-4 bg-[var(--color-border-primary)] rounded mb-3 w-3/4"></div>
                    <div className="h-3 bg-[var(--color-border-primary)] rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
