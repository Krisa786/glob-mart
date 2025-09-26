/**
 * Design tokens for inventory and sustainability visuals
 * Standardizes stock states and eco badges across PLP/PDP
 */

// Stock state design tokens
export const stockTokens = {
  in: {
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'check-circle',
    label: 'In Stock',
    ariaLabel: 'Product is in stock and available for purchase'
  },
  low: {
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'alert-triangle',
    label: 'Low Stock',
    ariaLabel: 'Product has limited stock remaining'
  },
  out: {
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: 'x-circle',
    label: 'Out of Stock',
    ariaLabel: 'Product is currently out of stock'
  }
} as const;

// Sustainability badge tokens
export const badgeTokens = {
  FSC: {
    icon: 'tree-pine',
    label: 'FSC Certified',
    tooltip: 'Forest Stewardship Council certified - sustainably sourced materials',
    color: 'text-green-700 bg-green-50 border-green-200'
  },
  Recycled: {
    icon: 'recycle',
    label: 'Recycled',
    tooltip: 'Made from recycled materials',
    color: 'text-blue-700 bg-blue-50 border-blue-200'
  },
  Organic: {
    icon: 'leaf',
    label: 'Organic',
    tooltip: 'Made from organic materials',
    color: 'text-green-700 bg-green-50 border-green-200'
  },
  FairTrade: {
    icon: 'handshake',
    label: 'Fair Trade',
    tooltip: 'Fair trade certified - ethical sourcing and production',
    color: 'text-purple-700 bg-purple-50 border-purple-200'
  },
  BPAFree: {
    icon: 'shield-check',
    label: 'BPA Free',
    tooltip: 'BPA-free materials for health and safety',
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
  },
  Biodegradable: {
    icon: 'leaf',
    label: 'Biodegradable',
    tooltip: 'Made from biodegradable materials',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  },
  EnergyEfficient: {
    icon: 'zap',
    label: 'Energy Efficient',
    tooltip: 'Energy efficient design and operation',
    color: 'text-yellow-700 bg-yellow-50 border-yellow-200'
  },
  WaterSaving: {
    icon: 'droplets',
    label: 'Water Saving',
    tooltip: 'Water saving technology and design',
    color: 'text-cyan-700 bg-cyan-50 border-cyan-200'
  },
  // Default fallback for unknown badges
  Verified: {
    icon: 'check-circle',
    label: 'Verified',
    tooltip: 'Product meets quality and sustainability standards',
    color: 'text-gray-700 bg-gray-50 border-gray-200'
  }
} as const;

// Component size tokens
export const sizeTokens = {
  sm: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    icon: 'w-3 h-3',
    gap: 'gap-1'
  },
  md: {
    padding: 'px-2.5 py-1.5',
    text: 'text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-1.5'
  },
  lg: {
    padding: 'px-3 py-2',
    text: 'text-base',
    icon: 'w-5 h-5',
    gap: 'gap-2'
  }
} as const;

// Type definitions
export type StockState = keyof typeof stockTokens;
export type BadgeType = keyof typeof badgeTokens;
export type ComponentSize = keyof typeof sizeTokens;

// Helper functions
export const getStockToken = (state: StockState) => stockTokens[state];
export const getBadgeToken = (badge: string): typeof badgeTokens[keyof typeof badgeTokens] => {
  // Handle special cases for badges with hyphens
  const normalizedBadge = badge
    .replace(/[^a-zA-Z-]/g, '') // Keep hyphens for special cases
    .replace(/-/g, '') // Remove hyphens for key matching
    .replace(/^BPAFree$/, 'BPAFree') // Handle BPA-Free -> BPAFree
    .replace(/^EnergyEfficient$/, 'EnergyEfficient') // Handle Energy-Efficient -> EnergyEfficient
    .replace(/^WaterSaving$/, 'WaterSaving') as BadgeType; // Handle Water-Saving -> WaterSaving
  
  return badgeTokens[normalizedBadge] || badgeTokens.Verified;
};
export const getSizeToken = (size: ComponentSize) => sizeTokens[size];
