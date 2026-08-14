'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { CategoryBadge, StatusBadge, PriceBadge } from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import {
  X, MapPin, Clock, Car, Users, Accessibility, Route,
  Tag, Star, ChevronRight,
} from 'lucide-react';
import type { Place } from '@/lib/mockData';

interface PlaceDetailPopupProps {
  place: Place;
  onClose: () => void;
}

export default function PlaceDetailPopup({ place, onClose }: PlaceDetailPopupProps) {
  return (
    <div className="absolute bottom-4 right-4 z-20 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
      {/* Image header */}
      <div className="relative h-40">
        <AppImage
          src={place.image}
          alt={place.imageAlt}
          fill
          sizes="320px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          aria-label="Close popup"
        >
          <X size={14} />
        </button>
        <div className="absolute bottom-3 left-3 right-8">
          <h3 className="text-base font-bold text-white leading-tight">{place.name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <CategoryBadge category={place.category} size="sm" />
            <StatusBadge status={place.isOpenNow ? 'open' : 'closed'} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Rating + price */}
        <div className="flex items-center justify-between">
          <StarRating rating={place.rating} reviewCount={place.reviewCount} size="sm" />
          <PriceBadge priceRange={place.priceRange} />
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin size={13} className="mt-0.5 flex-shrink-0" />
          <span className="text-xs leading-snug">{place.address}, {place.area}</span>
        </div>

        {/* Hours */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={13} />
          <span className="text-xs">{place.openHours}</span>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 text-xs font-medium ${place.parkingAvailable ? 'text-positive' : 'text-muted-foreground'}`}>
            <Car size={12} />
            <span>{place.parkingAvailable ? 'Parking' : 'No Parking'}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${place.familyFriendly ? 'text-positive' : 'text-muted-foreground'}`}>
            <Users size={12} />
            <span>{place.familyFriendly ? 'Family OK' : 'Adults only'}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${place.wheelchairAccessible ? 'text-positive' : 'text-muted-foreground'}`}>
            <Accessibility size={12} />
            <span>{place.wheelchairAccessible ? 'Accessible' : 'Limited'}</span>
          </div>
        </div>

        {/* Offer */}
        {place.hasOffer && place.offerLabel && (
          <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-lg px-3 py-2">
            <Tag size={13} className="text-accent" />
            <span className="text-xs font-semibold text-accent">{place.offerLabel}</span>
          </div>
        )}

        {/* Signature item */}
        {place.signatureItem && (
          <div className="flex items-center gap-2">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-xs text-muted-foreground">
              Signature: <span className="font-semibold text-foreground">{place.signatureItem}</span>
            </span>
          </div>
        )}

        {/* Cost */}
        <div className="text-xs text-muted-foreground">
          Avg cost for 2:{' '}
          <span className="font-mono-data font-bold text-foreground text-sm">
            ₹{place.avgCostForTwo.toLocaleString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link
            href="/outing-planner"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Route size={13} />
            Add to Outing
          </Link>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-muted text-foreground rounded-lg text-xs font-semibold hover:bg-muted/70 active:scale-95 transition-all">
            Full Details
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}