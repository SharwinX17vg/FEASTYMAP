import React from 'react';
import type { Category } from '@/lib/mockData';
import { CATEGORY_CONFIG } from '@/lib/mockData';

interface BadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'md' }: BadgeProps) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-2.5 py-1 text-xs'
      } ${cfg.color} ${cfg.bgColor}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: cfg.dotColor }}
      />
      {cfg.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'open' | 'closed' | 'live' | 'upcoming' | 'expired' | 'pending' | 'confirmed' | 'declined';
}

const STATUS_MAP = {
  open: { label: 'Open Now', className: 'bg-positive-bg text-positive' },
  closed: { label: 'Closed', className: 'bg-negative-bg text-negative' },
  live: { label: 'Live', className: 'bg-positive-bg text-positive' },
  upcoming: { label: 'Upcoming', className: 'bg-info-bg text-info' },
  expired: { label: 'Expired', className: 'bg-muted text-muted-foreground' },
  pending: { label: 'Pending', className: 'bg-warning-bg text-warning' },
  confirmed: { label: 'Confirmed', className: 'bg-positive-bg text-positive' },
  declined: { label: 'Declined', className: 'bg-negative-bg text-negative' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_MAP[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {(status === 'open' || status === 'live') && (
        <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse-soft" />
      )}
      {cfg.label}
    </span>
  );
}

interface PriceBadgeProps {
  priceRange: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
}

export function PriceBadge({ priceRange }: PriceBadgeProps) {
  return (
    <span className="font-mono-data text-xs text-muted-foreground font-medium tracking-wider">
      {priceRange}
    </span>
  );
}