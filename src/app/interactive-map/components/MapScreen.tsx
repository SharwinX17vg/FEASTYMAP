'use client';
import React, { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PLACES, CATEGORY_CONFIG, TIME_SLOT_CONFIG, getCurrentTimeSlot } from '@/lib/mockData';
import type { Place, Category, TimeSlot } from '@/lib/mockData';
import MapCanvas from './MapCanvas';
import PlaceSidebar from './PlaceSidebar';
import PlaceDetailPopup from './PlaceDetailPopup';

const ALL_CATEGORIES: Category[] = ['cafe', 'restaurant', 'mall', 'park', 'event', 'bar', 'dessert', 'street_food'];

export default function MapScreen() {
  const [activeTimeSlot, setActiveTimeSlot] = useState<TimeSlot>(getCurrentTimeSlot());
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set(ALL_CATEGORIES));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleCategory = useCallback((cat: Category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size === 1) return prev;
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const filteredPlaces = PLACES.filter((p) => {
    const matchesCategory = activeCategories.has(p.category);
    const matchesTime = p.timeSlots.includes(activeTimeSlot);
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTime && matchesSearch;
  });

  // When a place is selected (from map pin OR sidebar), show both the detail popup and the toast
  const handleSelectPlace = useCallback((place: Place | null) => {
    setSelectedPlace(place);
  }, []);

  return (
    <div className="flex h-full relative">
      {/* Sidebar toggle on mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 z-30 bg-card border border-border rounded-r-lg p-2 shadow-md transition-all duration-300 md:hidden"
        style={{ left: sidebarOpen ? '320px' : '0px' }}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Desktop sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 z-30 bg-card border border-border rounded-r-lg p-2 shadow-md transition-all duration-300 hidden md:flex items-center"
        style={{ left: sidebarOpen ? '360px' : '0px' }}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          flex-shrink-0 bg-card border-r border-border flex flex-col
          transition-all duration-300 overflow-hidden
          ${sidebarOpen ? 'w-80 md:w-96' : 'w-0'}
        `}
      >
        <div className="flex flex-col h-full min-w-[320px] md:min-w-[384px]">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search places, areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Time slot filter */}
          <div className="p-4 border-b border-border">
            <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Time of Day
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(TIME_SLOT_CONFIG) as TimeSlot[]).map((slot) => {
                const cfg = TIME_SLOT_CONFIG[slot];
                const isActive = activeTimeSlot === slot;
                return (
                  <button
                    key={`time-${slot}`}
                    onClick={() => setActiveTimeSlot(slot)}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                    }`}
                  >
                    <span className="text-base leading-none">{cfg.emoji}</span>
                    <span className="text-2xs leading-none">{cfg.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-2xs text-muted-foreground mt-2">
              {TIME_SLOT_CONFIG[activeTimeSlot].hours} — showing relevant spots
            </p>
          </div>

          {/* Category filters */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
                Categories
              </p>
              <button
                onClick={() => setActiveCategories(new Set(ALL_CATEGORIES))}
                className="text-2xs text-primary font-medium hover:underline"
              >
                Reset
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_CATEGORIES.map((cat) => {
                const cfg = CATEGORY_CONFIG[cat];
                const isActive = activeCategories.has(cat);
                return (
                  <button
                    key={`cat-${cat}`}
                    onClick={() => toggleCategory(cat)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 border ${
                      isActive
                        ? `${cfg.color} ${cfg.bgColor} border-transparent`
                        : 'text-muted-foreground bg-transparent border-border hover:bg-muted'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isActive ? cfg.dotColor : '#9CA3AF' }}
                    />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count */}
          <div className="px-4 py-2 bg-muted/30 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredPlaces.length}</span> places this{' '}
                {activeTimeSlot}
              </span>
              <SlidersHorizontal size={12} className="text-muted-foreground" />
            </div>
          </div>

          {/* Place list — toast fires from here when a card is clicked */}
          <PlaceSidebar
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={handleSelectPlace}
          />
        </div>
      </div>

      {/* Map canvas */}
      <div className="flex-1 relative">
        <MapCanvas
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onSelectPlace={handleSelectPlace}
          activeTimeSlot={activeTimeSlot}
        />

        {/* Selected place detail popup — right side corner */}
        {selectedPlace && (
          <PlaceDetailPopup place={selectedPlace} onClose={() => setSelectedPlace(null)} />
        )}
      </div>
    </div>
  );
}