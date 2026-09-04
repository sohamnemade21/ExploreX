import { ExplorePOI, Destination, POICategory } from '../../src/types';
import { db } from '../db';
import { supabaseConfig, getSupabaseHeaders } from '../config/supabase';
import { isTransportOrVehicleEntity } from './itineraryUtils';

export class ExploreService {
  /**
   * Extract and unify all POIs (attractions, hotels, restaurants, experiences, crafts, events)
   * from destinations, cultural specialties, and local economy directories.
   */
  public getAllPOIs(): ExplorePOI[] {
    const destinations = db.getDestinations();
    const pois: ExplorePOI[] = [];

    for (const dest of destinations) {
      // 1. Attractions
      if (dest.popularAttractions && Array.isArray(dest.popularAttractions)) {
        for (const attr of dest.popularAttractions) {
          pois.push({
            id: attr.id || `poi-attr-${dest.id}-${Math.random().toString(36).substring(2, 6)}`,
            destinationId: dest.id,
            destinationName: dest.name,
            name: attr.name,
            category: (attr.category as POICategory) || 'Sightseeing',
            description: attr.description || dest.tagline,
            image: attr.image || dest.heroImage,
            lat: (attr as any).coordinates?.lat || attr.lat || dest.lat,
            lng: (attr as any).coordinates?.lng || attr.lng || dest.lng,
            rating: attr.rating || 4.7,
            reviewCount: attr.reviewCount || 120,
            priceLevel: attr.entryFee || 0,
            openingHours: attr.bestTimeToVisit ? `Best: ${attr.bestTimeToVisit}` : '08:00 AM - 06:30 PM',
            crowdLevel: attr.crowdLevel || 'Moderate',
            isOffbeat: Boolean(attr.isOffbeat),
            isPopular: !attr.isOffbeat
          });
        }
      }

      // 2. Local Cuisines & Khanavals / Restaurants
      if (dest.culturalSpecialties?.food) {
        dest.culturalSpecialties.food.forEach((item, idx) => {
          pois.push({
            id: `poi-food-${dest.id}-${idx}`,
            destinationId: dest.id,
            destinationName: dest.name,
            name: item.name,
            category: 'Food',
            tagline: item.isVeg ? '🌱 Pure Vegetarian Specialty' : '🍗 Authentic Local Cuisine',
            description: item.description,
            image: item.image || dest.heroImage,
            lat: dest.lat + (Math.random() * 0.02 - 0.01),
            lng: dest.lng + (Math.random() * 0.02 - 0.01),
            address: item.mustTryAt || `${dest.name} Food Market`,
            rating: 4.8,
            reviewCount: 95,
            priceLevel: 15,
            openingHours: '11:00 AM - 11:00 PM',
            crowdLevel: 'Moderate',
            isPopular: true,
            famousInfo: {
              type: 'Authentic Culinary Specialty',
              mustTryAt: item.mustTryAt
            }
          });
        });
      }

      if (dest.localEconomy?.traditionalKhanavals) {
        dest.localEconomy.traditionalKhanavals.forEach((k, idx) => {
          pois.push({
            id: `poi-khanaval-${dest.id}-${idx}`,
            destinationId: dest.id,
            destinationName: dest.name,
            name: k.name,
            category: 'Food',
            tagline: `Signature: ${k.signatureDish}`,
            description: `Family-run traditional eatery serving authentic ${k.signatureDish}. Highly recommended by local community guides.`,
            image: dest.heroImage,
            lat: dest.lat + (Math.random() * 0.03 - 0.015),
            lng: dest.lng + (Math.random() * 0.03 - 0.015),
            address: k.location || dest.name,
            rating: 4.9,
            reviewCount: 140,
            priceLevel: k.avgMealCost || 12,
            openingHours: '12:00 PM - 10:30 PM',
            crowdLevel: 'Low',
            isOffbeat: true,
            isPopular: false,
            famousInfo: {
              type: 'Family-Run Khanaval',
              mustTryAt: k.signatureDish
            }
          });
        });
      }

      // 3. Hotels & Authentic Homestays
      if (dest.localEconomy?.authenticHomestays) {
        dest.localEconomy.authenticHomestays.forEach((h, idx) => {
          pois.push({
            id: `poi-stay-${dest.id}-${idx}`,
            destinationId: dest.id,
            destinationName: dest.name,
            name: h.name,
            category: 'Hotel',
            tagline: `Host: ${h.hostName} • ${h.village}`,
            description: `Community-owned heritage homestay in ${h.village}. Direct economic retention stays with local host ${h.hostName}.`,
            image: dest.galleryImages?.[0] || dest.heroImage,
            lat: dest.lat + (Math.random() * 0.02 - 0.01),
            lng: dest.lng + (Math.random() * 0.02 - 0.01),
            address: `${h.village}, ${dest.name}`,
            rating: h.rating || 4.9,
            reviewCount: 88,
            priceLevel: h.pricePerNight || 45,
            openingHours: '24 Hours Check-In',
            crowdLevel: 'Low',
            isOffbeat: true,
            isPopular: false
          });
        });
      }

      // 4. GI-Tagged Crafts & Handicraft Cooperatives
      if (dest.culturalSpecialties?.handicrafts) {
        dest.culturalSpecialties.handicrafts.forEach((craft, idx) => {
          pois.push({
            id: `poi-craft-${dest.id}-${idx}`,
            destinationId: dest.id,
            destinationName: dest.name,
            name: craft.name,
            category: 'Craft',
            tagline: craft.giTagged ? '🏅 GI-Tagged Heritage Craft' : '✨ Artisan Masterpiece',
            description: craft.description,
            image: craft.image || dest.heroImage,
            lat: dest.lat + (Math.random() * 0.02 - 0.01),
            lng: dest.lng + (Math.random() * 0.02 - 0.01),
            address: craft.artisanCommunity || `${dest.name} Artisan Guild`,
            rating: 4.9,
            reviewCount: 65,
            priceLevel: 30,
            openingHours: '10:00 AM - 07:00 PM',
            crowdLevel: 'Low',
            isOffbeat: craft.giTagged,
            isPopular: !craft.giTagged,
            famousInfo: {
              type: 'GI-Tagged Handicraft',
              giTagged: craft.giTagged
            }
          });
        });
      }

      // 5. Local Festivals & Events
      if (dest.culturalSpecialties?.festivals) {
        dest.culturalSpecialties.festivals.forEach((f, idx) => {
          pois.push({
            id: `poi-event-${dest.id}-${idx}`,
            destinationId: dest.id,
            destinationName: dest.name,
            name: f.name,
            category: 'Event',
            tagline: `Season: ${f.monthOrSeason}`,
            description: `${f.culturalSignificance}. Highlights: ${f.celebrationHighlights}`,
            image: dest.heroImage,
            lat: dest.lat,
            lng: dest.lng,
            address: `${dest.name} Cultural Grounds`,
            rating: 5.0,
            reviewCount: 200,
            priceLevel: 0,
            openingHours: f.monthOrSeason,
            crowdLevel: 'Peak',
            isPopular: true,
            famousInfo: {
              type: 'Cultural Festival',
              bestSeason: f.monthOrSeason
            }
          });
        });
      }

      // 6. Unique Local Experiences
      if (dest.culturalSpecialties?.uniqueExperiences) {
        dest.culturalSpecialties.uniqueExperiences.forEach((exp, idx) => {
          pois.push({
            id: `poi-exp-${dest.id}-${idx}`,
            destinationId: dest.id,
            destinationName: dest.name,
            name: exp.title,
            category: 'Experience',
            tagline: `Best Time: ${exp.bestTime}`,
            description: `${exp.description} Impact: ${exp.localImpact}`,
            image: dest.galleryImages?.[1] || dest.heroImage,
            lat: dest.lat + (Math.random() * 0.025 - 0.012),
            lng: dest.lng + (Math.random() * 0.025 - 0.012),
            rating: 4.95,
            reviewCount: 110,
            priceLevel: 25,
            openingHours: exp.bestTime,
            crowdLevel: 'Low',
            isOffbeat: true
          });
        });
      }

      // 7. Chauffeured Cabs & Micro-Mobility Hubs
      pois.push(
        {
          id: `poi-cab-sedan-${dest.id}`,
          destinationId: dest.id,
          destinationName: dest.name,
          name: `Explorer Sedan Cab Stand (${dest.name})`,
          category: 'Cab',
          tagline: '🚕 ₹14/km • Verified Chauffeured AC Sedan Cabs',
          description: `On-demand AC Sedan Cabs stationed at ${dest.name} central hub. Zero surge pricing, instant booking, and GPS live-tracked drivers.`,
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
          lat: dest.lat + 0.008,
          lng: dest.lng - 0.006,
          address: `Central Express Cab Stand, ${dest.name}`,
          rating: 4.9,
          reviewCount: 310,
          priceLevel: 14,
          openingHours: '24/7 Live Availability',
          crowdLevel: 'Low',
          isPopular: true,
          famousInfo: {
            type: 'Chauffeured Cab Stand',
            mustTryAt: 'Airport, Station & Sightseeing Transfers'
          }
        },
        {
          id: `poi-cab-suv-${dest.id}`,
          destinationId: dest.id,
          destinationName: dest.name,
          name: `Explorer XL SUV Cab Stand (${dest.name})`,
          category: 'Cab',
          tagline: '🚙 ₹22/km • Premium 6-Seater Family & Luggage SUV Cabs',
          description: `Spacious SUV cabs ideal for families and group travel across ${dest.name}. Top rated drivers with complimentary mineral water and luggage assistance.`,
          image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
          lat: dest.lat - 0.009,
          lng: dest.lng + 0.007,
          address: `Airport & Interstate Express SUV Stand, ${dest.name}`,
          rating: 4.95,
          reviewCount: 220,
          priceLevel: 22,
          openingHours: '24/7 Live Availability',
          crowdLevel: 'Low',
          isPopular: true,
          famousInfo: {
            type: 'Group & Outstation Cab Hub'
          }
        },
        {
          id: `poi-cab-auto-${dest.id}`,
          destinationId: dest.id,
          destinationName: dest.name,
          name: `ExploreX EV Electric Auto Hub (${dest.name})`,
          category: 'Cab',
          tagline: '🛺 ₹9/km • Zero-Emission Green EV Auto Rickshaws',
          description: `Eco-friendly electric auto rickshaws perfect for short-distance heritage market hops and local street exploration in ${dest.name}.`,
          image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=600&q=80',
          lat: dest.lat + 0.005,
          lng: dest.lng + 0.004,
          address: `Heritage Market & Bazaar EV Auto Hub, ${dest.name}`,
          rating: 4.85,
          reviewCount: 185,
          priceLevel: 9,
          openingHours: '06:00 AM - 11:30 PM',
          crowdLevel: 'Moderate',
          isOffbeat: true
        },
        {
          id: `poi-cab-bike-${dest.id}`,
          destinationId: dest.id,
          destinationName: dest.name,
          name: `ExploreX Micro-Mobility Bike & Scooter Station (${dest.name})`,
          category: 'Cab',
          tagline: '🛵 ₹5/km • Self-Drive EV Scooters & Bike Taxis',
          description: `Rent EV scooters or hire bike taxi pilots for rapid solo mobility through narrow lanes and scenic coastal/mountain paths in ${dest.name}.`,
          image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
          lat: dest.lat - 0.004,
          lng: dest.lng - 0.008,
          address: `Central Promenade Micro-Mobility Dock, ${dest.name}`,
          rating: 4.8,
          reviewCount: 260,
          priceLevel: 5,
          openingHours: '07:00 AM - 10:00 PM',
          crowdLevel: 'Low',
          isOffbeat: true
        }
      );
    }

    return pois;
  }

  /**
   * Search and filter POIs with dynamic criteria.
   */
  public async getExplorePOIs(filters?: {
    destinationId?: string;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'name';
    isOffbeat?: boolean;
    isPopular?: boolean;
    excludeTransport?: boolean;
  }): Promise<ExplorePOI[]> {
    let list: ExplorePOI[] = [];

    // Try Supabase first if table exists and returns rows
    if (supabaseConfig.isConfigured && supabaseConfig.url) {
      try {
        const queryParams = new URLSearchParams();
        queryParams.set('select', '*');
        if (filters?.destinationId) queryParams.set('destination_id', `eq.${filters.destinationId}`);
        if (filters?.category && filters.category !== 'all') queryParams.set('category', `eq.${filters.category}`);
        
        const response = await fetch(`${supabaseConfig.url}/rest/v1/explore_pois?${queryParams.toString()}`, {
          headers: getSupabaseHeaders() || {},
        });

        if (response.ok) {
          const rows = await response.json();
          if (Array.isArray(rows) && rows.length > 0) {
            list = rows.map(r => ({
              id: r.id,
              destinationId: r.destination_id,
              destinationName: r.destination_name,
              name: r.name,
              category: r.category,
              tagline: r.tagline,
              description: r.description,
              image: r.image,
              gallery: r.gallery,
              lat: Number(r.lat),
              lng: Number(r.lng),
              address: r.address,
              rating: Number(r.rating || 4.5),
              reviewCount: Number(r.review_count || 50),
              priceLevel: Number(r.price_level || 0),
              openingHours: r.opening_hours,
              crowdLevel: r.crowd_level,
              isOffbeat: Boolean(r.is_offbeat),
              isPopular: Boolean(r.is_popular),
              famousInfo: r.famous_info
            }));
          }
        }
      } catch (err) {
        console.warn('Supabase explore_pois query notice (falling back to local memory DB):', err);
      }
    }

    // Fallback to local memory DB if Supabase has no data
    if (list.length === 0) {
      list = this.getAllPOIs();
    }

    // Apply Filters
    if (filters?.destinationId) {
      list = list.filter(p => p.destinationId === filters.destinationId);
    }

    if (filters?.category && filters.category !== 'all') {
      const catLower = filters.category.toLowerCase();
      list = list.filter(p => p.category.toLowerCase() === catLower);
    }

    if (filters?.minPrice !== undefined) {
      list = list.filter(p => p.priceLevel >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      list = list.filter(p => p.priceLevel <= filters.maxPrice!);
    }

    if (filters?.minRating !== undefined) {
      list = list.filter(p => p.rating >= filters.minRating!);
    }

    if (filters?.isOffbeat !== undefined) {
      list = list.filter(p => Boolean(p.isOffbeat) === filters.isOffbeat);
    }

    if (filters?.isPopular !== undefined) {
      list = list.filter(p => Boolean(p.isPopular) === filters.isPopular);
    }

    if (filters?.excludeTransport) {
      list = list.filter(p => !isTransportOrVehicleEntity(p));
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.destinationName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.address && p.address.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'price_asc':
          list.sort((a, b) => a.priceLevel - b.priceLevel);
          break;
        case 'price_desc':
          list.sort((a, b) => b.priceLevel - a.priceLevel);
          break;
        case 'name':
          list.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    return list;
  }

  /**
   * Extract "What's Famous Here?" insights for a destination.
   */
  public getWhatsFamousInfo(destinationId: string) {
    const dest = db.getDestinationById(destinationId);
    if (!dest) return null;

    return {
      destinationName: dest.name,
      stateOrRegion: dest.state || dest.stateOrRegion,
      food: dest.culturalSpecialties?.food || dest.localCuisines.map(c => ({ name: c, description: 'Famous regional dish', isVeg: true, tag: 'Must Try' })),
      handicrafts: dest.culturalSpecialties?.handicrafts || [],
      clothing: dest.culturalSpecialties?.clothing || [],
      festivals: dest.culturalSpecialties?.festivals || [],
      shopping: dest.culturalSpecialties?.localShopping || [],
      localEconomyScore: dest.localEconomy?.localImpactScore || 88,
      whyBetter: dest.whyAlternativeBetter
    };
  }
}

export const exploreService = new ExploreService();
