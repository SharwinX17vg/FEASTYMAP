'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { CATEGORY_CONFIG } from '@/lib/mockData';
import type { Map, Marker } from 'leaflet';
import type { Place, TimeSlot } from '@/lib/mockData';

interface MapCanvasProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  activeTimeSlot: TimeSlot;
}

type LeafletHostElement = HTMLDivElement & {
  _leaflet_id?: number;
};

// Real-world lat/lng coordinates for Chennai places (mapped to mock data IDs)
const PLACE_COORDS: Record<string, [number, number]> = {
  'place-001': [13.0569, 80.2425], // Amara Brew House - Nungambakkam
  'place-002': [13.0418, 80.2341], // Murugan Idli Shop - T.Nagar
  'place-003': [13.0524, 80.2120], // Phoenix MarketCity - Velachery area
  'place-004': [13.0674, 80.2376], // The Jazz Lounge - Periamet
  'place-005': [13.0358, 80.2108], // Velachery Park
  'place-006': [13.0500, 80.2800], // Marina Beach area
  'place-007': [13.0600, 80.2200], // Poes Garden area
  'place-008': [13.0450, 80.2500], // Teynampet area
  'place-009': [13.0700, 80.2600], // Parrys area
  'place-010': [13.0380, 80.2450], // T.Nagar area
  'place-011': [13.0620, 80.2150], // Nungambakkam area
  'place-012': [13.0480, 80.2350], // Anna Nagar area
};

// Default center: Chennai
const DEFAULT_CENTER: [number, number] = [13.0827, 80.2707];
const DEFAULT_ZOOM = 13;

export default function MapCanvas({ places, selectedPlace, onSelectPlace, activeTimeSlot }: MapCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const userMarkerRef = useRef<Marker | null>(null);
  const isInitializingRef = useRef(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [locationError, setLocationError] = useState<string>('');
  const [mapBounds, setMapBounds] = useState<{ north: number; south: number; east: number; west: number } | null>(null);
  const [visibleCount, setVisibleCount] = useState(places.length);

  // Assign real coords to places (fallback to spread around default center)
  const getPlaceCoords = useCallback((place: Place): [number, number] => {
    if (PLACE_COORDS[place.id]) return PLACE_COORDS[place.id];
    // Fallback: spread using mock x/y as offset from center
    const lat = DEFAULT_CENTER[0] + (place.coordinates.y - 50) * -0.003;
    const lng = DEFAULT_CENTER[1] + (place.coordinates.x - 50) * 0.003;
    return [lat, lng];
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || isInitializingRef.current) return;

    // Check if container already has a Leaflet instance attached
    if ((mapContainerRef.current as LeafletHostElement)._leaflet_id) return;

    isInitializingRef.current = true;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        // Double-check after async import that we haven't already initialized
        if (!mapContainerRef.current || mapRef.current) {
          isInitializingRef.current = false;
          return;
        }
        if ((mapContainerRef.current as LeafletHostElement)._leaflet_id) {
          isInitializingRef.current = false;
          return;
        }

        const map = L.map(mapContainerRef.current!, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          zoomControl: true,
        });

        // OpenStreetMap tiles (free, no API key)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;
        isInitializingRef.current = false;

        // Update bounds on move/zoom
        const updateBounds = () => {
          const b = map.getBounds();
          setMapBounds({
            north: b.getNorth(),
            south: b.getSouth(),
            east: b.getEast(),
            west: b.getWest(),
          });
        };

        map.on('moveend', updateBounds);
        map.on('zoomend', updateBounds);
        updateBounds();
      } catch (err) {
        isInitializingRef.current = false;
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      isInitializingRef.current = false;
    };
  }, []);

  // Get user location
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationError('Geolocation not supported by your browser.');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setLocationStatus('success');
        if (mapRef.current) {
          mapRef.current.setView(coords, 14);
        }
      },
      (err) => {
        setLocationStatus('error');
        setLocationError(err.code === 1 ? 'Location access denied.' : 'Could not get your location.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  // Add/update user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const addUserMarker = async () => {
      const L = (await import('leaflet')).default;
      const map = mapRef.current;

      if (!map) return;

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }

      const pulseIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:20px;height:20px;border-radius:50%;
          background:rgba(59,130,246,0.9);
          border:3px solid white;
          box-shadow:0 0 0 6px rgba(59,130,246,0.25);
          animation:pulse 2s infinite;
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      userMarkerRef.current = L.marker(userLocation, { icon: pulseIcon })
        .addTo(map)
        .bindPopup('<b>📍 You are here</b>');
    };

    addUserMarker();
  }, [userLocation]);

  // Add/update place markers
  useEffect(() => {
    if (!mapRef.current) return;

    const updateMarkers = async () => {
      const L = (await import('leaflet')).default;

      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Filter places within current bounds
      const visiblePlaces = mapBounds
        ? places.filter((p) => {
            const [lat, lng] = getPlaceCoords(p);
            return (
              lat <= mapBounds.north &&
              lat >= mapBounds.south &&
              lng <= mapBounds.east &&
              lng >= mapBounds.west
            );
          })
        : places;

      setVisibleCount(visiblePlaces.length);

      const map = mapRef.current;
      if (!map) return;

      visiblePlaces.forEach((place) => {
        const cfg = CATEGORY_CONFIG[place.category];
        const isSelected = selectedPlace?.id === place.id;
        const coords = getPlaceCoords(place);

        const pinHtml = `
          <div style="
            display:flex;flex-direction:column;align-items:center;
            cursor:pointer;
            transform:${isSelected ? 'scale(1.3)' : 'scale(1)'};
            transition:transform 0.2s;
          ">
            <div style="
              width:${isSelected ? '36px' : '30px'};
              height:${isSelected ? '36px' : '30px'};
              border-radius:50%;
              background:${cfg.dotColor};
              border:2.5px solid white;
              box-shadow:0 2px 8px rgba(0,0,0,0.3)${isSelected ? ',0 0 0 3px rgba(249,115,22,0.5)' : ''};
              display:flex;align-items:center;justify-content:center;
              font-size:14px;
            ">
              ${place.category === 'cafe' ? '☕' :
                place.category === 'restaurant' ? '🍽️' :
                place.category === 'mall' ? '🛍️' :
                place.category === 'park' ? '🌳' :
                place.category === 'bar' ? '🍺' :
                place.category === 'event' ? '🎭' :
                place.category === 'dessert' ? '🍰' : '🥘'}
            </div>
            <div style="width:2px;height:8px;background:${cfg.dotColor};margin-top:1px;border-radius:1px;"></div>
            ${place.trendingScore >= 85 ? `<div style="
              position:absolute;top:-4px;right:-4px;
              width:14px;height:14px;border-radius:50%;
              background:#f97316;border:1.5px solid white;
              display:flex;align-items:center;justify-content:center;
              font-size:8px;color:white;
            ">⚡</div>` : ''}
          </div>
        `;

        const icon = L.divIcon({
          className: '',
          html: pinHtml,
          iconSize: [36, 46],
          iconAnchor: [18, 46],
          popupAnchor: [0, -46],
        });

        const marker = L.marker(coords, { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:180px;font-family:inherit;">
              <p style="font-weight:700;font-size:14px;margin:0 0 4px;">${place.name}</p>
              <p style="font-size:12px;color:#6b7280;margin:0 0 4px;">${place.area} · ${cfg.label}</p>
              <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
                <span style="color:${place.isOpenNow ? '#22c55e' : '#ef4444'}">
                  ${place.isOpenNow ? '● Open' : '○ Closed'}
                </span>
                <span style="color:#f59e0b;">★ ${place.rating}</span>
              </div>
              ${place.hasOffer ? `<p style="font-size:11px;color:#f97316;font-weight:600;margin:4px 0 0;">🏷 ${place.offerLabel}</p>` : ''}
            </div>
          `);

        marker.on('click', () => onSelectPlace(place));
        markersRef.current.push(marker);
      });
    };

    updateMarkers();
  }, [places, selectedPlace, mapBounds, getPlaceCoords, onSelectPlace]);

  // Pan to selected place
  useEffect(() => {
    if (!mapRef.current || !selectedPlace) return;
    const coords = getPlaceCoords(selectedPlace);
    mapRef.current.setView(coords, Math.max(mapRef.current.getZoom(), 15), { animate: true });
  }, [selectedPlace, getPlaceCoords]);

  return (
    <div className="w-full h-full relative">
      {/* Leaflet CSS pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          70% { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }
        .leaflet-container { font-family: inherit; }
        .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .leaflet-popup-content { margin: 12px 14px; }
      `}</style>

      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Time indicator overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 shadow-sm">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Showing</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {activeTimeSlot === 'morning' && '🌅 Morning Spots'}
          {activeTimeSlot === 'afternoon' && '☀️ Afternoon Spots'}
          {activeTimeSlot === 'evening' && '🌆 Evening Spots'}
          {activeTimeSlot === 'night' && '🌙 Night Spots'}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{visibleCount} places in view</p>
      </div>

      {/* Location button */}
      <div className="absolute bottom-8 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={requestLocation}
          disabled={locationStatus === 'loading'}
          className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-60"
          title="Find restaurants near me"
        >
          {locationStatus === 'loading' ? (
            <Loader2 size={16} className="animate-spin text-blue-500" />
          ) : locationStatus === 'success' ? (
            <Navigation size={16} className="text-green-500" />
          ) : (
            <MapPin size={16} className="text-primary" />
          )}
          <span className="hidden sm:inline">
            {locationStatus === 'loading' ? 'Locating…' :
             locationStatus === 'success'? 'Near You' : 'Near Me'}
          </span>
        </button>

        {locationStatus === 'error' && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 max-w-[180px]">
            <AlertCircle size={12} className="flex-shrink-0" />
            {locationError}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-4 z-[1000] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-sm hidden lg:block">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Legend</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {(['cafe', 'restaurant', 'mall', 'park', 'bar', 'event'] as const).map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            return (
              <div key={`legend-${cat}`} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dotColor }} />
                <span className="text-xs text-gray-600 dark:text-gray-400">{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}