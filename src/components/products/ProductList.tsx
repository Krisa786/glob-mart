'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Product,
  ProductSearchResult,
  searchProducts,
} from '@/lib/api/products';
import { ProductCard } from './ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { SortSelect } from '@/components/ui/SortSelect';
import { cn } from '@/lib/utils';

interface ProductListProps {
  categoryId?: number;
  className?: string;
}

interface ProductListState {
  products: Product[];
  pagination: ProductSearchResult['pagination'] | null;
  loading: boolean;
  error: string | null;
}

export const ProductList: React.FC<ProductListProps> = ({
  categoryId,
  className,
}) => {
  const searchParams = useSearchParams();
  const [state, setState] = useState<ProductListState>({
    products: [],
    pagination: null,
    loading: true,
    error: null,
  });

  // Extract search parameters
  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'newest';
  const q = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice')
    ? parseFloat(searchParams.get('minPrice')!)
    : undefined;
  const maxPrice = searchParams.get('maxPrice')
    ? parseFloat(searchParams.get('maxPrice')!)
    : undefined;
  const badge = searchParams.get('badge') || undefined;
  const inStock = searchParams.get('inStock') === '1';

  // Fetch products when parameters change
  useEffect(() => {
    const fetchProducts = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const params = {
          page,
          sort: sort as 'price' | 'newest' | 'oldest' | 'name' | 'brand',
          limit: 24,
          ...(q && { q }),
          ...(categoryId && { category: categoryId }),
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
          ...(badge && { badge }),
          ...(inStock && { inStock: true }),
        };

        const result = await searchProducts(params);

        setState({
          products: result.products || [],
          pagination: result.pagination || null,
          loading: false,
          error: null,
        });
      } catch (error) {
        // Error fetching products - handled by error state
        setState({
          products: [],
          pagination: null,
          loading: false,
          error:
            error instanceof Error ? error.message : 'Failed to load products',
        });
      }
    };

    fetchProducts();
  }, [page, sort, q, categoryId, minPrice, maxPrice, badge, inStock]);

  // Loading skeleton
  if (state.loading) {
    return (
      <div className={cn('space-y-6', className)}>
        {/* Header with skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-[var(--color-background-secondary)] rounded animate-pulse" />
          <div className="h-10 w-32 bg-[var(--color-background-secondary)] rounded animate-pulse" />
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-[var(--color-background-surface)] rounded-lg border border-[var(--color-border-primary)] overflow-hidden"
            >
              <div className="aspect-square bg-[var(--color-background-secondary)] animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[var(--color-background-secondary)] rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-[var(--color-background-secondary)] rounded animate-pulse" />
                <div className="h-6 w-1/2 bg-[var(--color-background-secondary)] rounded animate-pulse" />
                <div className="h-8 w-full bg-[var(--color-background-secondary)] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="text-[var(--color-text-muted)]">
          <p className="text-lg mb-2">Unable to load products</p>
          <p className="text-sm mb-4">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!state.products || state.products.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Products
          </h2>
          <SortSelect />
        </div>

        {/* Empty state */}
        <div className="text-center py-12">
          <div className="text-[var(--color-text-muted)]">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-background-secondary)] rounded-full flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-lg mb-2">No products found</p>
            <p className="text-sm mb-4">
              {q || minPrice || maxPrice || badge || inStock
                ? 'Try adjusting your search terms or filters to find more products.'
                : "This category doesn't have any products yet."}
            </p>
            {(q || minPrice || maxPrice || badge || inStock) && (
              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.search = '';
                  window.location.href = url.toString();
                }}
                className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with results count and sort */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Products
          </h2>
          {state.pagination && (
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Showing{' '}
              {(state.pagination.current_page - 1) * state.pagination.per_page +
                1}{' '}
              to{' '}
              {Math.min(
                state.pagination.current_page * state.pagination.per_page,
                state.pagination.total
              )}{' '}
              of {state.pagination.total} results
            </p>
          )}
        </div>
        <SortSelect />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(state.products || []).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {state.pagination && state.pagination.total_pages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination
            currentPage={state.pagination.current_page}
            totalPages={state.pagination.total_pages}
            baseUrl={window.location.pathname}
            searchParams={{
              ...(q && { q }),
              ...(sort && sort !== 'newest' && { sort }),
              ...(minPrice && { minPrice: minPrice.toString() }),
              ...(maxPrice && { maxPrice: maxPrice.toString() }),
              ...(badge && { badge }),
              ...(inStock && { inStock: '1' }),
            }}
          />
        </div>
      )}
    </div>
  );
};
