import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/app/components/HeroSection';
import FeatureStrip from '@/app/components/FeatureStrip';
import TrendingSection from '@/app/components/TrendingSection';
import OffersStrip from '@/app/components/OffersStrip';
import EventsSection from '@/app/components/EventsSection';
import LandingFooterCTA from '@/app/components/LandingFooterCTA';
import SiteFooter from '@/app/components/SiteFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureStrip />
        <TrendingSection />
        <OffersStrip />
        <EventsSection />
        <LandingFooterCTA />
      </main>
      <SiteFooter />
    </div>
  );
}