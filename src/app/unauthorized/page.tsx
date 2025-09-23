'use client';

import Link from 'next/link';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--color-background-primary)' }}
    >
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-red-100 rounded-full p-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-serif font-bold text-red-800">
            Access Denied
          </h1>
          <p className="text-lg text-stone-600">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-sm text-stone-500">
            Please contact your administrator if you believe this is an error.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/account"
            className="inline-flex items-center justify-center w-full px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Dashboard
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-4 py-3 border border-stone-300 text-base font-medium rounded-lg text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Help Text */}
        <div className="text-xs text-stone-400">
          <p>
            Need help? Contact{' '}
            <a
              href="mailto:support@globalinternational.com"
              className="text-teal-600 hover:text-teal-700 underline"
            >
              support@globalinternational.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
