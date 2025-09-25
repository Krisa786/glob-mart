'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/lib/api/categories';
import { cn } from '@/lib/utils';

interface CategoryOverviewProps {
  categories: Category[];
  className?: string;
}

interface CategoryCardProps {
  category: Category;
  level: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const hasChildren = category.children && category.children.length > 0;
  const maxDisplayChildren = 4; // Show max 4 subcategories

  return (
    <div className="bg-[var(--color-background-surface)] rounded-lg border border-[var(--color-border-primary)] p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mb-4">
        <Link
          href={`/category/${category.slug}`}
          className="text-xl font-semibold text-[var(--color-text-tertiary)] hover:text-[var(--color-primary-700)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 rounded-sm"
        >
          {category.name}
        </Link>
        {category.product_count !== undefined && (
          <span className="ml-2 text-sm text-[var(--color-text-muted)]">
            ({category.product_count} products)
          </span>
        )}
      </div>

      {category.description && (
        <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-2">
          {category.description}
        </p>
      )}

      {hasChildren && (
        <div>
          <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Subcategories:
          </h4>
          <div className="space-y-1">
            {category.children!.slice(0, maxDisplayChildren).map((child) => (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-tertiary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 rounded-sm"
              >
                {child.name}
                {child.product_count !== undefined && (
                  <span className="ml-1 text-xs text-[var(--color-text-muted)]">
                    ({child.product_count})
                  </span>
                )}
              </Link>
            ))}
            {category.children!.length > maxDisplayChildren && (
              <Link
                href={`/category/${category.slug}`}
                className="block text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 rounded-sm"
              >
                View all {category.children!.length} subcategories →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const CategoryOverview: React.FC<CategoryOverviewProps> = ({
  categories,
  className,
}) => {
  // Filter out inactive categories and sort by name
  const activeCategories = categories
    .filter((cat) => cat.is_active)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (activeCategories.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="text-[var(--color-text-muted)]">
          <p className="text-lg mb-2">No categories available</p>
          <p className="text-sm">
            Please check back later for our product categories.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', className)}>
      {activeCategories.map((category) => (
        <div key={category.id}>
          <CategoryCard category={category} level={0} />
        </div>
      ))}
    </div>
  );
};
