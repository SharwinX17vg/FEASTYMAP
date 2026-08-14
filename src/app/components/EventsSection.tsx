import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { Calendar, Clock, MapPin, Ticket, ArrowRight } from 'lucide-react';
import { EVENTS } from '@/lib/mockData';

export default function EventsSection() {
  return (
    <section className="py-20 bg-secondary/40">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={15} className="text-indigo-600" />
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
                Upcoming Events
              </p>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              What's on this week
            </h2>
          </div>
          <Link
            href="/interactive-map"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            All events
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
          {EVENTS?.map((event) => (
            <div
              key={event?.id}
              className="bg-card border border-border rounded-xl overflow-hidden card-hover group"
            >
              <div className="relative h-40 overflow-hidden">
                <AppImage
                  src={event?.image}
                  alt={event?.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-block px-2 py-0.5 rounded-full text-2xs font-semibold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                    {event?.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-3">
                  {event?.title}
                </h3>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar size={11} />
                    <span className="text-xs">{event?.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={11} />
                    <span className="text-xs">{event?.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin size={11} />
                    <span className="text-xs">{event?.area}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-foreground">
                    <Ticket size={12} className="text-primary" />
                    <span className="font-mono-data text-sm font-semibold">
                      {event?.ticketPrice === 0 ? (
                        <span className="text-positive">Free Entry</span>
                      ) : (
                        `₹${event?.ticketPrice}`
                      )}
                    </span>
                  </div>
                  <Link
                    href="/outing-planner"
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Add to plan →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}