import { Metadata } from 'next';
import { CategoryOverview } from '@/components/categories/CategoryOverview';
import { getCategoryTree } from '@/lib/api/categories';

export const metadata: Metadata = {
  title: 'Product Categories | Global International',
  description: 'Browse our comprehensive range of hospitality and healthcare supplies organized by category. Find everything you need for your business.',
  keywords: 'hospitality categories, healthcare supplies, product categories, amenities, linen, safety equipment',
  openGraph: {
    title: 'Product Categories | Global International',
    description: 'Browse our comprehensive range of hospitality and healthcare supplies organized by category.',
    type: 'website',
  },
};

export default async function CategoriesPage() {
  const categoryTree = await getCategoryTree();

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-text-tertiary)] mb-4">
            Product Categories
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl">
            Explore our comprehensive range of hospitality and healthcare supplies, 
            carefully organized to help you find exactly what you need for your business.
          </p>
        </div>
        
        <CategoryOverview categories={categoryTree} />
      </div>
    </div>
  );
}
