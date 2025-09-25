import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Home } from 'lucide-react';

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[var(--color-text-muted)] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
            Category Not Found
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            The category you're looking for doesn't exist or may have been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            asChild
            href="/categories"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            asChild
            href="/"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
