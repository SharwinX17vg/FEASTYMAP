'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Route, MapPin, Sparkles, ChevronRight, TrendingUp } from 'lucide-react';

const TIME_GREETINGS: Record<string, { greeting: string; emoji: string; subtitle: string }> = {
  morning: {
    greeting: 'Good morning, explorer',
    emoji: '🌅',
    subtitle: 'Start your day right — find the best breakfast spots and morning walks near you.',
  },
  afternoon: {
    greeting: 'Good afternoon, explorer',
    emoji: '☀️',
    subtitle: 'Afternoon plans sorted — discover trending cafés, malls, and local gems.',
  },
  evening: {
    greeting: 'Good evening, explorer',
    emoji: '🌆',
    subtitle: 'The city comes alive tonight — plan your perfect evening outing.',
  },
  night: {
    greeting: 'Good night, explorer',
    emoji: '🌙',
    subtitle: 'Night owls welcome — find live music, late-night bites, and more.',
  },
};

const STAT_ITEMS = [
  { value: '2,400+', label: 'Places Listed' },
  { value: '18 Areas', label: 'Across Chennai' },
  { value: '340+', label: 'Live Offers' },
  { value: '4.8★', label: 'Avg Rating' },
];

const FLOATING_TAGS = [
  { label: 'Live Jazz Tonight', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', x: '8%', y: '28%' },
  { label: '₹500 off at Phoenix', color: 'bg-accent/10 text-accent', x: '72%', y: '18%' },
  { label: '🌅 Rooftop Sunrise Café', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', x: '80%', y: '62%' },
  { label: 'Hidden Gem 💎', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', x: '5%', y: '68%' },
];

export default function HeroSection() {
  const [timeSlot, setTimeSlot] = useState<string>('evening');

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 6 && h < 12) setTimeSlot('morning');
    else if (h >= 12 && h < 17) setTimeSlot('afternoon');
    else if (h >= 17 && h < 21) setTimeSlot('evening');
    else setTimeSlot('night');
  }, []);

  const greet = TIME_GREETINGS[timeSlot];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden gradient-hero pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-[15%] w-80 h-80 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute top-[40%] left-[40%] w-60 h-60 rounded-full bg-amber-300/10 blur-2xl" />
      </div>

      {/* Floating tags — decorative */}
      {FLOATING_TAGS.map((tag) => (
        <div
          key={`float-${tag.label}`}
          className={`absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-white/30 ${tag.color}`}
          style={{ left: tag.x, top: tag.y }}
        >
          {tag.label}
        </div>
      ))}

      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 py-20">
        <div className="max-w-3xl">
          {/* Time greeting chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-lg leading-none">{greet.emoji}</span>
            <span className="text-sm font-semibold text-primary">{greet.greeting}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.08] tracking-tight mb-6 text-balance">
            One app to plan
            <br />
            <span className="text-primary">every outing.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
            {greet.subtitle}
            {' '}Stop switching between Maps, Instagram, and food apps — FEASTYmap has it all.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            <Link
              href="/outing-planner"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl text-base font-bold hover:bg-primary/90 active:scale-95 transition-all duration-150"
            >
              <Route size={18} />
              Plan an Outing
              <ChevronRight size={16} />
            </Link>
            <Link
              href="/interactive-map"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-card text-foreground border border-border rounded-xl text-base font-semibold hover:bg-muted active:scale-95 transition-all duration-150"
            >
              <MapPin size={18} />
              Explore Map
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            {STAT_ITEMS.map((stat) => (
              <div key={`stat-${stat.label}`} className="flex flex-col">
                <span className="font-mono-data text-2xl font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side — trending mini cards */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 pr-8 2xl:pr-16 w-72">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Trending Now
            </span>
          </div>
          {[
            { name: 'Murugan Idli Shop', area: 'T. Nagar', score: 97, emoji: '🍽️' },
            { name: 'The Jazz Lounge', area: 'Periamet', score: 91, emoji: '🎷' },
            { name: 'Amara Brew House', area: 'Nungambakkam', score: 94, emoji: '☕' },
            { name: 'Phoenix MarketCity', area: 'Velachery', score: 82, emoji: '🛍️' },
          ].map((item) => (
            <div
              key={`hero-trend-${item.name}`}
              className="bg-card/90 backdrop-blur-sm border border-border rounded-xl px-4 py-3 flex items-center gap-3 card-hover cursor-pointer"
            >
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.area}</p>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles size={11} className="text-primary" />
                <span className="font-mono-data text-xs font-bold text-primary">{item.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <div className="w-0.5 h-6 bg-muted-foreground/40 rounded-full" />
      </div>
    </section>
  );
}