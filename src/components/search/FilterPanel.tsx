'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface FilterPanelProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

// Available eco badges based on the theme and business requirements
const ECO_BADGES: FilterOption[] = [
  { value: 'FSC', label: 'FSC Certified' },
  { value: 'Recycled', label: 'Recycled Materials' },
  { value: 'Organic', label: 'Organic' },
  { value: 'FairTrade', label: 'Fair Trade' },
  { value: 'BPA-Free', label: 'BPA Free' },
  { value: 'Biodegradable', label: 'Biodegradable' },
  { value: 'Energy-Efficient', label: 'Energy Efficient' },
  { value: 'Water-Saving', label: 'Water Saving' },
];

// Price range presets
const PRICE_PRESETS = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $250', min: 100, max: 250 },
  { label: '$250 - $500', min: 250, max: 500 },
  { label: 'Over $500', min: 500, max: 10000 },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  className,
  isMobile = false,
  onClose,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for filter values
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 1000 });
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    badges: true,
    stock: true,
  });

  // Initialize state from URL parameters
  useEffect(() => {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const badge = searchParams.get('badge');
    const stock = searchParams.get('inStock');

    if (minPrice || maxPrice) {
      const min = minPrice ? Math.max(0, parseInt(minPrice) || 0) : 0;
      const max = maxPrice ? Math.min(10000, parseInt(maxPrice) || 1000) : 1000;
      
      // Ensure min <= max
      setPriceRange({
        min: Math.min(min, max),
        max: Math.max(min, max),
      });
    }

    if (badge) {
      const badges = badge.split(',').filter(Boolean);
      // Filter out unknown badges
      const validBadges = badges.filter(badgeValue => 
        ECO_BADGES.some(ecoBadge => ecoBadge.value === badgeValue)
      );
      setSelectedBadges(validBadges);
    }

    if (stock === '1') {
      setInStockOnly(true);
    }
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = (newParams: Record<string, string | number | boolean | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset to first page when filters change
    params.delete('page');

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === false) {
        params.delete(key);
      } else if (value === true) {
        params.set(key, '1');
      } else {
        params.set(key, value.toString());
      }
    });

    router.push(`?${params.toString()}`);
  };

  // Handle price range change
  const handlePriceRangeChange = (field: 'min' | 'max', value: number) => {
    // Clamp values to reasonable ranges
    const clampedValue = Math.max(0, Math.min(10000, value));
    
    const newRange = { ...priceRange, [field]: clampedValue };
    
    // Ensure min <= max
    if (field === 'min' && clampedValue > priceRange.max) {
      newRange.max = clampedValue;
    } else if (field === 'max' && clampedValue < priceRange.min) {
      newRange.min = clampedValue;
    }
    
    setPriceRange(newRange);
    
    // Update URL with debounce for better UX
    setTimeout(() => {
      updateURL({
        minPrice: newRange.min > 0 ? newRange.min : null,
        maxPrice: newRange.max < 1000 ? newRange.max : null,
      });
    }, 500);
  };

  // Handle badge selection
  const handleBadgeToggle = (badgeValue: string) => {
    // Validate badge exists in our predefined list
    const validBadge = ECO_BADGES.find(badge => badge.value === badgeValue);
    if (!validBadge) {
      console.warn(`Unknown badge: ${badgeValue}`);
      return;
    }
    
    const newBadges = selectedBadges.includes(badgeValue)
      ? selectedBadges.filter(b => b !== badgeValue)
      : [...selectedBadges, badgeValue];
    
    setSelectedBadges(newBadges);
    updateURL({
      badge: newBadges.length > 0 ? newBadges.join(',') : null,
    });
  };

  // Handle stock filter
  const handleStockToggle = () => {
    const newValue = !inStockOnly;
    setInStockOnly(newValue);
    updateURL({
      inStock: newValue,
    });
  };

  // Handle price preset selection
  const handlePricePreset = (preset: { min: number; max: number }) => {
    setPriceRange(preset);
    updateURL({
      minPrice: preset.min > 0 ? preset.min : null,
      maxPrice: preset.max < 1000 ? preset.max : null,
    });
  };

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setPriceRange({ min: 0, max: 1000 });
    setSelectedBadges([]);
    setInStockOnly(false);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('badge');
    params.delete('inStock');
    params.delete('page');
    
    router.push(`?${params.toString()}`);
  };

  // Check if any filters are active
  const hasActiveFilters = 
    priceRange.min > 0 || 
    priceRange.max < 1000 || 
    selectedBadges.length > 0 || 
    inStockOnly;

  const FilterSection: React.FC<{
    title: string;
    section: keyof typeof expandedSections;
    children: React.ReactNode;
  }> = ({ title, section, children }) => (
    <div className="border-b border-[var(--color-border-primary)] pb-4 mb-4 last:border-b-0 last:mb-0">
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary-600)] transition-colors duration-200"
        aria-expanded={expandedSections[section]}
      >
        <span>{title}</span>
        {expandedSections[section] ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      
      {expandedSections[section] && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );

  const content = (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-3">
          {/* Price Presets */}
          <div className="space-y-2">
            {PRICE_PRESETS.map((preset) => (
              <button
                key={`${preset.min}-${preset.max}`}
                type="button"
                onClick={() => handlePricePreset(preset)}
                className={cn(
                  'block w-full text-left px-3 py-2 text-sm rounded-md border transition-colors duration-200',
                  priceRange.min === preset.min && priceRange.max === preset.max
                    ? 'border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
                    : 'border-[var(--color-border-primary)] hover:border-[var(--color-border-secondary)] hover:bg-[var(--color-background-secondary)]'
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              Custom Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="10000"
                value={priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-[var(--color-border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)]"
                placeholder="Min"
              />
              <span className="text-[var(--color-text-muted)]">to</span>
              <input
                type="number"
                min="0"
                max="10000"
                value={priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 1000)}
                className="w-full px-3 py-2 text-sm border border-[var(--color-border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)]"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Eco Badges */}
      <FilterSection title="Sustainability" section="badges">
        <div className="space-y-2">
          {ECO_BADGES.map((badge) => (
            <label
              key={badge.value}
              className="flex items-center space-x-3 cursor-pointer hover:bg-[var(--color-background-secondary)] rounded-md p-2 -m-2 transition-colors duration-200"
            >
              <input
                type="checkbox"
                checked={selectedBadges.includes(badge.value)}
                onChange={() => handleBadgeToggle(badge.value)}
                className="h-4 w-4 text-[var(--color-primary-600)] border-[var(--color-border-primary)] rounded focus:ring-[var(--color-border-focus)]"
              />
              <span className="text-sm text-[var(--color-text-primary)]">
                {badge.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Stock Status */}
      <FilterSection title="Availability" section="stock">
        <label className="flex items-center space-x-3 cursor-pointer hover:bg-[var(--color-background-secondary)] rounded-md p-2 -m-2 transition-colors duration-200">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={handleStockToggle}
            className="h-4 w-4 text-[var(--color-primary-600)] border-[var(--color-border-primary)] rounded focus:ring-[var(--color-border-focus)]"
          />
          <span className="text-sm text-[var(--color-text-primary)]">
            In Stock Only
          </span>
        </label>
      </FilterSection>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--color-background-overlay)]">
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[var(--color-background-surface)] shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-primary)]">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Filters
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-full">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};
