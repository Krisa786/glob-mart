import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getStockStatus, formatPrice } from '@/lib/api/products';
import { StockPill } from '@/components/ui/StockPill';
import { BadgeChips } from '@/components/ui/BadgeChips';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const product = await getProductBySlug(resolvedParams.slug);

    return {
      title: `${product.title} | Global International`,
      description:
        product.short_desc ||
        `Buy ${product.title} from Global International. Premium hospitality and healthcare supplies.`,
      keywords: `${product.title}, ${product.brand}, hospitality supplies, healthcare products`,
      openGraph: {
        title: `${product.title} | Global International`,
        description:
          product.short_desc ||
          `Buy ${product.title} from Global International.`,
        type: 'website',
      },
      alternates: {
        canonical: `/product/${resolvedParams.slug}`,
      },
    };
  } catch (_error) {
    return {
      title: 'Product Not Found | Global International',
      description: 'The requested product could not be found.',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const resolvedParams = await params;
    const product = await getProductBySlug(resolvedParams.slug);
    const stockStatus = getStockStatus(product);

    return (
      <div className="min-h-screen bg-[var(--color-background-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image Section */}
            <div className="space-y-4">
              <div className="aspect-square bg-[var(--color-background-secondary)] rounded-lg border border-[var(--color-border-primary)] flex items-center justify-center">
                <div className="text-center text-[var(--color-text-muted)]">
                  <div className="w-24 h-24 mx-auto mb-4 bg-[var(--color-background-primary)] rounded-lg flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                  <p>Product Image</p>
                </div>
              </div>
            </div>

            {/* Product Information Section */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-serif text-[var(--color-text-primary)] mb-2">
                  {product.title}
                </h1>
                {product.brand && (
                  <p className="text-sm text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
                    {product.brand}
                  </p>
                )}
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  SKU: {product.sku}
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-4">
                <StockPill
                  state={
                    stockStatus.status === 'in-stock'
                      ? 'in'
                      : stockStatus.status === 'low-stock'
                        ? 'low'
                        : 'out'
                  }
                  size="md"
                />
                {stockStatus.status === 'low-stock' && (
                  <span className="text-sm text-[var(--color-warning-600)]">
                    Only {product.stock_quantity} left in stock
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="text-3xl font-semibold text-[var(--color-text-primary)]">
                {formatPrice(product.price, product.currency)}
              </div>

              {/* Sustainability Badges */}
              {product.sustainability_badges && product.sustainability_badges.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                    Sustainability & Certifications
                  </h3>
                  <BadgeChips
                    badges={product.sustainability_badges}
                    size="md"
                    maxVisible={10}
                    showTooltips={true}
                  />
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                    Description
                  </h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    stockStatus.status === 'out-of-stock'
                      ? 'bg-[var(--color-background-tertiary)] text-[var(--color-text-muted)] cursor-not-allowed'
                      : 'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2'
                  }`}
                  disabled={stockStatus.status === 'out-of-stock'}
                >
                  {stockStatus.status === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button className="px-6 py-3 rounded-lg border border-[var(--color-border-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-tertiary)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 transition-colors duration-200">
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (_error) {
    notFound();
  }
}
