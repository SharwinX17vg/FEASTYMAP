'use client';
import React from 'react';
import {
  IndianRupee, Trash2, AlertTriangle, CheckCircle2,
  RefreshCw, MapPin, Sparkles,
} from 'lucide-react';
import type { ItineraryStop } from './plannerTypes';

interface BudgetTrackerProps {
  stops: ItineraryStop[];
  budget: number;
  onRemoveStop: (stopId: string) => void;
  onSwapStop: (stopId: string) => void;
}

export default function BudgetTracker({ stops, budget, onRemoveStop, onSwapStop }: BudgetTrackerProps) {
  const totalCost = stops.reduce((sum, s) => sum + s.estimatedCost + s.travelCost, 0);
  const remaining = budget - totalCost;
  const isOverBudget = remaining < 0;
  const pct = Math.min(Math.round((totalCost / budget) * 100), 100);

  const barColor = isOverBudget
    ? 'bg-red-500'
    : pct > 85
    ? 'bg-amber-500' :'bg-emerald-500';

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <IndianRupee size={15} className="text-primary" />
            Budget Tracker
          </h3>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              isOverBudget
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            }`}>
              {isOverBudget ? `₹${Math.abs(remaining).toLocaleString()} over` : `₹${remaining.toLocaleString()} left`}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-2xs text-muted-foreground">
            ₹{totalCost.toLocaleString()} spent
          </span>
          <span className="text-2xs text-muted-foreground">
            Budget: ₹{budget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Stop list */}
      <div className="divide-y divide-border">
        {stops.map((stop) => {
          const stopTotal = stop.estimatedCost + stop.travelCost;
          const isStopOverBudget = isOverBudget && stop.estimatedCost > remaining + stop.estimatedCost;

          return (
            <div
              key={stop.id}
              className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                isStopOverBudget ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-muted/30'
              }`}
            >
              {/* Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isStopOverBudget
                  ? 'bg-red-100 dark:bg-red-900/30' :'bg-primary/10'
              }`}>
                <MapPin size={13} className={isStopOverBudget ? 'text-red-500' : 'text-primary'} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-foreground truncate">{stop.placeName}</p>
                  {isStopOverBudget && (
                    <AlertTriangle size={11} className="text-red-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-2xs text-muted-foreground">{stop.area} · {stop.costCategory}</p>
                {isStopOverBudget && (
                  <p className="text-2xs text-red-500 font-medium mt-0.5">
                    Optional — exceeds budget
                  </p>
                )}
              </div>

              {/* Cost */}
              <span className={`font-mono-data text-xs font-bold flex-shrink-0 ${
                isStopOverBudget ? 'text-red-500' : 'text-foreground'
              }`}>
                ₹{stopTotal.toLocaleString()}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onSwapStop(stop.id)}
                  title="Swap for a similar cheaper option"
                  className="w-7 h-7 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center text-muted-foreground transition-colors"
                >
                  <RefreshCw size={11} />
                </button>
                <button
                  onClick={() => onRemoveStop(stop.id)}
                  title="Remove from plan"
                  className="w-7 h-7 rounded-lg bg-muted hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 flex items-center justify-center text-muted-foreground transition-colors"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className={`px-5 py-3 border-t border-border flex items-center justify-between ${
        isOverBudget ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-emerald-50/50 dark:bg-emerald-900/10'
      }`}>
        <div className="flex items-center gap-1.5">
          {isOverBudget ? (
            <AlertTriangle size={13} className="text-red-500" />
          ) : (
            <CheckCircle2 size={13} className="text-emerald-500" />
          )}
          <span className={`text-xs font-semibold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {isOverBudget
              ? 'Remove or swap over-budget stops to stay on track' :'Great! Your plan fits within budget'}
          </span>
        </div>
        {isOverBudget && (
          <span className="text-2xs text-muted-foreground flex items-center gap-1">
            <Sparkles size={10} />
            Tap swap for alternatives
          </span>
        )}
      </div>
    </div>
  );
}
