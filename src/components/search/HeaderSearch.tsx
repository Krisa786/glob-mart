'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderSearchProps {
  className?: string;
  placeholder?: string;
  showClearButton?: boolean;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  className,
  placeholder = 'Search products...',
  showClearButton = true,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (searchQuery.trim()) {
          router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
          // If query is empty, go to products page without search
          router.push('/products');
        }
      }, 300);
    },
    [router]
  );

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Limit search query length to prevent extremely long URLs
    const truncatedValue = value.length > 100 ? value.substring(0, 100) : value;
    setQuery(truncatedValue);
    debouncedSearch(truncatedValue);
  };

  // Handle form submission (immediate search)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Clear debounce timeout for immediate search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      const truncatedQuery = trimmedQuery.length > 100 ? trimmedQuery.substring(0, 100) : trimmedQuery;
      router.push(`/products?q=${encodeURIComponent(truncatedQuery)}`);
    } else {
      router.push('/products');
    }
  };

  // Handle clear button
  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Navigate to products page without search
    router.push('/products');
  };

  // Handle escape key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setQuery('');
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search 
              className={cn(
                'h-4 w-4 transition-colors duration-200',
                isFocused 
                  ? 'text-[var(--color-primary-600)]' 
                  : 'text-[var(--color-text-muted)]'
              )}
              aria-hidden="true"
            />
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={cn(
              'w-full pl-10 pr-10 py-2 text-sm bg-[var(--color-background-surface)] border border-[var(--color-border-primary)] rounded-md',
              'placeholder:text-[var(--color-text-muted)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)]',
              'hover:border-[var(--color-border-secondary)]',
              'transition-colors duration-200',
              'min-w-[200px] sm:min-w-[300px] lg:min-w-[400px]'
            )}
            aria-label="Search products"
            autoComplete="off"
          />

          {/* Clear Button */}
          {showClearButton && query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <X 
                className="h-4 w-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-200" 
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
