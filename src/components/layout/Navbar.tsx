'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProfileDropdown } from './ProfileDropdown';
import { cn } from '@/lib/utils';
import { useSession } from '@/contexts/SessionContext';
import { getNavigationItems } from '@/lib/authz';

export interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const pathname = usePathname();
  const session = useSession();
  
  // Get navigation items based on user role
  const navigationItems = getNavigationItems(session);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex flex-col hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-md"
              aria-label="Global International - Home"
            >
              <span className="text-2xl font-bold text-teal-800">GLOBAL</span>
              <span className="text-sm font-light text-stone-600 -mt-1">
                INTERNATIONAL
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav
            className="hidden md:flex space-x-8"
            role="navigation"
            aria-label="Main navigation"
          >
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-stone-700 hover:text-teal-800 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-md px-2 py-1',
                    isActive && 'text-teal-800 font-semibold'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Search and CTA */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 text-stone-600 hover:text-teal-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-md"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            <ProfileDropdown />

            {/* Quote Button - Show for authenticated users or as CTA for guests */}
            {session.isAuthenticated ? (
              <Button
                variant="primary"
                size="md"
                className="rounded-full hidden sm:block"
                asChild
              >
                <Link href="/quote">QUOTE</Link>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                className="rounded-full hidden sm:block"
                asChild
              >
                <Link href="/login">GET QUOTE</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Navbar };
