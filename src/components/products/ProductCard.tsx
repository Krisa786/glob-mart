'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Product,
  formatPrice,
  getStockStatus,
  getPrimaryImage,
} from '@/lib/api/products';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StockPill } from '@/components/ui/StockPill';
import { BadgeChips } from '@/components/ui/BadgeChips';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
}) => {
  const stockStatus = getStockStatus(product);
  const primaryImage = getPrimaryImage(product);
  const isOutOfStock = stockStatus.status === 'out-of-stock';

  return (
    <div
      className={cn(
        'group bg-[var(--color-background-surface)] rounded-lg border border-[var(--color-border-primary)] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200',
        isOutOfStock && 'opacity-75',
        className
      )}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-background-secondary)]">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--color-text-muted)] text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-[var(--color-background-primary)] rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-2 left-2">
          <StockPill
            state={
              stockStatus.status === 'in-stock'
                ? 'in'
                : stockStatus.status === 'low-stock'
                  ? 'low'
                  : 'out'
            }
            size="sm"
          />
        </div>

        {/* Sustainability Badges */}
        {product.sustainability_badges &&
          product.sustainability_badges.length > 0 && (
            <div className="absolute top-2 right-2">
              <BadgeChips
                badges={product.sustainability_badges}
                size="sm"
                maxVisible={2}
                showTooltips={false}
                className="flex-col"
              />
            </div>
          )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary-700)] transition-colors duration-200">
          <Link
            href={`/product/${product.slug}`}
            className="focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 rounded-sm"
          >
            {product.title}
          </Link>
        </h3>

        {/* SKU */}
        <p className="text-xs text-[var(--color-text-muted)] mb-2">
          SKU: {product.sku}
        </p>

        {/* Short Description */}
        {product.short_desc && (
          <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
            {product.short_desc}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-[var(--color-text-primary)]">
              {formatPrice(product.price, product.currency)}
            </span>
            {stockStatus.status === 'low-stock' && (
              <span className="text-xs text-[var(--color-warning-600)]">
                Only {product.stock_quantity} left
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          asChild
          href={`/product/${product.slug}`}
          variant={isOutOfStock ? 'secondary' : 'primary'}
          size="sm"
          className="w-full"
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'View Details' : 'View Product'}
        </Button>
      </div>
    </div>
  );
};
