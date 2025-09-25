import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/categories/CategoryPage';
import { getCategoryBySlug, getCategoryBreadcrumb } from '@/lib/api/categories';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const category = await getCategoryBySlug(resolvedParams.slug);
    
    return {
      title: `${category.name} | Global International`,
      description: category.description || `Browse ${category.name} products from Global International. Premium hospitality and healthcare supplies.`,
      keywords: `${category.name}, hospitality supplies, healthcare products, ${category.name.toLowerCase()}`,
      openGraph: {
        title: `${category.name} | Global International`,
        description: category.description || `Browse ${category.name} products from Global International.`,
        type: 'website',
      },
      alternates: {
        canonical: `/category/${resolvedParams.slug}`,
      },
    };
  } catch (error) {
    return {
      title: 'Category Not Found | Global International',
      description: 'The requested category could not be found.',
    };
  }
}

export default async function CategorySlugPage({ params, searchParams }: CategoryPageProps) {
  try {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    
    const category = await getCategoryBySlug(resolvedParams.slug);
    const breadcrumb = await getCategoryBreadcrumb(category.id);
    
    const page = parseInt(resolvedSearchParams.page || '1');
    const sort = resolvedSearchParams.sort || 'newest';

    return (
      <CategoryPage 
        category={category}
        breadcrumb={breadcrumb}
        currentPage={page}
        sortBy={sort}
      />
    );
  } catch (error) {
    notFound();
  }
}
