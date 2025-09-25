'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
  className,
}) => {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set('page', page.toString());
    
    // Preserve other search parameters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page') {
        url.searchParams.set(key, value);
      }
    });
    
    return url.pathname + url.search;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className={cn('flex items-center justify-center space-x-1', className)}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-background-surface)] border border-[var(--color-border-primary)] rounded-md hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] bg-[var(--color-background-surface)] border border-[var(--color-border-primary)] rounded-md cursor-not-allowed opacity-50">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-[var(--color-text-muted)]"
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <Link
              key={pageNumber}
              href={createPageUrl(pageNumber)}
              className={cn(
                'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2',
                isCurrentPage
                  ? 'bg-[var(--color-primary-600)] text-white border border-[var(--color-primary-600)]'
                  : 'text-[var(--color-text-secondary)] bg-[var(--color-background-surface)] border border-[var(--color-border-primary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)]'
              )}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-background-surface)] border border-[var(--color-border-primary)] rounded-md hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2"
          aria-label="Go to next page"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      ) : (
        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] bg-[var(--color-background-surface)] border border-[var(--color-border-primary)] rounded-md cursor-not-allowed opacity-50">
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </span>
      )}
    </nav>
  );
};
