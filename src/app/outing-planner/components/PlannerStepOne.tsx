'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Users, IndianRupee, Clock, UtensilsCrossed, Flame,
  Car, AlarmClock, ChevronRight, Loader2, ToggleLeft, ToggleRight,
} from 'lucide-react';
import type { PlannerFormData } from './plannerTypes';

interface Props {
  onSubmit: (data: PlannerFormData) => void;
  isLoading: boolean;
}

const CUISINE_OPTIONS = [
  'Any', 'South Indian', 'North Indian', 'Chinese', 'Continental', 'Mughlai', 'Street Food', 'Mediterranean',
];

const TRANSPORT_OPTIONS = [
  { value: 'walk', label: 'Walk', emoji: '🚶' },
  { value: 'auto', label: 'Auto', emoji: '🛺' },
  { value: 'cab', label: 'Cab/Ola', emoji: '🚕' },
  { value: 'bike', label: 'Bike', emoji: '🏍️' },
  { value: 'own_vehicle', label: 'Own Car', emoji: '🚗' },
];

const FLAVOR_OPTIONS = [
  { value: 'any', label: 'Any', emoji: '🍽️' },
  { value: 'spicy', label: 'Spicy', emoji: '🌶️' },
  { value: 'sweet', label: 'Sweet', emoji: '🍬' },
  { value: 'mild', label: 'Mild', emoji: '🥗' },
];

export default function PlannerStepOne({ onSubmit, isLoading }: Props) {
  const [groupMode, setGroupMode] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Omit<PlannerFormData, 'groupMode' | 'groupMembers'>>({
    defaultValues: {
      groupSize: 2,
      budget: 2000,
      duration: 4,
      cuisine: 'Any',
      flavorPreference: 'any',
      transportMethod: 'auto',
      latestReturnTime: '22:00',
    },
  });

  const selectedTransport = watch('transportMethod');
  const selectedFlavor = watch('flavorPreference');
  const budgetVal = watch('budget');
  const groupSizeVal = watch('groupSize');

  const onFormSubmit = (data: Omit<PlannerFormData, 'groupMode' | 'groupMembers'>) => {
    onSubmit({ ...data, groupMode, groupMembers: [] });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-2xl">
      <div className="space-y-6">
        {/* Group size + Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Group size */}
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Users size={15} className="text-primary" />
              Number of People
            </label>
            <p className="text-xs text-muted-foreground mb-3">How many people in your group?</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setValue('groupSize', Math.max(1, groupSizeVal - 1))}
                className="w-9 h-9 rounded-lg bg-muted text-foreground font-bold hover:bg-muted/70 active:scale-95 transition-all flex items-center justify-center text-lg"
              >
                −
              </button>
              <span className="font-mono-data text-2xl font-bold text-foreground w-8 text-center">
                {groupSizeVal}
              </span>
              <button
                type="button"
                onClick={() => setValue('groupSize', Math.min(20, groupSizeVal + 1))}
                className="w-9 h-9 rounded-lg bg-muted text-foreground font-bold hover:bg-muted/70 active:scale-95 transition-all flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>
            {errors.groupSize && (
              <p className="text-xs text-negative mt-1">{errors.groupSize.message}</p>
            )}
          </div>

          {/* Budget */}
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <IndianRupee size={15} className="text-primary" />
              Total Budget
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              For the entire group (₹{Math.round(budgetVal / groupSizeVal).toLocaleString()} per person)
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₹</span>
              <input
                type="number"
                {...register('budget', {
                  required: 'Budget is required',
                  min: { value: 200, message: 'Minimum budget is ₹200' },
                  max: { value: 50000, message: 'Maximum budget is ₹50,000' },
                })}
                className="w-full pl-7 pr-3 py-2.5 bg-input border border-border rounded-lg text-sm font-mono-data font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {errors.budget && (
              <p className="text-xs text-negative mt-1">{errors.budget.message}</p>
            )}
            {/* Quick presets */}
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {[1000, 2000, 3500, 5000].map((preset) => (
                <button
                  key={`budget-preset-${preset}`}
                  type="button"
                  onClick={() => setValue('budget', preset)}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                    budgetVal === preset
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  ₹{preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Duration + Return time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Clock size={15} className="text-primary" />
              Outing Duration
            </label>
            <p className="text-xs text-muted-foreground mb-3">How long do you want to be out?</p>
            <select
              {...register('duration', { required: true, valueAsNumber: true })}
              className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[2, 3, 4, 5, 6, 8].map((h) => (
                <option key={`dur-${h}`} value={h}>
                  {h} hours
                </option>
              ))}
            </select>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <AlarmClock size={15} className="text-primary" />
              Latest Return Time
            </label>
            <p className="text-xs text-muted-foreground mb-3">When do you need to be back?</p>
            <input
              type="time"
              {...register('latestReturnTime', { required: 'Return time is required' })}
              className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.latestReturnTime && (
              <p className="text-xs text-negative mt-1">{errors.latestReturnTime.message}</p>
            )}
          </div>
        </div>

        {/* Cuisine */}
        <div className="bg-card border border-border rounded-xl p-5">
          <label className="block text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
            <UtensilsCrossed size={15} className="text-primary" />
            Preferred Cuisine
          </label>
          <p className="text-xs text-muted-foreground mb-3">What are you in the mood for?</p>
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map((c) => (
              <label
                key={`cuisine-${c}`}
                className="cursor-pointer"
              >
                <input type="radio" value={c} {...register('cuisine')} className="sr-only" />
                <span
                  className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    watch('cuisine') === c
                      ? 'bg-primary text-primary-foreground border-primary' :'bg-muted text-muted-foreground border-border hover:border-primary/40'
                  }`}
                >
                  {c}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Flavor + Transport */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Flavor */}
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Flame size={15} className="text-primary" />
              Flavor Preference
            </label>
            <p className="text-xs text-muted-foreground mb-3">How do you like your food?</p>
            <div className="grid grid-cols-2 gap-2">
              {FLAVOR_OPTIONS.map((f) => (
                <button
                  key={`flavor-${f.value}`}
                  type="button"
                  onClick={() => setValue('flavorPreference', f.value as PlannerFormData['flavorPreference'])}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                    selectedFlavor === f.value
                      ? 'bg-primary/10 text-primary border-primary/30' :'bg-muted text-muted-foreground border-border hover:border-primary/30'
                  }`}
                >
                  <span className="text-base">{f.emoji}</span>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div className="bg-card border border-border rounded-xl p-5">
            <label className="block text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Car size={15} className="text-primary" />
              Transport Method
            </label>
            <p className="text-xs text-muted-foreground mb-3">How will you get around?</p>
            <div className="space-y-2">
              {TRANSPORT_OPTIONS.map((t) => (
                <button
                  key={`transport-${t.value}`}
                  type="button"
                  onClick={() => setValue('transportMethod', t.value as PlannerFormData['transportMethod'])}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    selectedTransport === t.value
                      ? 'bg-primary/10 text-primary border-primary/30' :'bg-muted text-muted-foreground border-border hover:border-primary/30'
                  }`}
                >
                  <span className="text-base">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Group mode toggle */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users size={15} className="text-accent" />
                <p className="text-sm font-semibold text-foreground">Group Mode</p>
              </div>
              <p className="text-xs text-muted-foreground max-w-sm">
                Each person submits their own preferences — we'll generate one itinerary that works for everyone.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGroupMode(!groupMode)}
              className="flex-shrink-0 ml-4"
              aria-label="Toggle group mode"
            >
              {groupMode ? (
                <ToggleRight size={36} className="text-accent" />
              ) : (
                <ToggleLeft size={36} className="text-muted-foreground" />
              )}
            </button>
          </div>
          {groupMode && (
            <div className="mt-3 px-3 py-2 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-xs text-accent font-medium">
                ✓ Group Mode on — you'll add each member's preferences in the next step.
              </p>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl text-base font-bold hover:bg-primary/90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-lg shadow-primary/25 min-w-[200px]"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating…
            </>
          ) : groupMode ? (
            <>
              Next: Add Members
              <ChevronRight size={18} />
            </>
          ) : (
            <>
              Generate My Itinerary
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}