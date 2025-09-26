import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductList } from '@/components/products/ProductList';
import { ProductsPageWithFilters } from '@/components/products/ProductsPageWithFilters';

export const metadata: Metadata = {
  title: 'All Products | Global International',
  description:
    'Browse our complete range of hospitality and healthcare supplies. Premium quality products for hotels, resorts, hospitals, and wellness operators.',
  keywords:
    'hospitality supplies, healthcare products, amenities, linen, safety equipment, hotel supplies, medical supplies',
  openGraph: {
    title: 'All Products | Global International',
    description:
      'Browse our complete range of hospitality and healthcare supplies.',
    type: 'website',
  },
  alternates: {
    canonical: '/products',
  },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-text-tertiary)] mb-4">
            All Products
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl">
            Discover our comprehensive range of premium hospitality and
            healthcare supplies. From amenities and linens to safety equipment
            and medical supplies, we have everything you need for your business.
          </p>
        </div>

        {/* Products with Filters */}
        <Suspense fallback={
          <div className="space-y-6">
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
        }>
          <ProductsPageWithFilters />
        </Suspense>
      </div>
    </div>
  );
}
