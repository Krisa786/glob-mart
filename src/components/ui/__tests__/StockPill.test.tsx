import React from 'react';
import { render, screen } from '@testing-library/react';
import { StockPill } from '../StockPill';

describe('StockPill', () => {
  it('renders in-stock state correctly', () => {
    render(<StockPill state="in" />);
    
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByLabelText('Product is in stock and available for purchase')).toBeInTheDocument();
  });

  it('renders low-stock state correctly', () => {
    render(<StockPill state="low" />);
    
    expect(screen.getByText('Low Stock')).toBeInTheDocument();
    expect(screen.getByLabelText('Product has limited stock remaining')).toBeInTheDocument();
  });

  it('renders out-of-stock state correctly', () => {
    render(<StockPill state="out" />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByLabelText('Product is currently out of stock')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<StockPill state="in" customLabel="Available" />);
    
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('renders without icon when showIcon is false', () => {
    render(<StockPill state="in" showIcon={false} />);
    
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    // Icon should not be present
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<StockPill state="in" size="sm" />);
    expect(screen.getByText('In Stock')).toHaveClass('text-xs');

    rerender(<StockPill state="in" size="lg" />);
    expect(screen.getByText('In Stock')).toHaveClass('text-base');
  });
});
