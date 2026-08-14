// BACKEND INTEGRATION POINT: Replace this entire module with a POST /api/itinerary call
import type { PlannerFormData, GeneratedItinerary, ItineraryStop, CostBreakdown } from './plannerTypes';
import { PLACES } from '@/lib/mockData';

function pickTransportCost(method: PlannerFormData['transportMethod'], stops: number): number {
  const base: Record<string, number> = {
    walk: 0, auto: 80, cab: 150, bike: 40, own_vehicle: 60 };
  return (base[method] || 80) * Math.max(1, stops - 1);
}

export function generateItinerary(data: PlannerFormData): GeneratedItinerary {
  const budgetPerPerson = data.budget / data.groupSize;

  // Rule-based stop selection
  const cafeStops = PLACES.filter((p) => p.category === 'cafe' && p.isOpenNow).slice(0, 1);
  const mallStops = PLACES.filter((p) => p.category === 'mall' && p.isOpenNow).slice(0, 1);
  const eventStops = PLACES.filter((p) => (p.category === 'event' || p.category === 'bar') && p.isOpenNow).slice(0, 1);
  const restaurantStops = PLACES.filter((p) => {
    if (data.flavorPreference === 'spicy') return p.category === 'restaurant' && p.tags.some((t) => t.toLowerCase().includes('spicy'));
    return p.category === 'restaurant' && p.isOpenNow;
  }).slice(0, 1);
  const dessertStops = PLACES.filter((p) => p.category === 'dessert' && p.isOpenNow).slice(0, 1);

  const selectedPlaces = [
    ...cafeStops,
    ...mallStops,
    ...eventStops,
    ...restaurantStops,
    ...dessertStops,
  ].slice(0, 5);

  const transportCostTotal = pickTransportCost(data.transportMethod, selectedPlaces.length);

  const stops: ItineraryStop[] = selectedPlaces.map((place, idx) => {
    const baseCost = Math.min(place.avgCostForTwo * data.groupSize * 0.5, budgetPerPerson * data.groupSize * 0.25);
    const costCat: ItineraryStop['costCategory'] =
      place.category === 'cafe'|| place.category === 'restaurant' || place.category === 'dessert' || place.category === 'street_food' ?'food'
        : place.category === 'mall' ?'shopping'
        : place.category === 'bar'|| place.category === 'event' ?'entertainment' :'food';

    const travelTime = idx === 0 ? 0 : data.transportMethod === 'walk' ? 20 : data.transportMethod === 'cab' ? 12 : 15;
    const travelCostShare = idx === 0 ? 0 : Math.round(transportCostTotal / Math.max(selectedPlaces.length - 1, 1));

    return {
      id: `stop-${place.id}-${idx}`,
      placeId: place.id,
      placeName: place.name,
      category: place.category,
      area: place.area,
      estimatedCost: Math.round(baseCost),
      costCategory: costCat,
      duration: place.category === 'mall' ? 90 : place.category === 'bar' || place.category === 'event' ? 120 : 45,
      travelTimeFromPrev: travelTime,
      travelCost: travelCostShare,
      openHours: place.openHours,
      isOpenNow: place.isOpenNow,
      hasOffer: place.hasOffer,
      offerLabel: place.offerLabel,
      rating: place.rating,
      image: place.image,
      imageAlt: place.imageAlt,
      notes:
        place.category === 'cafe' ?'Great spot to start — grab a coffee and plan the rest of the day.'
          : place.category === 'mall' ?'Browse and shop — check the food court for a quick snack.'
          : place.category === 'bar'|| place.category === 'event' ?'Live music and cocktails — book a table in advance on weekends.'
          : place.category === 'restaurant' ?'Main dining stop — consider a reservation if going on Friday/Saturday.' :'Perfect way to end the outing — try the signature dessert.',
      reservationAvailable: place.category === 'restaurant' || place.category === 'bar' || place.category === 'cafe',
    };
  });

  const foodTotal = stops.filter((s) => s.costCategory === 'food').reduce((a, s) => a + s.estimatedCost, 0);
  const shoppingTotal = stops.filter((s) => s.costCategory === 'shopping').reduce((a, s) => a + s.estimatedCost, 0);
  const entertainmentTotal = stops.filter((s) => s.costCategory === 'entertainment').reduce((a, s) => a + s.estimatedCost, 0);
  const costBreakdown: CostBreakdown = {
    transport: transportCostTotal,
    food: foodTotal,
    entertainment: entertainmentTotal,
    shopping: shoppingTotal,
    total: transportCostTotal + foodTotal + entertainmentTotal + shoppingTotal,
  };

  const totalDurationMins = stops.reduce((a, s) => a + s.duration + s.travelTimeFromPrev, 0);
  const surplus = data.budget - costBreakdown.total;

  // Calculate start/end times based on latestReturnTime
  const [retH, retM] = data.latestReturnTime.split(':').map(Number);
  const returnMinutes = retH * 60 + retM;
  const startMinutes = returnMinutes - totalDurationMins;
  const startH = Math.floor(Math.max(startMinutes, 0) / 60);
  const startMin = Math.max(startMinutes, 0) % 60;
  const fmt = (h: number, m: number) =>
    `${h % 12 === 0 ? 12 : h % 12}:${m.toString().padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;

  return {
    id: `itin-${Date.now()}`,
    title: `${data.duration}h Outing — ${stops.map((s) => s.area).filter((v, i, a) => a.indexOf(v) === i).join(' → ')}`,
    stops,
    costBreakdown,
    budget: data.budget,
    totalDuration: totalDurationMins,
    startTime: fmt(startH, startMin),
    endTime: data.latestReturnTime.replace(':', ':').replace(/(\d{2}):(\d{2})/, (_, h, m) => fmt(Number(h), Number(m))),
    surplus,
    coveragePercent: Math.min(Math.round((costBreakdown.total / data.budget) * 100), 100),
  };
}