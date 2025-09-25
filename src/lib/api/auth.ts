// Enhanced API client for authentication endpoints with JWT + Refresh Token support
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const LOCAL_API_BASE_URL = '/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  retryAfter?: number;
}

export interface User {
  uuid: string;
  email: string;
  full_name: string;
  phone_country_code?: string;
  phone?: string;
  roles: string[];
  is_active: boolean;
  email_verified: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  two_fa_code?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone_country_code?: string;
  phone?: string;
  role?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  resetLink?: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Refresh token mutex to prevent multiple simultaneous refresh attempts
let refreshPromise: Promise<string> | null = null;

// Enhanced API request function with 401 interceptor and automatic refresh
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  skipAuth = false,
  baseUrl?: string
): Promise<ApiResponse<T>> {
  const url = `${baseUrl || API_BASE_URL}${endpoint}`;
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
    const errorData = data as {
      message?: string;
      error?: string;
      errors?: Array<{ field: string; message: string }>;
    };
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

// Authentication API functions
export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiRequest<AuthResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      true
    ); // Skip auth for login
  },

  // Register new user
  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> {
    return apiRequest<AuthResponse>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      true
    ); // Skip auth for registration
  },

  // Refresh access token
  async refresh(): Promise<
    ApiResponse<{ access_token: string; expires_in: number }>
  > {
    return apiRequest(
      '/auth/refresh',
      {
        method: 'POST',
      },
      true
    ); // Skip auth for refresh
  },

  // Logout user
  async logout(): Promise<ApiResponse> {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return apiRequest<{ user: User }>('/auth/me', {
      method: 'GET',
    }); // Uses automatic auth from apiRequest
  },

  // Forgot password
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<ForgotPasswordResponse>> {
    // Call backend API directly
    return apiRequest<ForgotPasswordResponse>(
      '/auth/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      true
    ); // Skip auth for forgot password, use backend API
  },

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    // Call backend API directly
    return apiRequest(
      '/auth/reset-password',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      true
    ); // Skip auth for reset password, use backend API
  },

  // Verify reset token
  async verifyResetToken(
    token: string
  ): Promise<ApiResponse<{ email: string }>> {
    return apiRequest<{ email: string }>(
      '/auth/verify-reset-token',
      {
        method: 'POST',
        body: JSON.stringify({ token }),
      },
      true,
      LOCAL_API_BASE_URL
    ); // Skip auth for token verification, use local API
  },
};

// Enhanced token management utilities
export const tokenManager = {
  // Store access token in localStorage
  setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  },

  // Get access token from localStorage
  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  // Remove access token from localStorage
  removeAccessToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  },

  // Check if token is expired with 30s leeway for time skew
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      // Add 30s leeway to account for time skew
      return payload.exp < now + 30;
    } catch {
      return true;
    }
  },

  // Check if token is valid (exists and not expired)
  isTokenValid(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired(token);
  },

  // Get token expiry time
  getTokenExpiry(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp;
    } catch {
      return null;
    }
  },

  // Get time until token expires (in seconds)
  getTimeUntilExpiry(token: string): number {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return 0;
    return Math.max(0, expiry - Math.floor(Date.now() / 1000));
  },
};
