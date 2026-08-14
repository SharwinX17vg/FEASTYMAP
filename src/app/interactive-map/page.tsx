import React from 'react';
import Navbar from '@/components/Navbar';
import MapScreen from '@/app/interactive-map/components/MapScreen';

export default function InteractiveMapPage() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden pt-16">
        <MapScreen />
      </div>
    </div>
  );
}