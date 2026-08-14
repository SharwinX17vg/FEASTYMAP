'use client';
import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import { CategoryBadge, StatusBadge, PriceBadge } from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import { MapPin, Tag, Clock, IndianRupee, Car, Users, Star, X } from 'lucide-react';
import type { Place } from '@/lib/mockData';

interface PlaceSidebarProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place | null) => void;
}

// Toast card that appears when a pin is clicked
function PlaceToastCard({ place, onClose }: { place: Place; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [place.id, onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up pointer-events-auto">
      {/* Image strip */}
      <div className="relative h-28">
        <AppImage
          src={place.image}
          alt={place.imageAlt}
          fill
          sizes="320px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <X size={12} />
        </button>
        <div className="absolute bottom-2 left-3 right-8">
          <p className="text-sm font-bold text-white leading-tight">{place.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <CategoryBadge category={place.category} size="sm" />
            <StatusBadge status={place.isOpenNow ? 'open' : 'closed'} />
          </div>
        </div>
      </div>

      {/* Quick info */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <StarRating rating={place.rating} reviewCount={place.reviewCount} size="sm" />
          <PriceBadge priceRange={place.priceRange} />
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={11} />
            <span className="truncate">{place.openHours}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <IndianRupee size={11} />
            <span>₹{place.avgCostForTwo.toLocaleString()} for 2</span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-medium ${place.parkingAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
            <Car size={11} />
            <span>{place.parkingAvailable ? 'Parking ✓' : 'No parking'}</span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-medium ${place.familyFriendly ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
            <Users size={11} />
            <span>{place.familyFriendly ? 'Family OK' : 'Adults only'}</span>
          </div>
        </div>

        {place.hasOffer && place.offerLabel && (
          <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-lg px-2.5 py-1.5">
            <Tag size={11} className="text-accent flex-shrink-0" />
            <span className="text-xs font-semibold text-accent">{place.offerLabel}</span>
          </div>
        )}

        {place.signatureItem && (
          <div className="flex items-center gap-1.5">
            <Star size={11} className="text-amber-500 fill-amber-500" />
            <span className="text-xs text-muted-foreground">
              Signature: <span className="font-semibold text-foreground">{place.signatureItem}</span>
            </span>
          </div>
        )}

        {/* Progress bar auto-dismiss */}
        <div className="w-full bg-border rounded-full h-0.5 overflow-hidden mt-1">
          <div className="h-full bg-primary/40 rounded-full animate-[shrink_5s_linear_forwards]" />
        </div>
      </div>
    </div>
  );
}

export default function PlaceSidebar({ places, selectedPlace, onSelectPlace }: PlaceSidebarProps) {
  const [toastPlace, setToastPlace] = useState<Place | null>(null);

  const handleSelectPlace = (place: Place | null) => {
    onSelectPlace(place);
    if (place) {
      setToastPlace(place);
    }
  };

  if (places.length === 0) {
    return (
      <>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <MapPin size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">No places found</p>
          <p className="text-xs text-muted-foreground">
            Try changing the time slot or enabling more categories.
          </p>
        </div>
        {toastPlace && (
          <PlaceToastCard place={toastPlace} onClose={() => setToastPlace(null)} />
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {places.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          return (
            <button
              key={place.id}
              onClick={() => handleSelectPlace(isSelected ? null : place)}
              className={`w-full text-left flex gap-3 p-4 border-b border-border transition-all duration-150 ${
                isSelected
                  ? 'bg-primary/8 border-l-2 border-l-primary' :'hover:bg-muted/50'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <AppImage
                  src={place.image}
                  alt={place.imageAlt}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1 mb-1">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{place.name}</p>
                  <PriceBadge priceRange={place.priceRange} />
                </div>
                <div className="flex items-center gap-1 mb-1.5">
                  <CategoryBadge category={place.category} size="sm" />
                  {place.hasOffer && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-2xs font-medium bg-accent/10 text-accent">
                      <Tag size={8} />
                      Offer
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <StarRating rating={place.rating} size="sm" />
                  <StatusBadge status={place.isOpenNow ? 'open' : 'closed'} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-2xs text-muted-foreground flex items-center gap-0.5">
                    <MapPin size={9} />
                    {place.area}
                  </p>
                  <p className="text-2xs text-muted-foreground font-mono-data">
                    ₹{place.avgCostForTwo.toLocaleString()} for 2
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Toast popup on pin/card click */}
      {toastPlace && (
        <PlaceToastCard place={toastPlace} onClose={() => setToastPlace(null)} />
      )}
    </>
  );
}