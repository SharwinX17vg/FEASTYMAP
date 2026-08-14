import React from 'react';
import Link from 'next/link';
import { Route, MapPin } from 'lucide-react';

export default function LandingFooterCTA() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-orange-500 to-accent p-12 sm:p-16 text-center">
          {/* BG orbs */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-4">
              🗺️ Your city is waiting
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 text-balance">
              Ready for your next perfect outing?
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
              Tell us your budget, vibe, and group size — we'll build the itinerary in seconds.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/outing-planner"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary rounded-xl text-base font-bold hover:bg-white/90 active:scale-95 transition-all duration-150 shadow-lg"
              >
                <Route size={18} />
                Plan My Outing
              </Link>
              <Link
                href="/interactive-map"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/15 text-white border border-white/30 rounded-xl text-base font-semibold hover:bg-white/25 active:scale-95 transition-all duration-150"
              >
                <MapPin size={18} />
                Explore Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}