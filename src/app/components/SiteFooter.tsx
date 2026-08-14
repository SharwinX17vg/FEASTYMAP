import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function SiteFooter() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AppLogo size={32} />
              <span className="font-bold text-lg text-foreground">
                FEASTY<span className="text-primary">map</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Smart city exploration and outing planning for Chennai's urban explorers.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/interactive-map', label: 'Interactive Map' },
                { href: '/outing-planner', label: 'Outing Planner' },
              ]?.map((l) => (
                <li key={`footer-${l?.href}`}>
                  <Link href={l?.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2">
              {['Trending Spots', 'Live Offers', 'Upcoming Events', 'Hidden Gems']?.map((item) => (
                <li key={`footer-disc-${item}`}>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* City */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Areas Covered</h4>
            <div className="flex flex-wrap gap-2">
              {['Nungambakkam', 'T. Nagar', 'Velachery', 'Alwarpet', 'Teynampet', 'Anna Nagar', 'Adyar', 'Mylapore']?.map((area) => (
                <span
                  key={`footer-area-${area}`}
                  className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-2xs font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 FEASTYmap. Built for Chennai explorers.
          </p>
          <p className="text-xs text-muted-foreground">
            All places, offers, and events are mock data for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}