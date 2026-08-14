'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { toast } from 'sonner';
import {
  Route, RefreshCw, Share2, Download, MapPin, Clock,
  IndianRupee, Tag, Star, CheckCircle2, AlertTriangle,
  Calendar, Car, Sparkles, RefreshCcw,
} from 'lucide-react';
import type { GeneratedItinerary, PlannerFormData, ItineraryStop } from './plannerTypes';
import CostBreakdownChart from './CostBreakdownChart';
import BudgetTracker from './BudgetTracker';
import ItineraryChatbot from './ItineraryChatbot';
import { PLACES } from '@/lib/mockData';

interface Props {
  itinerary: GeneratedItinerary;
  formData: PlannerFormData;
  onReset: () => void;
}

const COST_CAT_COLORS: Record<string, string> = {
  food: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  transport: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  entertainment: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  shopping: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const TRANSPORT_EMOJI: Record<string, string> = {
  walk: '🚶', auto: '🛺', cab: '🚕', bike: '🏍️', own_vehicle: '🚗',
};

// Find a swap alternative for a stop
function findAlternative(stop: ItineraryStop, currentStopIds: string[]): ItineraryStop | null {
  const alternatives = PLACES.filter(
    (p) =>
      p.category === stop.category &&
      p.id !== stop.placeId &&
      !currentStopIds.includes(p.id) &&
      p.isOpenNow &&
      p.avgCostForTwo <= stop.estimatedCost * 2,
  );
  if (alternatives.length === 0) return null;
  const alt = alternatives[0];
  return {
    ...stop,
    id: `stop-${alt.id}-swap`,
    placeId: alt.id,
    placeName: alt.name,
    area: alt.area,
    estimatedCost: Math.round(alt.avgCostForTwo * 0.5),
    rating: alt.rating,
    image: alt.image,
    imageAlt: alt.imageAlt,
    openHours: alt.openHours,
    isOpenNow: alt.isOpenNow,
    hasOffer: alt.hasOffer,
    offerLabel: alt.offerLabel,
    notes: `Swapped alternative — similar vibe, nearby area.`,
    reservationAvailable: alt.category === 'restaurant' || alt.category === 'bar' || alt.category === 'cafe',
  };
}

export default function PlannerItinerary({ itinerary, formData, onReset }: Props) {
  const [stops, setStops] = useState<ItineraryStop[]>(itinerary.stops);

  // Recalculate totals from current stops
  const foodTotal = stops.filter((s) => s.costCategory === 'food').reduce((a, s) => a + s.estimatedCost, 0);
  const shoppingTotal = stops.filter((s) => s.costCategory === 'shopping').reduce((a, s) => a + s.estimatedCost, 0);
  const entertainmentTotal = stops.filter((s) => s.costCategory === 'entertainment').reduce((a, s) => a + s.estimatedCost, 0);
  const transportTotal = itinerary.costBreakdown.transport;
  const liveTotal = foodTotal + shoppingTotal + entertainmentTotal + transportTotal;
  const liveSurplus = itinerary.budget - liveTotal;
  const isOverBudget = liveSurplus < 0;
  const coveragePercent = Math.min(Math.round((liveTotal / itinerary.budget) * 100), 100);

  const liveItinerary: GeneratedItinerary = {
    ...itinerary,
    stops,
    costBreakdown: { food: foodTotal, shopping: shoppingTotal, entertainment: entertainmentTotal, transport: transportTotal, total: liveTotal },
    surplus: liveSurplus,
    coveragePercent,
  };

  const handleRemoveStop = (stopId: string) => {
    const stop = stops.find((s) => s.id === stopId);
    setStops((prev) => prev.filter((s) => s.id !== stopId));
    toast.success(`Removed ${stop?.placeName ?? 'stop'} from your plan`);
  };

  const handleSwapStop = (stopId: string) => {
    const stop = stops.find((s) => s.id === stopId);
    if (!stop) return;
    const currentIds = stops.map((s) => s.placeId);
    const alt = findAlternative(stop, currentIds);
    if (!alt) {
      toast.info(`No alternative found for ${stop.placeName} right now.`);
      return;
    }
    setStops((prev) => prev.map((s) => (s.id === stopId ? alt : s)));
    toast.success(`Swapped ${stop.placeName} → ${alt.placeName}`, {
      description: `Similar spot in ${alt.area} — ₹${alt.estimatedCost.toLocaleString()} est.`,
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(`Check out my FEASTYmap outing plan: ${itinerary.title}`);
    toast.success('Itinerary link copied to clipboard!');
  };

  const handleReservation = (stopName: string) => {
    toast.success(`Reservation request sent for ${stopName}`, {
      description: 'You\'ll receive a confirmation within 15 minutes.',
    });
  };

  // Build cumulative time display
  const [startH, startPeriod] = itinerary.startTime.split(' ');
  const [startHour, startMin] = startH.split(':').map(Number);
  let runningMinutes = startHour * 60 + startMin + (startPeriod === 'PM' && startHour !== 12 ? 720 : 0);

  return (
    <div className="space-y-8">
      {/* Itinerary header */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Route size={16} className="text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Your Itinerary
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">{itinerary.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {itinerary.startTime} → {itinerary.endTime}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                {stops.length} stops
              </span>
              <span className="flex items-center gap-1.5">
                {TRANSPORT_EMOJI[formData.transportMethod]}
                {formData.transportMethod === 'walk' ? 'Walking' :
                 formData.transportMethod === 'auto' ? 'Auto' :
                 formData.transportMethod === 'cab' ? 'Cab/Ola' :
                 formData.transportMethod === 'bike' ? 'Bike' : 'Own Car'}
              </span>
              <span className="flex items-center gap-1.5">
                <Route size={13} />
                {Math.round(itinerary.totalDuration / 60)}h {itinerary.totalDuration % 60}m total
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 bg-muted text-foreground rounded-lg text-xs font-semibold hover:bg-muted/70 active:scale-95 transition-all"
            >
              <Share2 size={13} />
              Share
            </button>
            <button
              onClick={() => toast.info('PDF download coming soon!')}
              className="flex items-center gap-1.5 px-3 py-2 bg-muted text-foreground rounded-lg text-xs font-semibold hover:bg-muted/70 active:scale-95 transition-all"
            >
              <Download size={13} />
              Save PDF
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 bg-muted text-foreground rounded-lg text-xs font-semibold hover:bg-muted/70 active:scale-95 transition-all"
            >
              <RefreshCw size={13} />
              Replan
            </button>
          </div>
        </div>

        {/* Budget indicator */}
        <div className="mt-5 p-4 rounded-xl border border-border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <IndianRupee size={14} />
              Budget Utilisation
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono-data text-sm font-bold text-foreground">
                ₹{liveTotal.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-sm">/</span>
              <span className="font-mono-data text-sm text-muted-foreground">
                ₹{itinerary.budget.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full budget-bar-fill ${
                isOverBudget ? 'bg-negative' : coveragePercent > 85 ? 'bg-warning' : 'bg-positive'
              }`}
              style={{ width: `${Math.min(coveragePercent, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {coveragePercent}% of budget used
            </span>
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${
              isOverBudget ? 'text-negative' : 'text-positive'
            }`}>
              {isOverBudget ? (
                <>
                  <AlertTriangle size={12} />
                  ₹{Math.abs(liveSurplus).toLocaleString()} over budget
                </>
              ) : (
                <>
                  <CheckCircle2 size={12} />
                  ₹{liveSurplus.toLocaleString()} remaining
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Tracker */}
      <BudgetTracker
        stops={stops}
        budget={itinerary.budget}
        onRemoveStop={handleRemoveStop}
        onSwapStop={handleSwapStop}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-8">
        {/* Itinerary stops — left 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            Your Route
          </h3>

          {stops.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-sm text-muted-foreground mb-3">All stops removed. Replan to start fresh!</p>
              <button
                onClick={onReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all"
              >
                <RefreshCcw size={14} />
                Replan
              </button>
            </div>
          )}

          {stops.map((stop, idx) => {
            if (idx > 0) {
              runningMinutes += stops[idx - 1].duration + stop.travelTimeFromPrev;
            }
            const arrH = Math.floor(runningMinutes / 60) % 24;
            const arrM = runningMinutes % 60;
            const arrTime = `${arrH % 12 === 0 ? 12 : arrH % 12}:${arrM.toString().padStart(2, '0')} ${arrH < 12 ? 'AM' : 'PM'}`;
            const isStopOptional = isOverBudget && stop.estimatedCost > 200;

            return (
              <div key={stop.id} className="relative">
                {/* Timeline connector */}
                {idx < stops.length - 1 && (
                  <div className="absolute left-5 top-[72px] bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-accent/20 z-0" />
                )}

                {/* Travel time badge */}
                {idx > 0 && stop.travelTimeFromPrev > 0 && (
                  <div className="flex items-center gap-2 mb-2 ml-10 pl-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                      <Car size={10} />
                      {stop.travelTimeFromPrev} min travel
                      {stop.travelCost > 0 && (
                        <span className="font-mono-data font-semibold text-foreground">
                          · ₹{stop.travelCost}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex gap-4">
                  {/* Step number */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center shadow-md ${
                      isStopOptional
                        ? 'bg-amber-500 text-white shadow-amber-500/25'
                        : 'bg-primary text-primary-foreground shadow-primary/25'
                    }`}>
                      {idx + 1}
                    </div>
                  </div>

                  {/* Stop card */}
                  <div className={`flex-1 bg-card border rounded-xl overflow-hidden transition-colors ${
                    isStopOptional ? 'border-amber-300 dark:border-amber-700' : 'border-border'
                  }`}>
                    {/* Optional banner */}
                    {isStopOptional && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
                        <AlertTriangle size={12} className="text-amber-600" />
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                          Optional stop — over budget. Swap for a cheaper alternative or remove.
                        </span>
                        <div className="ml-auto flex items-center gap-1">
                          <button
                            onClick={() => handleSwapStop(stop.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-md text-2xs font-semibold hover:bg-amber-200 transition-colors"
                          >
                            <RefreshCw size={9} />
                            Swap
                          </button>
                          <button
                            onClick={() => handleRemoveStop(stop.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-2xs font-semibold hover:bg-red-200 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-0">
                      {/* Image */}
                      <div className="relative w-24 sm:w-32 flex-shrink-0">
                        <AppImage
                          src={stop.image}
                          alt={stop.imageAlt}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <p className="text-sm font-bold text-foreground leading-tight">{stop.placeName}</p>
                            <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                              <MapPin size={10} />
                              <span className="text-xs">{stop.area}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold flex-shrink-0 ${COST_CAT_COLORS[stop.costCategory]}`}>
                            {stop.costCategory}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-2 mb-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={10} />
                            <span>{arrTime}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={10} />
                            <span>{stop.duration} min stay</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={10} className="text-amber-400 fill-amber-400" />
                            <span className="font-mono-data text-xs font-semibold text-foreground">{stop.rating}</span>
                          </div>
                        </div>

                        {/* Notes */}
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{stop.notes}</p>

                        {/* Offer */}
                        {stop.hasOffer && stop.offerLabel && (
                          <div className="flex items-center gap-1.5 mb-3">
                            <Tag size={11} className="text-accent" />
                            <span className="text-xs font-semibold text-accent">{stop.offerLabel}</span>
                          </div>
                        )}

                        {/* Cost + Reservation */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <IndianRupee size={12} className="text-muted-foreground" />
                            <span className="font-mono-data text-sm font-bold text-foreground">
                              {stop.estimatedCost.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">est.</span>
                          </div>
                          {stop.reservationAvailable && (
                            <button
                              onClick={() => handleReservation(stop.placeName)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 active:scale-95 transition-all"
                            >
                              <Calendar size={11} />
                              Reserve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* End marker */}
          {stops.length > 0 && (
            <div className="flex items-center gap-4 pl-2">
              <div className="w-6 h-6 rounded-full bg-positive/20 border-2 border-positive flex items-center justify-center">
                <CheckCircle2 size={12} className="text-positive" />
              </div>
              <p className="text-sm font-semibold text-positive">
                Back by {itinerary.endTime} ✓
              </p>
            </div>
          )}
        </div>

        {/* Cost breakdown — right 1/3 */}
        <div className="space-y-5">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <IndianRupee size={16} className="text-primary" />
            Cost Breakdown
          </h3>

          {/* Chart */}
          <div className="bg-card border border-border rounded-xl p-5">
            <CostBreakdownChart breakdown={liveItinerary.costBreakdown} budget={itinerary.budget} />
          </div>

          {/* Category table */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            {(
              [
                { key: 'food', label: 'Food & Drinks', emoji: '🍽️' },
                { key: 'transport', label: 'Transport', emoji: '🚗' },
                { key: 'entertainment', label: 'Entertainment', emoji: '🎷' },
                { key: 'shopping', label: 'Shopping', emoji: '🛍️' },
              ] as const
            ).map((cat) => {
              const amount = liveItinerary.costBreakdown[cat.key];
              const pct = liveItinerary.costBreakdown.total > 0
                ? Math.round((amount / liveItinerary.costBreakdown.total) * 100)
                : 0;
              return (
                <div key={`cost-row-${cat.key}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <span>{cat.emoji}</span>
                      {cat.label}
                    </span>
                    <span className="font-mono-data text-sm font-bold text-foreground">
                      ₹{amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/60 budget-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-2xs text-muted-foreground mt-0.5 text-right">{pct}% of spend</p>
                </div>
              );
            })}

            <div className="border-t border-border pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">Total</span>
                <span className="font-mono-data text-lg font-extrabold text-foreground">
                  ₹{liveItinerary.costBreakdown.total.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">Budget</span>
                <span className="font-mono-data text-sm text-muted-foreground">
                  ₹{itinerary.budget.toLocaleString()}
                </span>
              </div>
              <div className={`flex items-center justify-between mt-1 ${
                isOverBudget ? 'text-negative' : 'text-positive'
              }`}>
                <span className="text-xs font-semibold">
                  {isOverBudget ? 'Over by' : 'Remaining'}
                </span>
                <span className="font-mono-data text-sm font-bold">
                  ₹{Math.abs(liveSurplus).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Per person split */}
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Per Person Split
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                {formData.groupSize} {formData.groupSize === 1 ? 'person' : 'people'}
              </span>
              <span className="font-mono-data text-xl font-extrabold text-foreground">
                ₹{Math.round(liveItinerary.costBreakdown.total / formData.groupSize).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">each</p>
          </div>

          {/* AI Assistant hint */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <Sparkles size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Need help planning?</p>
              <p className="text-2xs text-muted-foreground">
                Tap the chat button (bottom-right) to ask your outing assistant about budget, stops, offers, or alternatives.
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/interactive-map"
            className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/25"
          >
            <MapPin size={15} />
            View on Map
          </Link>
        </div>
      </div>

      {/* Chatbot */}
      <ItineraryChatbot
        itinerary={liveItinerary}
        formData={formData}
        onRemoveStop={handleRemoveStop}
      />
    </div>
  );
}