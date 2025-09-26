'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { HeaderSearch } from './HeaderSearch';
import { cn } from '@/lib/utils';

interface MobileSearchButtonProps {
  className?: string;
}

export const MobileSearchButton: React.FC<MobileSearchButtonProps> = ({
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--color-background-overlay)]">
        <div className="bg-[var(--color-background-surface)] border-b border-[var(--color-border-primary)] p-4">
          <div className="flex items-center gap-3">
            <HeaderSearch 
              className="flex-1" 
              placeholder="Search products..."
            />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className={cn(
        'p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary-600)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 rounded-md',
        className
      )}
      aria-label="Search products"
    >
      <Search className="h-5 w-5" />
    </button>
  );
};
