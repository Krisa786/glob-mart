import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/api/products';

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

    return (
      <div className="min-h-screen bg-[var(--color-background-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-serif text-[var(--color-text-tertiary)] mb-4">
              {product.title}
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
              Product detail page will be implemented in a future task.
            </p>
            <div className="bg-[var(--color-background-surface)] rounded-lg border border-[var(--color-border-primary)] p-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                Product Information
              </h2>
              <div className="space-y-2 text-left">
                <p>
                  <strong>SKU:</strong> {product.sku}
                </p>
                <p>
                  <strong>Brand:</strong> {product.brand || 'N/A'}
                </p>
                <p>
                  <strong>Price:</strong>{' '}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: product.currency,
                  }).format(product.price)}
                </p>
                <p>
                  <strong>Status:</strong> {product.status}
                </p>
                {product.sustainability_badges &&
                  product.sustainability_badges.length > 0 && (
                    <p>
                      <strong>Sustainability Badges:</strong>{' '}
                      {product.sustainability_badges.join(', ')}
                    </p>
                  )}
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
