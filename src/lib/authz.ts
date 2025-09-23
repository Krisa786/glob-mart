/**
 * Authorization utilities for role-based access control
 * Provides helper functions for checking user roles and authentication status
 */

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

export interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: string[];
}

/**
 * Check if user has a specific role
 * @param roles - Array of user roles
 * @param role - Role to check for
 * @returns boolean indicating if user has the role
 */
export function hasRole(roles: string[], role: string): boolean {
  return roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 * @param roles - Array of user roles
 * @param requiredRoles - Array of roles to check for
 * @returns boolean indicating if user has any of the required roles
 */
export function hasAnyRole(roles: string[], requiredRoles: string[]): boolean {
  return requiredRoles.some(role => roles.includes(role));
}

/**
 * Check if user is authenticated
 * @param sessionState - Current session state
 * @returns boolean indicating if user is authenticated
 */
export function isAuthenticated(sessionState: SessionState): boolean {
  return sessionState.isAuthenticated && !sessionState.isLoading && sessionState.user !== null;
}

/**
 * Check if user has admin role
 * @param roles - Array of user roles
 * @returns boolean indicating if user is admin
 */
export function isAdmin(roles: string[]): boolean {
  return hasRole(roles, 'admin') || hasRole(roles, 'super_admin');
}

/**
 * Check if user has customer role
 * @param roles - Array of user roles
 * @returns boolean indicating if user is customer
 */
export function isCustomer(roles: string[]): boolean {
  return hasRole(roles, 'customer') || hasRole(roles, 'b2b_customer');
}

/**
 * Get user's primary role (first role in the array)
 * @param roles - Array of user roles
 * @returns string representing the primary role
 */
export function getPrimaryRole(roles: string[]): string {
  return roles[0] || 'guest';
}

/**
 * Check if user can access admin routes
 * @param sessionState - Current session state
 * @returns boolean indicating if user can access admin routes
 */
export function canAccessAdmin(sessionState: SessionState): boolean {
  return isAuthenticated(sessionState) && isAdmin(sessionState.roles);
}

/**
 * Check if user can access customer routes
 * @param sessionState - Current session state
 * @returns boolean indicating if user can access customer routes
 */
export function canAccessCustomer(sessionState: SessionState): boolean {
  return isAuthenticated(sessionState) && isCustomer(sessionState.roles);
}

/**
 * Get navigation items based on user role
 * @param sessionState - Current session state
 * @returns Array of navigation items appropriate for the user's role
 */
export function getNavigationItems(sessionState: SessionState) {
  const { isAuthenticated, roles } = sessionState;
  
  if (!isAuthenticated) {
    return [
      { label: 'Products', href: '/products', public: true },
      { label: 'About', href: '/about', public: true },
      { label: 'Contact', href: '/contact', public: true },
    ];
  }

  const baseItems = [
    { label: 'Products', href: '/products', public: true },
    { label: 'About', href: '/about', public: true },
    { label: 'Contact', href: '/contact', public: true },
  ];

  // Add role-specific items
  if (isCustomer(roles)) {
    baseItems.push(
      { label: 'My Account', href: '/account', public: false },
      { label: 'Orders', href: '/orders', public: false },
    );
  }

  if (isAdmin(roles)) {
    baseItems.push(
      { label: 'Admin', href: '/admin', public: false },
    );
  }

  return baseItems;
}

export interface MenuItem {
  label: string;
  href: string;
  icon: string;
  action?: string;
}

/**
 * Get user menu items based on authentication status and role
 * @param sessionState - Current session state
 * @returns Array of menu items for the user dropdown
 */
export function getUserMenuItems(sessionState: SessionState): MenuItem[] {
  const { isAuthenticated, roles } = sessionState;
  
  if (!isAuthenticated) {
    return [
      { label: 'Sign In', href: '/login', icon: 'LogIn' },
      // { label: 'Sign Up', href: '/register', icon: 'User' },
    ];
  }

  const menuItems: MenuItem[] = [
    { label: 'My Account', href: '/account', icon: 'User' },
  ];

  // Add role-specific menu items
  if (isCustomer(roles)) {
    menuItems.push(
      { label: 'Orders', href: '/orders', icon: 'Package' },
      { label: 'Wishlist', href: '/wishlist', icon: 'Heart' },
    );
  }

  if (isAdmin(roles)) {
    menuItems.push(
      { label: 'Admin Panel', href: '/admin', icon: 'Settings' },
    );
  }

  menuItems.push(
    { label: 'Sign Out', href: '#', icon: 'LogOut', action: 'logout' },
  );

  return menuItems;
}
