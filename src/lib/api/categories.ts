import { unstable_cache } from 'next/cache';

// Types for category data
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
  product_count?: number;
  children?: Category[];
  created_at: string;
  updated_at: string;
}

export interface CategoryBreadcrumb {
  id: number;
  name: string;
  slug: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Cache configuration
const CACHE_TTL = 300; // 5 minutes

/**
 * Get category tree structure
 */
export const getCategoryTree = unstable_cache(
  async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        next: { revalidate: CACHE_TTL },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (_error) {
      // Error fetching category tree - returning empty array
      return [];
    }
  },
  ['category-tree'],
  { revalidate: CACHE_TTL }
);

/**
 * Get flat list of categories with product counts
 */
export const getCategoriesWithProductCounts = unstable_cache(
  async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories?flat=true`, {
        next: { revalidate: CACHE_TTL },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (_error) {
      // Error fetching categories with counts - returning empty array
      return [];
    }
  },
  ['categories-flat'],
  { revalidate: CACHE_TTL }
);

/**
 * Get category by slug
 */
export const getCategoryBySlug = unstable_cache(
  async (slug: string): Promise<Category> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${slug}`, {
        next: { revalidate: CACHE_TTL },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Category not found');
        }
        throw new Error(`Failed to fetch category: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      // Error fetching category by slug - rethrowing error
      throw error;
    }
  },
  ['category-by-slug'],
  { revalidate: CACHE_TTL }
);

/**
 * Get category breadcrumb
 */
export const getCategoryBreadcrumb = unstable_cache(
  async (categoryId: number): Promise<CategoryBreadcrumb[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/categories/${categoryId}/breadcrumb`,
        {
          next: { revalidate: CACHE_TTL },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch breadcrumb: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (_error) {
      // Error fetching category breadcrumb - returning empty array
      return [];
    }
  },
  ['category-breadcrumb'],
  { revalidate: CACHE_TTL }
);

/**
 * Search categories
 */
export const searchCategories = async (
  query: string,
  limit: number = 10
): Promise<Category[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/categories/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        next: { revalidate: CACHE_TTL },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search categories: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (_error) {
    // Error searching categories - returning empty array
    return [];
  }
};
