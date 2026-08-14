import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, reviewCount, size = 'md' }: StarRatingProps) {
  const starSize = size === 'sm' ? 12 : 14;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={`star-${i}`}
            size={starSize}
            className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-border fill-border'}
          />
        ))}
      </div>
      <span className={`font-mono-data font-semibold text-foreground ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className={`text-muted-foreground ${size === 'sm' ? 'text-2xs' : 'text-xs'}`}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}