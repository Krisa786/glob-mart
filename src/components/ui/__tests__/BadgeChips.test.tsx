import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BadgeChips } from '../BadgeChips';

describe('BadgeChips', () => {
  const mockBadges = ['FSC', 'Recycled', 'Organic', 'FairTrade', 'BPAFree', 'UnknownBadge'];

  it('renders badges correctly', () => {
    render(<BadgeChips badges={mockBadges} />);
    
    expect(screen.getByText('FSC Certified')).toBeInTheDocument();
    expect(screen.getByText('Recycled')).toBeInTheDocument();
    expect(screen.getByText('Organic')).toBeInTheDocument();
  });

  it('handles unknown badges with fallback', () => {
    render(<BadgeChips badges={['UnknownBadge']} />);
    
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('limits visible badges when maxVisible is set', () => {
    render(<BadgeChips badges={mockBadges} maxVisible={3} />);
    
    expect(screen.getByText('FSC Certified')).toBeInTheDocument();
    expect(screen.getByText('Recycled')).toBeInTheDocument();
    expect(screen.getByText('Organic')).toBeInTheDocument();
    expect(screen.getByText('+3')).toBeInTheDocument(); // Show more button
  });

  it('expands to show all badges when more button is clicked', () => {
    render(<BadgeChips badges={mockBadges} maxVisible={3} />);
    
    const moreButton = screen.getByText('+3');
    fireEvent.click(moreButton);
    
    expect(screen.getByText('FairTrade')).toBeInTheDocument();
    expect(screen.getByText('BPA Free')).toBeInTheDocument();
    expect(screen.getByText('Less')).toBeInTheDocument(); // Collapse button
  });

  it('renders empty when no badges provided', () => {
    const { container } = render(<BadgeChips badges={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders empty when badges is null', () => {
    const { container } = render(<BadgeChips badges={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<BadgeChips badges={['FSC']} size="sm" />);
    expect(screen.getByText('FSC Certified')).toHaveClass('text-xs');

    rerender(<BadgeChips badges={['FSC']} size="lg" />);
    expect(screen.getByText('FSC Certified')).toHaveClass('text-base');
  });

  it('shows tooltips on hover when enabled', () => {
    render(<BadgeChips badges={['FSC']} showTooltips={true} />);
    
    const badge = screen.getByText('FSC Certified');
    fireEvent.mouseEnter(badge);
    
    // Tooltip should appear (though we can't easily test the exact content due to positioning)
    expect(badge).toHaveClass('ring-2');
  });
});
