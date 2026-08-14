'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { CategoryBadge, StatusBadge, PriceBadge } from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import { TrendingUp, Tag, MapPin, Clock } from 'lucide-react';
import type { Place } from '@/lib/mockData';

interface PlaceCardProps {
  place: Place;
  compact?: boolean;
}

export default function PlaceCard({ place, compact = false }: PlaceCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden card-hover group">
      {/* Image */}
      <div className={`relative overflow-hidden ${compact ? 'h-36' : 'h-48'}`}>
        <AppImage
          src={place.image}
          alt={place.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
          <CategoryBadge category={place.category} size="sm" />
          {place.trendingScore >= 85 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-primary text-primary-foreground">
              <TrendingUp size={10} />
              Trending
            </span>
          )}
        </div>
        {place.hasOffer && place.offerLabel && (
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-accent text-accent-foreground">
              <Tag size={10} />
              {place.offerLabel}
            </span>
          </div>
        )}
        {place.isHiddenGem && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-foreground/80 text-background">
              💎 Hidden Gem
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className={`font-semibold text-foreground leading-tight line-clamp-1 ${compact ? 'text-sm' : 'text-base'}`}>
            {place.name}
          </h3>
          <PriceBadge priceRange={place.priceRange} />
        </div>

        <div className="flex items-center gap-1 text-muted-foreground mb-2">
          <MapPin size={11} />
          <span className="text-xs truncate">{place.area}</span>
        </div>

        <StarRating rating={place.rating} reviewCount={place.reviewCount} size="sm" />

        {!compact && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock size={11} />
              <span className="text-xs">{place.openHours}</span>
            </div>
            <StatusBadge status={place.isOpenNow ? 'open' : 'closed'} />
          </div>
        )}

        {!compact && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Avg for 2:{' '}
              <span className="font-mono-data font-semibold text-foreground">
                ₹{place.avgCostForTwo.toLocaleString()}
              </span>
            </span>
            <Link
              href={`/interactive-map?place=${place.id}`}
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View Details →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}