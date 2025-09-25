'use client';

import React from 'react';
import { Category, CategoryBreadcrumb } from '@/lib/api/categories';
import { Breadcrumbs } from './Breadcrumbs';
import { CategoryTree } from './CategoryTree';
import { ProductList } from '@/components/products/ProductList';
import { cn } from '@/lib/utils';

interface CategoryPageProps {
  category: Category;
  breadcrumb: CategoryBreadcrumb[];
  currentPage: number;
  sortBy: string;
  className?: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  breadcrumb,
  currentPage,
  sortBy,
  className,
}) => {
  const hasChildren = category.children && category.children.length > 0;
  const hasProducts = category.product_count && category.product_count > 0;

  return (
    <div className={cn('min-h-screen bg-[var(--color-background-primary)]', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumb} />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-text-tertiary)] mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl">
              {category.description}
            </p>
          )}
          {category.product_count !== undefined && (
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              {category.product_count} products available
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Category Tree */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <CategoryTree 
                categories={[category]} 
                maxDepth={2}
                className="mb-6"
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {hasChildren ? (
              <div>
                <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
                  Subcategories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {category.children!.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="bg-[var(--color-background-surface)] rounded-lg border border-[var(--color-border-primary)] p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <h3 className="text-lg font-semibold text-[var(--color-text-tertiary)] mb-2">
                        <a
                          href={`/category/${subcategory.slug}`}
                          className="hover:text-[var(--color-primary-700)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 rounded-sm"
                        >
                          {subcategory.name}
                        </a>
                      </h3>
                      {subcategory.description && (
                        <p className="text-[var(--color-text-secondary)] text-sm mb-3 line-clamp-2">
                          {subcategory.description}
                        </p>
                      )}
                      {subcategory.product_count !== undefined && (
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {subcategory.product_count} products
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Products Section */}
            <ProductList categoryId={category.id} />
          </main>
        </div>
      </div>
    </div>
  );
};
