'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ChevronDown,
  LogIn,
  LogOut,
  UserCircle,
  Package,
  Heart,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/contexts/SessionContext';
import { getUserMenuItems } from '@/lib/authz';

interface ProfileDropdownProps {
  className?: string;
}

// Icon mapping for menu items
const iconMap = {
  LogIn,
  LogOut,
  User,
  Package,
  Heart,
  Settings,
};

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useSession();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  // Get menu items based on user role
  const menuItems = getUserMenuItems({
    isAuthenticated,
    isLoading: false,
    user,
    roles: user?.roles || [],
  });

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Profile Icon Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 p-2 text-stone-600 hover:text-teal-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-md"
        aria-label="Account menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User className="h-5 w-5" />
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-stone-200 py-1 z-50">
          {isAuthenticated && user ? (
            <>
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-stone-100">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <UserCircle className="h-8 w-8 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-stone-500 truncate">
                      {user.email}
                    </p>
                    {user.roles.length > 0 && (
                      <p className="text-xs text-teal-600 truncate">
                        {user.roles.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Menu Items */}
              {menuItems.map((item, index) => {
                const IconComponent =
                  iconMap[item.icon as keyof typeof iconMap];

                if (item.action === 'logout') {
                  return (
                    <button
                      key={index}
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-red-600 transition-colors duration-200"
                    >
                      {IconComponent && (
                        <IconComponent className="h-4 w-4 mr-3" />
                      )}
                      {item.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-teal-800 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {IconComponent && (
                      <IconComponent className="h-4 w-4 mr-3" />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </>
          ) : (
            <>
              {/* Guest User Menu */}
              <div className="px-4 py-2 border-b border-stone-100">
                <p className="text-sm font-medium text-stone-800">Account</p>
              </div>

              {menuItems.map((item, index) => {
                const IconComponent =
                  iconMap[item.icon as keyof typeof iconMap];

                return (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-teal-800 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {IconComponent && (
                      <IconComponent className="h-4 w-4 mr-3" />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};
