import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { Tag, Clock, ArrowRight } from 'lucide-react';
import { OFFERS } from '@/lib/mockData';
import { CategoryBadge } from '@/components/ui/Badge';

export default function OffersStrip() {
  return (
    <section id="offers" className="py-20 bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag size={15} className="text-accent" />
              <p className="text-xs font-semibold text-accent uppercase tracking-widest">
                Live Offers
              </p>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Deals happening right now
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Offers expire fast — grab them before they're gone.
            </p>
          </div>
          <Link
            href="/interactive-map"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            View all offers
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Offers grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-5">
          {OFFERS?.map((offer) => (
            <div
              key={offer?.id}
              className="bg-card border border-border rounded-xl overflow-hidden card-hover group"
            >
              <div className="relative h-36 overflow-hidden">
                <AppImage
                  src={offer?.image}
                  alt={offer?.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow">
                    {offer?.discount}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <CategoryBadge category={offer?.category} size="sm" />
                <h3 className="mt-2 text-sm font-semibold text-foreground line-clamp-1">
                  {offer?.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {offer?.description}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-muted-foreground">
                  <Clock size={11} />
                  <span className="text-2xs font-medium">Valid: {offer?.validUntil}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-accent">{offer?.placeName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}