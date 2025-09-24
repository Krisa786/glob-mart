'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/api/categories';

interface CategoryTreeProps {
  categories: Category[];
  className?: string;
  maxDepth?: number;
}

interface CategoryNodeProps {
  category: Category;
  level: number;
  maxDepth: number;
  isExpanded: boolean;
  onToggle: (categoryId: number) => void;
  pathname: string;
}

const CategoryNode: React.FC<CategoryNodeProps> = ({
  category,
  level,
  maxDepth,
  isExpanded,
  onToggle,
  pathname,
}) => {
  const hasChildren = category.children && category.children.length > 0;
  const isActive = pathname === `/category/${category.slug}`;
  const isParentActive = pathname.startsWith(`/category/${category.slug}`) && !isActive;
  
  const indentClass = `ml-${level * 4}`;
  
  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center py-2 px-3 rounded-md transition-colors duration-200',
          'hover:bg-[var(--color-background-surface)]',
          isActive && 'bg-[var(--color-primary-50)] text-[var(--color-text-tertiary)] font-medium',
          isParentActive && 'text-[var(--color-text-tertiary)]',
          level > 0 && indentClass
        )}
      >
        {hasChildren && level < maxDepth && (
          <button
            onClick={() => onToggle(category.id)}
            className="mr-2 p-1 hover:bg-[var(--color-background-surface)] rounded-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
            aria-label={isExpanded ? `Collapse ${category.name}` : `Expand ${category.name}`}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-[var(--color-text-secondary)]" />
            ) : (
              <ChevronRight className="h-4 w-4 text-[var(--color-text-secondary)]" />
            )}
          </button>
        )}
        
        {!hasChildren && level < maxDepth && (
          <div className="w-6 mr-2" /> // Spacer for alignment
        )}
        
        <Link
          href={`/category/${category.slug}`}
          className={cn(
            'flex-1 text-sm transition-colors duration-200',
            'hover:text-[var(--color-text-tertiary)]',
            isActive && 'font-medium',
            isParentActive && 'font-medium'
          )}
          aria-current={isActive ? 'page' : undefined}
        >
          {category.name}
          {category.product_count !== undefined && (
            <span className="ml-2 text-xs text-[var(--color-text-muted)]">
              ({category.product_count})
            </span>
          )}
        </Link>
      </div>
      
      {hasChildren && isExpanded && level < maxDepth && (
        <div className="ml-2">
          {category.children!.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              maxDepth={maxDepth}
              isExpanded={false} // Children start collapsed
              onToggle={onToggle}
              pathname={pathname}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  className,
  maxDepth = 3,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const pathname = usePathname();
  const treeRef = useRef<HTMLDivElement>(null);

  // Auto-expand parent categories when on a child category page
  useEffect(() => {
    const currentSlug = pathname.split('/').pop();
    if (currentSlug) {
      const findAndExpandParents = (cats: Category[], targetSlug: string, parents: number[] = []): void => {
        for (const cat of cats) {
          if (cat.slug === targetSlug) {
            setExpandedNodes(prev => new Set([...prev, ...parents]));
            return;
          }
          if (cat.children && cat.children.length > 0) {
            findAndExpandParents(cat.children, targetSlug, [...parents, cat.id]);
          }
        }
      };
      findAndExpandParents(categories, currentSlug);
    }
  }, [pathname, categories]);

  const handleToggle = (categoryId: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const target = event.target as HTMLElement;
      const button = target.closest('button');
      if (button) {
        button.click();
      }
    }
  };

  return (
    <nav
      ref={treeRef}
      className={cn(
        'bg-[var(--color-background-surface)] rounded-lg border border-[var(--color-border-primary)]',
        'shadow-sm',
        className
      )}
      role="navigation"
      aria-label="Category navigation"
      onKeyDown={handleKeyDown}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Categories
        </h2>
        <div className="space-y-1">
          {categories.map((category) => (
            <CategoryNode
              key={category.id}
              category={category}
              level={0}
              maxDepth={maxDepth}
              isExpanded={expandedNodes.has(category.id)}
              onToggle={handleToggle}
              pathname={pathname}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};
