'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  TreePine, 
  Recycle, 
  Leaf, 
  Handshake, 
  ShieldCheck, 
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBadgeToken, getSizeToken, type ComponentSize } from '@/lib/ui/tokens';

interface BadgeChipsProps {
  badges: string[];
  size?: ComponentSize;
  className?: string;
  maxVisible?: number;
  showTooltips?: boolean;
}

const iconMap = {
  'tree-pine': TreePine,
  'recycle': Recycle,
  'leaf': Leaf,
  'handshake': Handshake,
  'shield-check': ShieldCheck,
  'check-circle': CheckCircle,
} as const;

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  isVisible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, isVisible }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      setPosition({
        top: triggerRect.bottom + window.scrollY + 8,
        left: Math.max(8, triggerRect.left + window.scrollX - tooltipRect.width / 2 + triggerRect.width / 2)
      });
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <div ref={triggerRef}>
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-[var(--z-tooltip)] px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg max-w-xs"
          style={{ top: position.top, left: position.left }}
          role="tooltip"
          aria-hidden="true"
        >
          {content}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export const BadgeChips: React.FC<BadgeChipsProps> = ({
  badges,
  size = 'md',
  className,
  maxVisible = 5,
  showTooltips = true,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const sizeToken = getSizeToken(size);

  if (!badges || badges.length === 0) {
    return null;
  }

  const visibleBadges = expanded ? badges : badges.slice(0, maxVisible);
  const hasMore = badges.length > maxVisible;

  return (
    <div className={cn('flex flex-wrap items-center', sizeToken.gap, className)}>
      {visibleBadges.map((badge, index) => {
        const badgeToken = getBadgeToken(badge);
        const IconComponent = iconMap[badgeToken.icon];
        const isHovered = hoveredBadge === badge;

        const chip = (
          <span
            key={`${badge}-${index}`}
            className={cn(
              'inline-flex items-center font-medium rounded-full border',
              badgeToken.color,
              sizeToken.padding,
              sizeToken.text,
              sizeToken.gap,
              'transition-colors duration-200',
              isHovered && 'ring-2 ring-offset-1 ring-gray-400'
            )}
            onMouseEnter={() => setHoveredBadge(badge)}
            onMouseLeave={() => setHoveredBadge(null)}
            onFocus={() => setHoveredBadge(badge)}
            onBlur={() => setHoveredBadge(null)}
            tabIndex={0}
            role="img"
            aria-label={`${badgeToken.label} certification`}
          >
            <IconComponent 
              className={cn(sizeToken.icon, 'flex-shrink-0')}
              aria-hidden="true"
            />
            <span>{badgeToken.label}</span>
          </span>
        );

        if (showTooltips) {
          return (
            <Tooltip
              key={`${badge}-${index}`}
              content={badgeToken.tooltip}
              isVisible={isHovered}
            >
              {chip}
            </Tooltip>
          );
        }

        return chip;
      })}

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'inline-flex items-center font-medium rounded-full border',
            'text-gray-700 bg-gray-50 border-gray-200',
            'hover:bg-gray-100 hover:border-gray-300',
            'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400',
            'transition-colors duration-200',
            sizeToken.padding,
            sizeToken.text,
            sizeToken.gap
          )}
          aria-label={expanded ? 'Show fewer badges' : `Show ${badges.length - maxVisible} more badges`}
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              <ChevronUp className={cn(sizeToken.icon, 'flex-shrink-0')} aria-hidden="true" />
              <span>Less</span>
            </>
          ) : (
            <>
              <ChevronDown className={cn(sizeToken.icon, 'flex-shrink-0')} aria-hidden="true" />
              <span>+{badges.length - maxVisible}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
