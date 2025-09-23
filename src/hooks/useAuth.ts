'use client';

import { useSession } from '@/contexts/SessionContext';

/**
 * @deprecated Use useSession from SessionContext instead
 * This hook is kept for backward compatibility
 */
export function useAuth() {
  const session = useSession();
  
  return {
    user: session.user,
    isLoading: session.isLoading,
    isAuthenticated: session.isAuthenticated,
    login: session.login,
    logout: session.logout,
  };
}
