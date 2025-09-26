'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStockToken, getSizeToken, type StockState, type ComponentSize } from '@/lib/ui/tokens';

interface StockPillProps {
  state: StockState;
  size?: ComponentSize;
  className?: string;
  showIcon?: boolean;
  customLabel?: string;
}

const iconMap = {
  'check-circle': CheckCircle,
  'alert-triangle': AlertTriangle,
  'x-circle': XCircle,
} as const;

export const StockPill: React.FC<StockPillProps> = ({
  state,
  size = 'md',
  className,
  showIcon = true,
  customLabel,
}) => {
  const stockToken = getStockToken(state);
  const sizeToken = getSizeToken(size);
  const IconComponent = iconMap[stockToken.icon];

  const label = customLabel || stockToken.label;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        stockToken.text,
        stockToken.bg,
        stockToken.border,
        sizeToken.padding,
        sizeToken.text,
        sizeToken.gap,
        className
      )}
      role="status"
      aria-label={stockToken.ariaLabel}
      aria-live="polite"
    >
      {showIcon && (
        <IconComponent 
          className={cn(sizeToken.icon, 'flex-shrink-0')}
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </span>
  );
};
