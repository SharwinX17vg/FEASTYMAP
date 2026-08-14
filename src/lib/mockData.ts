// BACKEND INTEGRATION POINT: Replace all exports with API calls to your data service

export type Category = 'cafe' | 'restaurant' | 'mall' | 'park' | 'event' | 'bar' | 'dessert' | 'street_food';

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Place {
  id: string;
  name: string;
  category: Category;
  address: string;
  area: string;
  rating: number;
  reviewCount: number;
  trendingScore: number;
  isOpenNow: boolean;
  openHours: string;
  priceRange: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  avgCostForTwo: number;
  tags: string[];
  timeSlots: TimeSlot[];
  hasOffer: boolean;
  offerLabel?: string;
  isHiddenGem: boolean;
  coordinates: {x: number;y: number;}; // percentage on map canvas
  image: string;
  imageAlt: string;
  parkingAvailable: boolean;
  familyFriendly: boolean;
  wheelchairAccessible: boolean;
  cuisine?: string;
  signatureItem?: string;
}

export interface Offer {
  id: string;
  placeId: string;
  placeName: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  category: Category;
  image: string;
  imageAlt: string;
  isLive: boolean;
}

export interface Event {
  id: string;
  placeId: string;
  placeName: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: string;
  ticketPrice: number;
  image: string;
  imageAlt: string;
  area: string;
}

export const PLACES: Place[] = [
{
  id: 'place-001',
  name: 'Amara Brew House',
  category: 'cafe',
  address: '14, Khader Nawaz Khan Road',
  area: 'Nungambakkam',
  rating: 4.7,
  reviewCount: 312,
  trendingScore: 94,
  isOpenNow: true,
  openHours: '7:00 AM – 11:00 PM',
  priceRange: '₹₹',
  avgCostForTwo: 580,
  tags: ['Specialty Coffee', 'Cozy', 'Work-friendly'],
  timeSlots: ['morning', 'afternoon', 'evening'],
  hasOffer: true,
  offerLabel: '20% off Cold Brew',
  isHiddenGem: false,
  coordinates: { x: 28, y: 35 },
  image: "https://images.unsplash.com/photo-1663586680264-ce9367c8979b",
  imageAlt: 'Warm cozy cafe interior with wooden tables and hanging Edison bulb lights',
  parkingAvailable: true,
  familyFriendly: true,
  wheelchairAccessible: true,
  cuisine: 'Cafe',
  signatureItem: 'Saffron Cold Brew'
},
{
  id: 'place-002',
  name: 'The Spice Garden',
  category: 'restaurant',
  address: '7, Anna Salai',
  area: 'Teynampet',
  rating: 4.5,
  reviewCount: 487,
  trendingScore: 88,
  isOpenNow: true,
  openHours: '12:00 PM – 11:30 PM',
  priceRange: '₹₹₹',
  avgCostForTwo: 1400,
  tags: ['Chettinad', 'Authentic', 'Spicy'],
  timeSlots: ['afternoon', 'evening'],
  hasOffer: false,
  isHiddenGem: false,
  coordinates: { x: 52, y: 48 },
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f16dc5fd-1772200852232.png",
  imageAlt: 'Elegant restaurant interior with warm amber lighting and traditional decor',
  parkingAvailable: true,
  familyFriendly: true,
  wheelchairAccessible: false,
  cuisine: 'Chettinad',
  signatureItem: 'Chettinad Chicken Curry'
},
{
  id: 'place-003',
  name: 'Phoenix MarketCity',
  category: 'mall',
  address: '142, Velachery Main Road',
  area: 'Velachery',
  rating: 4.3,
  reviewCount: 1240,
  trendingScore: 82,
  isOpenNow: true,
  openHours: '10:00 AM – 10:00 PM',
  priceRange: '₹₹₹',
  avgCostForTwo: 2000,
  tags: ['Shopping', 'Food Court', 'Entertainment'],
  timeSlots: ['afternoon', 'evening'],
  hasOffer: true,
  offerLabel: 'Flat ₹500 off on ₹3000+',
  isHiddenGem: false,
  coordinates: { x: 72, y: 62 },
  image: "https://images.unsplash.com/photo-1723896808136-e5a7e0dbe48b",
  imageAlt: 'Modern shopping mall atrium with glass ceiling and multiple floors of retail stores',
  parkingAvailable: true,
  familyFriendly: true,
  wheelchairAccessible: true,
  signatureItem: 'PVR IMAX Screen'
},
{
  id: 'place-004',
  name: 'Semmozhi Poonga',
  category: 'park',
  address: 'Cathedral Road',
  area: 'Nandanam',
  rating: 4.6,
  reviewCount: 892,
  trendingScore: 79,
  isOpenNow: true,
  openHours: '6:00 AM – 8:00 PM',
  priceRange: '₹',
  avgCostForTwo: 60,
  tags: ['Nature', 'Botanical', 'Photography'],
  timeSlots: ['morning', 'afternoon'],
  hasOffer: false,
  isHiddenGem: false,
  coordinates: { x: 40, y: 22 },
  image: "https://images.unsplash.com/photo-1613219056038-53b1bc7c8a69",
  imageAlt: 'Lush botanical garden with tropical trees, walking paths and colorful flowers',
  parkingAvailable: true,
  familyFriendly: true,
  wheelchairAccessible: true
},
{
  id: 'place-005',
  name: 'The Jazz Lounge',
  category: 'bar',
  address: '5, Binny Road',
  area: 'Periamet',
  rating: 4.4,
  reviewCount: 203,
  trendingScore: 91,
  isOpenNow: true,
  openHours: '6:00 PM – 1:00 AM',
  priceRange: '₹₹₹',
  avgCostForTwo: 1800,
  tags: ['Live Music', 'Jazz', 'Cocktails'],
  timeSlots: ['evening', 'night'],
  hasOffer: true,
  offerLabel: 'Happy Hour 6–8 PM',
  isHiddenGem: false,
  coordinates: { x: 60, y: 30 },
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c1b3a0d7-1773877147180.png",
  imageAlt: 'Dimly lit jazz bar with stage lighting, musicians performing and audience seating',
  parkingAvailable: false,
  familyFriendly: false,
  wheelchairAccessible: true,
  signatureItem: 'Old Fashioned Cocktail'
},
{
  id: 'place-006',
  name: 'Murugan Idli Shop',
  category: 'restaurant',
  address: '77, GN Chetty Road',
  area: 'T. Nagar',
  rating: 4.8,
  reviewCount: 2100,
  trendingScore: 97,
  isOpenNow: true,
  openHours: '6:00 AM – 10:30 PM',
  priceRange: '₹',
  avgCostForTwo: 200,
  tags: ['South Indian', 'Breakfast', 'Iconic'],
  timeSlots: ['morning', 'afternoon'],
  hasOffer: false,
  isHiddenGem: false,
  coordinates: { x: 35, y: 58 },
  image: "https://images.unsplash.com/photo-1713213465535-9165756858e6",
  imageAlt: 'South Indian breakfast spread with idlis, sambar, chutneys and filter coffee',
  parkingAvailable: false,
  familyFriendly: true,
  wheelchairAccessible: false,
  cuisine: 'South Indian',
  signatureItem: 'Ghee Podi Idli'
},
{
  id: 'place-007',
  name: 'Marina Sundowner',
  category: 'bar',
  address: 'Kamarajar Salai',
  area: 'Marina',
  rating: 4.2,
  reviewCount: 156,
  trendingScore: 73,
  isOpenNow: false,
  openHours: '4:00 PM – 11:00 PM',
  priceRange: '₹₹',
  avgCostForTwo: 900,
  tags: ['Beach View', 'Sunset', 'Casual'],
  timeSlots: ['evening', 'night'],
  hasOffer: true,
  offerLabel: 'Sunset Special – 2 for 1',
  isHiddenGem: true,
  coordinates: { x: 82, y: 40 },
  image: "https://images.unsplash.com/photo-1577524515421-97562fbad77f",
  imageAlt: 'Beachside bar at sunset with orange sky reflections on water and string lights',
  parkingAvailable: true,
  familyFriendly: false,
  wheelchairAccessible: false,
  signatureItem: 'Coconut Rum Punch'
},
{
  id: 'place-008',
  name: 'Adyar Ananda Bhavan',
  category: 'dessert',
  address: '18, Cathedral Road',
  area: 'Gopalapuram',
  rating: 4.6,
  reviewCount: 1890,
  trendingScore: 85,
  isOpenNow: true,
  openHours: '8:00 AM – 10:30 PM',
  priceRange: '₹',
  avgCostForTwo: 300,
  tags: ['Sweets', 'South Indian Desserts', 'Iconic'],
  timeSlots: ['morning', 'afternoon', 'evening'],
  hasOffer: false,
  isHiddenGem: false,
  coordinates: { x: 45, y: 70 },
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_165667593-1772259854991.png",
  imageAlt: 'Colorful Indian sweets display with ladoos, burfis and halwas in glass cases',
  parkingAvailable: false,
  familyFriendly: true,
  wheelchairAccessible: true,
  cuisine: 'Indian Sweets',
  signatureItem: 'Mysore Pak'
},
{
  id: 'place-009',
  name: 'Karpagam Art Gallery',
  category: 'event',
  address: '10, Eldams Road',
  area: 'Alwarpet',
  rating: 4.3,
  reviewCount: 98,
  trendingScore: 68,
  isOpenNow: true,
  openHours: '10:00 AM – 7:00 PM',
  priceRange: '₹₹',
  avgCostForTwo: 400,
  tags: ['Art', 'Culture', 'Indie'],
  timeSlots: ['afternoon', 'evening'],
  hasOffer: false,
  isHiddenGem: true,
  coordinates: { x: 20, y: 50 },
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d24463ec-1777534821048.png",
  imageAlt: 'Modern art gallery with white walls displaying colorful paintings and sculptures',
  parkingAvailable: false,
  familyFriendly: true,
  wheelchairAccessible: true,
  signatureItem: 'Rotating Contemporary Exhibitions'
},
{
  id: 'place-010',
  name: 'Kalathi Street Kitchen',
  category: 'street_food',
  address: 'Burma Bazaar Lane',
  area: 'Parrys',
  rating: 4.9,
  reviewCount: 445,
  trendingScore: 76,
  isOpenNow: true,
  openHours: '11:00 AM – 9:00 PM',
  priceRange: '₹',
  avgCostForTwo: 160,
  tags: ['Street Food', 'Hidden Gem', 'Local Favourite'],
  timeSlots: ['afternoon', 'evening'],
  hasOffer: false,
  isHiddenGem: true,
  coordinates: { x: 65, y: 18 },
  image: "https://images.unsplash.com/photo-1667146122657-dace915c835e",
  imageAlt: 'Busy street food stall with steaming pots, colorful spices and local vendors',
  parkingAvailable: false,
  familyFriendly: true,
  wheelchairAccessible: false,
  cuisine: 'Street Food',
  signatureItem: 'Kothu Parotta'
},
{
  id: 'place-011',
  name: 'Velankanni Rooftop Café',
  category: 'cafe',
  address: '32, Poes Garden',
  area: 'Poes Garden',
  rating: 4.5,
  reviewCount: 178,
  trendingScore: 83,
  isOpenNow: true,
  openHours: '8:00 AM – 11:30 PM',
  priceRange: '₹₹',
  avgCostForTwo: 700,
  tags: ['Rooftop', 'City Views', 'Instagrammable'],
  timeSlots: ['morning', 'afternoon', 'evening'],
  hasOffer: true,
  offerLabel: '15% off on Weekdays',
  isHiddenGem: false,
  coordinates: { x: 18, y: 68 },
  image: "https://images.unsplash.com/photo-1714386450078-ac0600820424",
  imageAlt: 'Open-air rooftop cafe with city skyline views, plants and comfortable seating',
  parkingAvailable: false,
  familyFriendly: true,
  wheelchairAccessible: false,
  cuisine: 'Cafe',
  signatureItem: 'Cardamom Latte'
},
{
  id: 'place-012',
  name: 'Express Avenue',
  category: 'mall',
  address: 'Whites Road, Royapettah',
  area: 'Royapettah',
  rating: 4.1,
  reviewCount: 987,
  trendingScore: 71,
  isOpenNow: true,
  openHours: '10:00 AM – 10:00 PM',
  priceRange: '₹₹₹',
  avgCostForTwo: 1800,
  tags: ['Shopping', 'Brands', 'Food Court'],
  timeSlots: ['afternoon', 'evening'],
  hasOffer: true,
  offerLabel: 'Buy 2 Get 1 at select stores',
  isHiddenGem: false,
  coordinates: { x: 55, y: 78 },
  image: "https://images.unsplash.com/photo-1716619387915-8f83664cfa06",
  imageAlt: 'Busy shopping mall interior with escalators, brand stores and food court area',
  parkingAvailable: true,
  familyFriendly: true,
  wheelchairAccessible: true,
  signatureItem: 'Multiplex Cinema'
}];


export const OFFERS: Offer[] = [
{
  id: 'offer-001',
  placeId: 'place-001',
  placeName: 'Amara Brew House',
  title: '20% Off Cold Brew',
  description: 'Present this offer on any cold brew order. Valid on dine-in only.',
  discount: '20% OFF',
  validUntil: '15 Aug 2026',
  category: 'cafe',
  image: "https://images.unsplash.com/photo-1634729444924-8f254bd09cea",
  imageAlt: 'Glass of cold brew coffee with ice cubes on wooden table',
  isLive: true
},
{
  id: 'offer-002',
  placeId: 'place-003',
  placeName: 'Phoenix MarketCity',
  title: 'Flat ₹500 off on ₹3000+',
  description: 'Shop at any fashion store and get ₹500 off on a minimum bill of ₹3000.',
  discount: '₹500 OFF',
  validUntil: '20 Aug 2026',
  category: 'mall',
  image: "https://images.unsplash.com/photo-1632299822543-73f4b68b8165",
  imageAlt: 'Shopping bags and fashion accessories on a bright retail display',
  isLive: true
},
{
  id: 'offer-003',
  placeId: 'place-005',
  placeName: 'The Jazz Lounge',
  title: 'Happy Hour: 2 for 1 Cocktails',
  description: 'Every evening 6–8 PM. Applies to all signature cocktails.',
  discount: '2 for 1',
  validUntil: 'Daily 6–8 PM',
  category: 'bar',
  image: "https://images.unsplash.com/photo-1709106644346-478a6616f2ab",
  imageAlt: 'Two cocktail glasses with colorful drinks and garnishes on bar counter',
  isLive: true
},
{
  id: 'offer-004',
  placeId: 'place-007',
  placeName: 'Marina Sundowner',
  title: 'Sunset Special – Buy 1 Get 1',
  description: 'Any beverage between 5–7 PM. Enjoy the sunset with a free drink.',
  discount: 'BOGO',
  validUntil: 'Daily 5–7 PM',
  category: 'bar',
  image: "https://images.unsplash.com/photo-1719262883659-2dd4088b5977",
  imageAlt: 'Tropical cocktail with sunset beach background and colorful garnish',
  isLive: true
},
{
  id: 'offer-005',
  placeId: 'place-011',
  placeName: 'Velankanni Rooftop Café',
  title: '15% Off on Weekdays',
  description: 'Available Monday to Friday on all food and beverage items.',
  discount: '15% OFF',
  validUntil: 'Every Weekday',
  category: 'cafe',
  image: "https://images.unsplash.com/photo-1614225112036-0127aed310ae",
  imageAlt: 'Aerial view of rooftop cafe with plants and city view in background',
  isLive: true
},
{
  id: 'offer-006',
  placeId: 'place-012',
  placeName: 'Express Avenue',
  title: 'Buy 2 Get 1 Free',
  description: 'At participating apparel and lifestyle stores. Valid this weekend only.',
  discount: 'Buy 2 Get 1',
  validUntil: '17 Aug 2026',
  category: 'mall',
  image: "https://images.unsplash.com/photo-1636044035519-1775a11c984e",
  imageAlt: 'Retail store with clothing racks, mannequins and sale signs',
  isLive: true
}];


export const EVENTS: Event[] = [
{
  id: 'event-001',
  placeId: 'place-005',
  placeName: 'The Jazz Lounge',
  title: 'Friday Night Jazz: Priya Quartet',
  description: 'Live jazz performance by the acclaimed Priya Quartet. Intimate setting, limited seats.',
  date: '15 Aug 2026',
  time: '8:00 PM',
  category: 'Live Music',
  ticketPrice: 600,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c46c01c2-1775444223917.png",
  imageAlt: 'Jazz quartet performing on stage with saxophone, piano and bass instruments',
  area: 'Periamet'
},
{
  id: 'event-002',
  placeId: 'place-009',
  placeName: 'Karpagam Art Gallery',
  title: 'Monsoon Moods: Photography Exhibition',
  description: 'Curated photo exhibition by 12 local artists capturing the Chennai monsoon.',
  date: '14 Aug 2026',
  time: '10:00 AM',
  category: 'Art & Culture',
  ticketPrice: 0,
  image: "https://images.unsplash.com/photo-1543273135-383c35ea7765",
  imageAlt: 'Photography exhibition with large prints on white gallery walls and visitors',
  area: 'Alwarpet'
},
{
  id: 'event-003',
  placeId: 'place-003',
  placeName: 'Phoenix MarketCity',
  title: 'Independence Day Food Festival',
  description: 'Street food stalls from 20 cities across India. Tricolour desserts, folk performances.',
  date: '15 Aug 2026',
  time: '11:00 AM',
  category: 'Food Festival',
  ticketPrice: 0,
  image: "https://images.unsplash.com/photo-1730834344055-19f932948de3",
  imageAlt: 'Outdoor food festival with colorful stalls, crowds and string light decorations',
  area: 'Velachery'
},
{
  id: 'event-004',
  placeId: 'place-004',
  placeName: 'Semmozhi Poonga',
  title: 'Dawn Bird Walk',
  description: 'Guided bird-watching walk at sunrise. Spot 40+ species. Binoculars provided.',
  date: '16 Aug 2026',
  time: '6:00 AM',
  category: 'Nature & Wellness',
  ticketPrice: 150,
  image: "https://images.unsplash.com/photo-1595949199556-bebc80902501",
  imageAlt: 'Bird watcher with binoculars in a green botanical garden at sunrise',
  area: 'Nandanam'
}];


export const CATEGORY_CONFIG: Record<Category, {label: string;color: string;bgColor: string;dotColor: string;}> = {
  cafe: { label: 'Café', color: 'text-amber-700', bgColor: 'bg-amber-50', dotColor: '#D97706' },
  restaurant: { label: 'Restaurant', color: 'text-red-700', bgColor: 'bg-red-50', dotColor: '#DC2626' },
  mall: { label: 'Mall', color: 'text-purple-700', bgColor: 'bg-purple-50', dotColor: '#7C3AED' },
  park: { label: 'Park', color: 'text-green-700', bgColor: 'bg-green-50', dotColor: '#059669' },
  event: { label: 'Event', color: 'text-blue-700', bgColor: 'bg-blue-50', dotColor: '#2563EB' },
  bar: { label: 'Bar', color: 'text-indigo-700', bgColor: 'bg-indigo-50', dotColor: '#4338CA' },
  dessert: { label: 'Dessert', color: 'text-pink-700', bgColor: 'bg-pink-50', dotColor: '#DB2777' },
  street_food: { label: 'Street Food', color: 'text-orange-700', bgColor: 'bg-orange-50', dotColor: '#EA580C' }
};

export const TIME_SLOT_CONFIG: Record<TimeSlot, {label: string;emoji: string;hours: string;}> = {
  morning: { label: 'Morning', emoji: '🌅', hours: '6 AM – 12 PM' },
  afternoon: { label: 'Afternoon', emoji: '☀️', hours: '12 PM – 5 PM' },
  evening: { label: 'Evening', emoji: '🌆', hours: '5 PM – 9 PM' },
  night: { label: 'Night', emoji: '🌙', hours: '9 PM – 2 AM' }
};

export function getCurrentTimeSlot(): TimeSlot {
  const hour = 19; // 7 PM based on timestamp 19:09
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function getPlacesByTimeSlot(slot: TimeSlot): Place[] {
  return PLACES.filter((p) => p.timeSlots.includes(slot)).sort((a, b) => b.trendingScore - a.trendingScore);
}

export function getTrendingPlaces(limit = 6): Place[] {
  return [...PLACES].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, limit);
}