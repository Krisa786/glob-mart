'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  options?: SortOption[];
  className?: string;
  placeholder?: string;
}

const defaultSortOptions: SortOption[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'price', label: 'Price Low to High' },
  { value: 'brand', label: 'Brand A-Z' },
];

export const SortSelect: React.FC<SortSelectProps> = ({
  options = defaultSortOptions,
  className,
  placeholder = 'Sort by...',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    
    // Reset to first page when sorting changes
    params.delete('page');
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={cn('relative', className)}>
      <label htmlFor="sort-select" className="sr-only">
        Sort products
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleSortChange}
        className={cn(
          'appearance-none bg-[var(--color-background-surface)] border border-[var(--color-border-primary)] rounded-md px-3 py-2 pr-8 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)] transition-colors duration-200',
          'hover:border-[var(--color-border-secondary)]'
        )}
        aria-label="Sort products"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-[var(--color-text-muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};
