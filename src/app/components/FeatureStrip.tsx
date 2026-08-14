'use client';
import React from 'react';
import { MapPin, Sparkles, Tag, Calendar, Users, Zap } from 'lucide-react';

const FEATURES = [
  {
    id: 'feat-map',
    icon: MapPin,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Time-Smart Map',
    description:
      'Pins shift by time of day — breakfast spots at 8 AM, live music at 8 PM. Always relevant, never stale.',
    span: 'lg:col-span-2',
    accent: 'from-primary/5 to-primary/10',
  },
  {
    id: 'feat-planner',
    icon: Sparkles,
    color: 'text-accent',
    bg: 'bg-accent/10',
    title: 'Smart Outing Planner',
    description:
      'Input your group size, budget, and vibe. Get a full multi-stop itinerary with cost breakdown in seconds.',
    span: 'lg:col-span-1',
    accent: 'from-accent/5 to-accent/10',
  },
  {
    id: 'feat-offers',
    icon: Tag,
    color: 'text-amber-600',
    bg: 'bg-amber-100 dark:bg-amber-900/20',
    title: 'Live Offers',
    description:
      'Real-time deals from local businesses — happy hours, weekend specials, and flash discounts aggregated in one feed.',
    span: 'lg:col-span-1',
    accent: 'from-amber-50 to-amber-100/50 dark:from-amber-900/10 dark:to-amber-900/20',
  },
  {
    id: 'feat-events',
    icon: Calendar,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100 dark:bg-indigo-900/20',
    title: 'Events Feed',
    description:
      'Jazz nights, food festivals, art exhibitions, guided walks — all upcoming events near you in one place.',
    span: 'lg:col-span-1',
    accent: 'from-indigo-50 to-indigo-100/50 dark:from-indigo-900/10 dark:to-indigo-900/20',
  },
  {
    id: 'feat-group',
    icon: Users,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/20',
    title: 'Group Mode',
    description:
      'Planning with friends? Everyone submits their preferences — the planner reconciles them into one itinerary everyone likes.',
    span: 'lg:col-span-1',
    accent: 'from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-900/20',
  },
  {
    id: 'feat-gems',
    icon: Zap,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    title: 'Hidden Gems',
    description:
      'Curated section of lesser-known local spots — the places locals love that never make it to travel blogs.',
    span: 'lg:col-span-2',
    accent: 'from-purple-50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-900/20',
  },
];

export default function FeatureStrip() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Why FEASTYmap
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Everything you need for a perfect outing
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            No more switching between 5 apps. FEASTYmap brings your city&apos;s best into one smart, beautiful experience.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES?.map((feat) => (
            <div
              key={feat?.id}
              className={`bg-gradient-to-br ${feat?.accent} border border-border rounded-2xl p-7 card-hover group relative overflow-hidden ${feat?.span}`}
            >
              {/* Decorative circle */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-current" />

              <div className={`w-12 h-12 rounded-xl ${feat?.bg} flex items-center justify-center mb-5 shadow-sm`}>
                <feat.icon size={22} className={feat?.color} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2.5">{feat?.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}