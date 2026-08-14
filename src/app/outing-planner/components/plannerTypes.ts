export interface GroupMember {
  id: string;
  name: string;
  cuisine: string;
  flavorPreference: 'spicy' | 'sweet' | 'mild' | 'any';
  dietaryRestriction: string;
}

export interface PlannerFormData {
  groupSize: number;
  budget: number;
  duration: number; // hours
  cuisine: string;
  flavorPreference: 'spicy' | 'sweet' | 'mild' | 'any';
  transportMethod: 'walk' | 'auto' | 'cab' | 'bike' | 'own_vehicle';
  latestReturnTime: string;
  groupMode: boolean;
  groupMembers: GroupMember[];
}

export interface ItineraryStop {
  id: string;
  placeId: string;
  placeName: string;
  category: string;
  area: string;
  estimatedCost: number;
  costCategory: 'transport' | 'food' | 'entertainment' | 'shopping';
  duration: number; // minutes
  travelTimeFromPrev: number; // minutes
  travelCost: number;
  openHours: string;
  isOpenNow: boolean;
  hasOffer: boolean;
  offerLabel?: string;
  rating: number;
  image: string;
  imageAlt: string;
  notes: string;
  reservationAvailable: boolean;
}

export interface CostBreakdown {
  transport: number;
  food: number;
  entertainment: number;
  shopping: number;
  total: number;
}

export interface GeneratedItinerary {
  id: string;
  title: string;
  stops: ItineraryStop[];
  costBreakdown: CostBreakdown;
  budget: number;
  totalDuration: number; // minutes
  startTime: string;
  endTime: string;
  surplus: number; // budget - total (negative = over budget)
  coveragePercent: number; // total / budget * 100
}