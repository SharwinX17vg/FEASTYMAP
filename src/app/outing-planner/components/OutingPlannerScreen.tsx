'use client';
import React, { useState } from 'react';
import { Route, Users, Sparkles } from 'lucide-react';
import PlannerStepOne from './PlannerStepOne';
import PlannerStepTwo from './PlannerStepTwo';
import PlannerItinerary from './PlannerItinerary';
import type { PlannerFormData, GeneratedItinerary } from './plannerTypes';
import { generateItinerary } from './itineraryEngine';

const STEPS = [
  { id: 1, label: 'Your Preferences', icon: Users },
  { id: 2, label: 'Group Mode', icon: Users },
  { id: 3, label: 'Your Itinerary', icon: Sparkles },
];

export default function OutingPlannerScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PlannerFormData | null>(null);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStep1Submit = (data: PlannerFormData) => {
    setFormData(data);
    if (data.groupMode) {
      setCurrentStep(2);
    } else {
      handleGenerate(data);
    }
  };

  const handleStep2Submit = (data: PlannerFormData) => {
    handleGenerate(data);
  };

  const handleGenerate = (data: PlannerFormData) => {
    setIsGenerating(true);
    // BACKEND INTEGRATION POINT: POST /api/itinerary/generate with data
    setTimeout(() => {
      const result = generateItinerary(data);
      setItinerary(result);
      setCurrentStep(3);
      setIsGenerating(false);
    }, 1800);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData(null);
    setItinerary(null);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Route size={18} className="text-primary" />
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Outing Planner</p>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          Plan your perfect outing
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tell us your preferences — we'll build a personalised multi-stop itinerary with a full cost breakdown.
        </p>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-3 mb-10">
        {STEPS.map((step, i) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <React.Fragment key={`step-${step.id}`}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-positive text-white'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? '✓' : step.id}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${
                    currentStep > step.id ? 'bg-positive' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step content */}
      {currentStep === 1 && (
        <PlannerStepOne onSubmit={handleStep1Submit} isLoading={isGenerating} />
      )}
      {currentStep === 2 && formData && (
        <PlannerStepTwo
          baseData={formData}
          onSubmit={handleStep2Submit}
          onBack={() => setCurrentStep(1)}
          isLoading={isGenerating}
        />
      )}
      {currentStep === 3 && itinerary && formData && (
        <PlannerItinerary
          itinerary={itinerary}
          formData={formData}
          onReset={handleReset}
        />
      )}

      {/* Generating overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="bg-card border border-border rounded-2xl p-10 text-center shadow-2xl max-w-sm w-full mx-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} className="text-primary animate-pulse-soft" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Building your itinerary…</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Matching places to your preferences, checking offer windows, and calculating the best route.
            </p>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse-soft w-2/3" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}