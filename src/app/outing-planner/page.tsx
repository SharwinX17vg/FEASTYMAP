import React from 'react';
import Navbar from '@/components/Navbar';
import OutingPlannerScreen from '@/app/outing-planner/components/OutingPlannerScreen';

export default function OutingPlannerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <OutingPlannerScreen />
      </main>
    </div>
  );
}