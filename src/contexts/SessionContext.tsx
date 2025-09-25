'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { authApi, tokenManager, type User } from '@/lib/api/auth';

interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: string[];
}

interface SessionContextType extends SessionState {
  login: (_user: User, _accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  hasRole: (_role: string) => boolean;
  hasAnyRole: (_roles: string[]) => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [sessionState, setSessionState] = useState<SessionState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    roles: [],
  });
  const router = useRouter();

  // Initialize session on mount
  const initializeSession = useCallback(async () => {
    try {
      const token = tokenManager.getAccessToken();

      if (!token || tokenManager.isTokenExpired(token)) {
        // Token is missing or expired, clear session
        tokenManager.removeAccessToken();
        setSessionState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          roles: [],
        });
        return;
      }

      // Token exists and is valid, fetch user data
      const response = await authApi.getCurrentUser();
      if (response.success && response.data) {
        setSessionState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          roles: response.data.user.roles || [],
        });
      } else {
        // API call failed, clear session
        tokenManager.removeAccessToken();
        setSessionState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          roles: [],
        });
      }
    } catch (_error) {
      // Error fetching user, clear session
      // Log error for debugging
      // console.error('Session initialization error:', _error);
      tokenManager.removeAccessToken();
      setSessionState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        roles: [],
      });
    }
  }, []);

  // Login function
  const login = useCallback(async (user: User, accessToken: string) => {
    tokenManager.setAccessToken(accessToken);
    setSessionState({
      user,
      isAuthenticated: true,
      isLoading: false,
      roles: user.roles || [],
    });
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout API to revoke refresh token
      await authApi.logout();
    } catch (_error) {
      // Continue with logout even if API call fails
      // Log error for debugging
      // console.error('Logout API error:', _error);
    } finally {
      // Clear local session
      tokenManager.removeAccessToken();
      setSessionState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        roles: [],
      });
      // Redirect to home page
      router.push('/');
    }
  }, [router]);

  // Refresh session function
  const refreshSession = useCallback(async () => {
    if (!tokenManager.isTokenValid()) {
      // Token is invalid, clear session
      tokenManager.removeAccessToken();
      setSessionState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        roles: [],
      });
      return;
    }

    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.data) {
        setSessionState((prev) => ({
          ...prev,
          user: response.data!.user,
          roles: response.data!.user.roles || [],
        }));
      } else {
        // API call failed, clear session
        tokenManager.removeAccessToken();
        setSessionState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          roles: [],
        });
      }
    } catch (_error) {
      // Log error for debugging
      // console.error('Session refresh error:', _error);
      tokenManager.removeAccessToken();
      setSessionState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        roles: [],
      });
    }
  }, []);

  // Role checking functions
  const hasRole = useCallback(
    (role: string) => {
      return sessionState.roles.includes(role);
    },
    [sessionState.roles]
  );

  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return roles.some((role) => sessionState.roles.includes(role));
    },
    [sessionState.roles]
  );

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Set up token expiry monitoring
  useEffect(() => {
    const token = tokenManager.getAccessToken();
    if (!token || !sessionState.isAuthenticated) return;

    const timeUntilExpiry = tokenManager.getTimeUntilExpiry(token);
    if (timeUntilExpiry <= 0) return;

    // Set up a timer to refresh the session before token expires
    const refreshTimer = setTimeout(
      () => {
        refreshSession();
      },
      (timeUntilExpiry - 60) * 1000
    ); // Refresh 1 minute before expiry

    return () => clearTimeout(refreshTimer);
  }, [sessionState.isAuthenticated, refreshSession]);

  const contextValue: SessionContextType = {
    ...sessionState,
    login,
    logout,
    refreshSession,
    hasRole,
    hasAnyRole,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook to use session context
export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, roles } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push('/login');
          return;
        }

        if (
          requiredRoles &&
          !requiredRoles.some((role) => roles.includes(role))
        ) {
          router.push('/unauthorized');
          return;
        }
      }
    }, [isAuthenticated, isLoading, roles, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    if (requiredRoles && !requiredRoles.some((role) => roles.includes(role))) {
      return null;
    }

    return <Component {...props} />;
  };
}
