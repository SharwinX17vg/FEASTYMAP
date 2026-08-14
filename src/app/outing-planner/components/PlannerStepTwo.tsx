'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, Trash2, ChevronLeft, Sparkles, Loader2, Users } from 'lucide-react';
import type { PlannerFormData, GroupMember } from './plannerTypes';

interface Props {
  baseData: PlannerFormData;
  onSubmit: (data: PlannerFormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

const FLAVOR_OPTIONS = ['any', 'spicy', 'sweet', 'mild'] as const;
const CUISINE_OPTIONS = ['Any', 'South Indian', 'North Indian', 'Chinese', 'Continental', 'Street Food'];

interface MemberFormValues {
  name: string;
  cuisine: string;
  flavorPreference: 'spicy' | 'sweet' | 'mild' | 'any';
  dietaryRestriction: string;
}

export default function PlannerStepTwo({ baseData, onSubmit, onBack, isLoading }: Props) {
  const [members, setMembers] = useState<GroupMember[]>([
    {
      id: 'member-001',
      name: 'You (Host)',
      cuisine: baseData.cuisine,
      flavorPreference: baseData.flavorPreference,
      dietaryRestriction: 'None',
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MemberFormValues>({
    defaultValues: { name: '', cuisine: 'Any', flavorPreference: 'any', dietaryRestriction: '' },
  });

  const addMember = (data: MemberFormValues) => {
    const newMember: GroupMember = {
      id: `member-${String(members.length + 1).padStart(3, '0')}`,
      name: data.name,
      cuisine: data.cuisine,
      flavorPreference: data.flavorPreference,
      dietaryRestriction: data.dietaryRestriction || 'None',
    };
    setMembers((prev) => [...prev, newMember]);
    reset();
    setShowAddForm(false);
  };

  const removeMember = (id: string) => {
    if (id === 'member-001') return; // can't remove host
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleGenerate = () => {
    onSubmit({ ...baseData, groupMembers: members });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Users size={16} className="text-accent" />
          <h2 className="text-base font-bold text-foreground">Group Members</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          Add each person's preferences. The itinerary will balance everyone's choices.
          ({members.length}/{baseData.groupSize} added)
        </p>

        {/* Member cards */}
        <div className="space-y-3 mb-4">
          {members.map((member, idx) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 bg-muted/40 border border-border rounded-lg"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">
                  {member.cuisine} · {member.flavorPreference}
                  {member.dietaryRestriction && member.dietaryRestriction !== 'None' && (
                    <span className="ml-1 text-warning">· {member.dietaryRestriction}</span>
                  )}
                </p>
              </div>
              {member.id !== 'member-001' && (
                <button
                  onClick={() => removeMember(member.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-negative hover:bg-negative-bg transition-all"
                  aria-label={`Remove ${member.name}`}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add member form */}
        {showAddForm ? (
          <form onSubmit={handleSubmit(addMember)} className="border border-border rounded-xl p-4 bg-background space-y-3">
            <p className="text-sm font-semibold text-foreground mb-3">Add a member</p>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                placeholder="e.g. Priya, Ravi, Meera"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.name && <p className="text-xs text-negative mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Cuisine</label>
                <select
                  {...register('cuisine')}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {CUISINE_OPTIONS.map((c) => (
                    <option key={`mem-cuisine-${c}`} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Flavor</label>
                <select
                  {...register('flavorPreference')}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {FLAVOR_OPTIONS.map((f) => (
                    <option key={`mem-flavor-${f}`} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Dietary Restriction{' '}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="text"
                {...register('dietaryRestriction')}
                placeholder="e.g. Vegetarian, Nut allergy, Vegan"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all"
              >
                <UserPlus size={14} />
                Add Member
              </button>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); reset(); }}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/70 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          members.length < baseData.groupSize && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-all w-full justify-center"
            >
              <UserPlus size={15} />
              Add another member ({baseData.groupSize - members.length} remaining)
            </button>
          )
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-3 bg-muted text-foreground rounded-xl text-sm font-semibold hover:bg-muted/70 active:scale-95 transition-all"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <button
          onClick={handleGenerate}
          disabled={isLoading || members.length === 0}
          className="flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25 min-w-[200px] justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Group Itinerary
            </>
          )}
        </button>
      </div>
    </div>
  );
}