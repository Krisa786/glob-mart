import { unstable_cache } from 'next/cache';

// Types for product data based on backend API
export interface Product {
  id: number;
  title: string;
  slug: string;
  sku: string;
  short_desc?: string;
  long_desc?: string;
  brand?: string;
  category_id: number;
  price: number;
  currency: string;
  status: 'draft' | 'published' | 'archived';
  sustainability_badges?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Additional fields that might be included
  in_stock?: boolean;
  stock_quantity?: number;
  images?: ProductImage[];
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ProductImage {
  id: number;
  product_id: number;
  s3_key: string;
  url: string;
  cdn_url?: string;
  alt?: string;
  position: number;
  width?: number;
  height?: number;
  size_variant: 'original' | 'thumb' | 'medium' | 'large';
  file_size?: number;
  content_type?: string;
  image_hash?: string;
  created_at: string;
}

export interface ProductSearchParams {
  q?: string;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  badge?: string;
  sort?: 'price' | 'newest' | 'oldest' | 'name' | 'brand';
  page?: number;
  limit?: number;
}

export interface ProductSearchResult {
  products: Product[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Cache configuration
const CACHE_TTL = 300; // 5 minutes

/**
 * Search products with filters and pagination
 */
export const searchProducts = async (
  params: ProductSearchParams = {}
): Promise<ProductSearchResult> => {
  try {
    const searchParams = new URLSearchParams();

    // Add query parameters
    if (params.q) searchParams.append('q', params.q);
    if (params.category)
      searchParams.append('category', params.category.toString());
    if (params.minPrice)
      searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice)
      searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.badge) searchParams.append('badge', params.badge);
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/products?${searchParams.toString()}`,
      {
        next: { revalidate: CACHE_TTL },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();

    // Transform backend response format to frontend expected format
    const backendPagination = data.meta?.pagination;
    return {
      products: data.data || [],
      pagination: backendPagination
        ? {
            current_page: backendPagination.page,
            per_page: backendPagination.limit,
            total: backendPagination.total,
            total_pages: backendPagination.totalPages,
            has_next: backendPagination.hasNextPage,
            has_prev: backendPagination.hasPrevPage,
          }
        : {
            current_page: 1,
            per_page: 20,
            total: 0,
            total_pages: 0,
            has_next: false,
            has_prev: false,
          },
    };
  } catch (error) {
    // console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Get product by slug
 */
export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<Product> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
        next: { revalidate: CACHE_TTL },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error(`Failed to fetch product: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      // console.error('Error fetching product by slug:', error);
      throw error;
    }
  },
  ['product-by-slug'],
  { revalidate: CACHE_TTL }
);

/**
 * Get products by category
 */
export const getProductsByCategory = async (
  categoryId: number,
  params: Omit<ProductSearchParams, 'category'> = {}
): Promise<ProductSearchResult> => {
  return searchProducts({
    ...params,
    category: categoryId,
  });
};

/**
 * Get all products (for /products page)
 */
export const getAllProducts = async (
  params: Omit<ProductSearchParams, 'category'> = {}
): Promise<ProductSearchResult> => {
  return searchProducts(params);
};

/**
 * Format price with currency
 */
export const formatPrice = (
  price: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

/**
 * Get product stock status
 */
export const getStockStatus = (
  product: Product
): { status: 'in-stock' | 'low-stock' | 'out-of-stock'; text: string } => {
  if (product.in_stock === false) {
    return { status: 'out-of-stock', text: 'Out of Stock' };
  }

  if (product.stock_quantity !== undefined && product.stock_quantity <= 5) {
    return { status: 'low-stock', text: 'Low Stock' };
  }

  return { status: 'in-stock', text: 'In Stock' };
};

/**
 * Get primary product image
 */
export const getPrimaryImage = (product: Product): string | null => {
  if (product.images && product.images.length > 0) {
    // First try to find the original size image
    const originalImage = product.images.find(
      (img) => img.size_variant === 'original'
    );
    if (originalImage) {
      return originalImage.cdn_url || originalImage.url;
    }

    // Fallback to the first image
    const firstImage = product.images[0];
    return firstImage.cdn_url || firstImage.url;
  }
  return null;
};

/**
 * Get product image by size variant
 */
export const getProductImageBySize = (
  product: Product,
  size: 'original' | 'thumb' | 'medium' | 'large'
): string | null => {
  if (product.images && product.images.length > 0) {
    const image = product.images.find((img) => img.size_variant === size);
    if (image) {
      return image.cdn_url || image.url;
    }

    // Fallback to original if requested size not found
    if (size !== 'original') {
      return getProductImageBySize(product, 'original');
    }
  }
  return null;
};
