'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryBreadcrumb } from '@/lib/api/categories';

interface BreadcrumbsProps {
  items: CategoryBreadcrumb[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn('flex items-center space-x-2 text-sm', className)}
      aria-label="Breadcrumb navigation"
    >
      <Link
        href="/"
        className="flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-tertiary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 rounded-sm"
        aria-label="Go to home page"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={item.id}>
            <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)] flex-shrink-0" />

            {isLast ? (
              <span
                className="text-[var(--color-text-primary)] font-medium truncate"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <Link
                href={`/category/${item.slug}`}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-tertiary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 rounded-sm truncate"
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
