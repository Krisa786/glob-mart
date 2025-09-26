'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductList } from './ProductList';
import { FilterPanel } from '@/components/search/FilterPanel';
import { ActiveFiltersBar } from '@/components/search/ActiveFiltersBar';
import { MobileFilterButton } from '@/components/search/MobileFilterButton';
import { cn } from '@/lib/utils';

interface ProductsPageWithFiltersProps {
  categoryId?: number;
  className?: string;
}

export const ProductsPageWithFilters: React.FC<ProductsPageWithFiltersProps> = ({
  categoryId,
  className,
}) => {
  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Count active filters for mobile button
  const getActiveFilterCount = (): number => {
    let count = 0;
    
    if (searchParams.get('q')) count++;
    if (searchParams.get('minPrice') || searchParams.get('maxPrice')) count++;
    if (searchParams.get('badge')) {
      const badges = searchParams.get('badge')?.split(',').filter(Boolean) || [];
      count += badges.length;
    }
    if (searchParams.get('inStock') === '1') count++;
    if (searchParams.get('category')) count++;
    
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Close mobile filter when URL changes
  useEffect(() => {
    setIsMobileFilterOpen(false);
  }, [searchParams]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Active Filters Bar */}
      <ActiveFiltersBar />

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-8">
        {/* Filter Panel - Desktop */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-24">
            <FilterPanel />
          </div>
        </div>

        {/* Product List - Desktop */}
        <div className="flex-1 min-w-0">
          <ProductList categoryId={categoryId} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4">
        {/* Mobile Filter Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Products
          </h2>
          <MobileFilterButton
            onClick={() => setIsMobileFilterOpen(true)}
            filterCount={activeFilterCount}
          />
        </div>

        {/* Product List - Mobile */}
        <ProductList categoryId={categoryId} />

        {/* Mobile Filter Panel */}
        {isMobileFilterOpen && (
          <FilterPanel
            isMobile={true}
            onClose={() => setIsMobileFilterOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
