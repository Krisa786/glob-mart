// Central API client for all API requests with automatic authentication
import { tokenManager } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Refresh token mutex to prevent multiple simultaneous refresh attempts
let refreshPromise: Promise<string> | null = null;

// Enhanced API request function with 401 interceptor and automatic refresh
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  skipAuth = false
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = tokenManager.getAccessToken();

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for refresh tokens
  };

  // Add authorization header if token exists and not skipping auth
  if (accessToken && !skipAuth) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    // Handle 401 Unauthorized - attempt token refresh
    if (response.status === 401 && !skipAuth && accessToken) {
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry the original request with new token
          const retryOptions = {
            ...defaultOptions,
            ...options,
            headers: {
              ...defaultOptions.headers,
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
          };

          const retryResponse = await fetch(url, retryOptions);
          return await handleResponse<T>(retryResponse);
        }
      } catch (_error) {
        // Refresh failed, clear tokens and redirect to login
        // console.error('Token refresh failed:', _error);
        tokenManager.removeAccessToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return await handleResponse<T>(response);
    } catch (_error) {
      // Handle network errors
      // console.error('API request failed:', _error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: [],
        data: undefined,
      };
    }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    // If response is not JSON, create a structured error response
    data = {
      success: false,
      message: response.statusText || 'An error occurred',
      errors: [],
    };
  }

  if (!response.ok) {
    // Return structured error response instead of throwing
    const errorData = data as { message?: string; error?: string; errors?: Array<{ field: string; message: string }> };
    return {
      success: false,
      message: errorData.message || errorData.error || 'An error occurred',
      errors: errorData.errors || [],
      data: undefined,
    };
  }

  return data as ApiResponse<T>;
}

// Refresh access token with mutex to prevent multiple simultaneous requests
async function refreshAccessToken(): Promise<string | null> {
  // If refresh is already in progress, wait for it
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      if (data.success && data.data?.access_token) {
        tokenManager.setAccessToken(data.data.access_token);
        return data.data.access_token;
      }
      throw new Error('Invalid refresh response');
    } catch (error) {
      // Clear tokens on refresh failure
      tokenManager.removeAccessToken();
      throw error;
    } finally {
      // Clear the promise so future requests can attempt refresh again
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Convenience methods for common HTTP verbs
export const api = {
  get: <T>(endpoint: string, skipAuth = false) =>
    apiRequest<T>(endpoint, { method: 'GET' }, skipAuth),
  
  post: <T>(endpoint: string, data?: unknown, skipAuth = false) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, skipAuth),
  
  put: <T>(endpoint: string, data?: unknown, skipAuth = false) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, skipAuth),
  
  patch: <T>(endpoint: string, data?: unknown, skipAuth = false) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, skipAuth),
  
  delete: <T>(endpoint: string, skipAuth = false) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }, skipAuth),
};
