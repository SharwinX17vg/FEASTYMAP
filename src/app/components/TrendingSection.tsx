import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { getTrendingPlaces } from '@/lib/mockData';
import PlaceCard from '@/components/ui/PlaceCard';

export default function TrendingSection() {
  const places = getTrendingPlaces(6);

  return (
    <section className="py-20 bg-secondary/40">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-primary" />
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">
                Trending Now
              </p>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              What the city is loving
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Ranked by visits, saves, and community ratings — updated hourly.
            </p>
          </div>
          <Link
            href="/interactive-map"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            See all on map
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-5">
          {places?.map((place) => (
            <PlaceCard key={place?.id} place={place} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/interactive-map"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-all"
          >
            See all places on map
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}