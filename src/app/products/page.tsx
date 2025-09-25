import { Metadata } from 'next';
import { ProductList } from '@/components/products/ProductList';

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

        {/* Product List */}
        <ProductList />
      </div>
    </div>
  );
}
