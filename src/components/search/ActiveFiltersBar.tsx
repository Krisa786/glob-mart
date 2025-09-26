'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActiveFiltersBarProps {
  className?: string;
}

interface FilterChip {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

export const ActiveFiltersBar: React.FC<ActiveFiltersBarProps> = ({
  className,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get active filters from URL parameters
  const getActiveFilters = (): FilterChip[] => {
    const filters: FilterChip[] = [];

    // Search query
    const q = searchParams.get('q');
    if (q) {
      filters.push({
        key: 'q',
        label: 'Search',
        value: `"${q}"`,
        onRemove: () => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('q');
          params.delete('page');
          router.push(`?${params.toString()}`);
        },
      });
    }

    // Price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      const min = minPrice ? `$${minPrice}` : '';
      const max = maxPrice ? `$${maxPrice}` : '';
      const range = min && max ? `${min} - ${max}` : min || max;
      
      filters.push({
        key: 'price',
        label: 'Price',
        value: range,
        onRemove: () => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('minPrice');
          params.delete('maxPrice');
          params.delete('page');
          router.push(`?${params.toString()}`);
        },
      });
    }

    // Eco badges
    const badge = searchParams.get('badge');
    if (badge) {
      const badges = badge.split(',').filter(Boolean);
      badges.forEach((badgeValue, index) => {
        filters.push({
          key: `badge-${index}`,
          label: 'Badge',
          value: badgeValue,
          onRemove: () => {
            const params = new URLSearchParams(searchParams.toString());
            const currentBadges = params.get('badge')?.split(',').filter(Boolean) || [];
            const newBadges = currentBadges.filter(b => b !== badgeValue);
            
            if (newBadges.length > 0) {
              params.set('badge', newBadges.join(','));
            } else {
              params.delete('badge');
            }
            params.delete('page');
            router.push(`?${params.toString()}`);
          },
        });
      });
    }

    // Stock status
    const inStock = searchParams.get('inStock');
    if (inStock === '1') {
      filters.push({
        key: 'inStock',
        label: 'Stock',
        value: 'In Stock Only',
        onRemove: () => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('inStock');
          params.delete('page');
          router.push(`?${params.toString()}`);
        },
      });
    }

    // Category (if we're on a category page)
    const category = searchParams.get('category');
    if (category) {
      filters.push({
        key: 'category',
        label: 'Category',
        value: `ID: ${category}`,
        onRemove: () => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('category');
          params.delete('page');
          router.push(`?${params.toString()}`);
        },
      });
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

  // Don't render if no active filters
  if (activeFilters.length === 0) {
    return null;
  }

  // Clear all filters
  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('badge');
    params.delete('inStock');
    params.delete('category');
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={cn('bg-[var(--color-background-surface)] border border-[var(--color-border-primary)] rounded-lg p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
          Active Filters ({activeFilters.length})
        </h3>
        <button
          type="button"
          onClick={clearAllFilters}
          className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] underline transition-colors duration-200"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <div
            key={filter.key}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] rounded-full text-sm"
          >
            <span className="text-[var(--color-text-secondary)] font-medium">
              {filter.label}:
            </span>
            <span className="text-[var(--color-text-primary)]">
              {filter.value}
            </span>
            <button
              type="button"
              onClick={filter.onRemove}
              className="ml-1 p-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-200 rounded-full hover:bg-[var(--color-primary-100)]"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
