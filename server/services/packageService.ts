import { TravelPackage } from '../../src/types';
import { db } from '../db';
import { supabaseConfig, getSupabaseHeaders } from '../config/supabase';
import { ALL_PACKAGES } from '../data/packagesData';

// Convert snake_case Supabase record to camelCase TravelPackage
export function mapSupabaseToPackage(row: any): TravelPackage {
  return {
    id: row.id,
    destinationId: row.destination_id || row.destinationId || '',
    destinationName: row.destination_name || row.destinationName || '',
    title: row.title || '',
    tagline: row.tagline || '',
    durationDays: Number(row.duration_days ?? row.durationDays ?? 1),
    durationNights: Number(row.duration_nights ?? row.durationNights ?? 0),
    startingPrice: Number(row.starting_price ?? row.startingPrice ?? 0),
    priceBreakdown: typeof row.price_breakdown === 'string' ? JSON.parse(row.price_breakdown) : (row.price_breakdown || row.priceBreakdown || {
      hotelStay: Math.round(row.starting_price * 0.45) || 100,
      transport: Math.round(row.starting_price * 0.20) || 50,
      activities: Math.round(row.starting_price * 0.20) || 50,
      meals: Math.round(row.starting_price * 0.15) || 30,
      taxesAndFees: 20,
      discount: 0,
      totalPerPerson: Number(row.starting_price ?? 0)
    }),
    images: Array.isArray(row.images) ? row.images : (typeof row.images === 'string' ? JSON.parse(row.images) : []),
    rating: Number(row.rating ?? 5.0),
    reviewCount: Number(row.review_count ?? row.reviewCount ?? 0),
    theme: row.theme || 'heritage',
    inclusions: Array.isArray(row.inclusions) ? row.inclusions : (typeof row.inclusions === 'string' ? JSON.parse(row.inclusions) : []),
    exclusions: Array.isArray(row.exclusions) ? row.exclusions : (typeof row.exclusions === 'string' ? JSON.parse(row.exclusions) : []),
    hotels: Array.isArray(row.hotels) ? row.hotels : (typeof row.hotels === 'string' ? JSON.parse(row.hotels) : []),
    itinerary: Array.isArray(row.itinerary) ? row.itinerary : (typeof row.itinerary === 'string' ? JSON.parse(row.itinerary) : []),
    maxGroupSize: Number(row.max_group_size ?? row.maxGroupSize ?? 12),
    availableDates: Array.isArray(row.available_dates) ? row.available_dates : (typeof row.available_dates === 'string' ? JSON.parse(row.available_dates) : (row.availableDates || [])),
    isFeatured: Boolean(row.is_featured ?? row.isFeatured ?? false),
  };
}

// Convert camelCase TravelPackage to snake_case Supabase record
export function mapPackageToSupabase(pkg: TravelPackage): Record<string, any> {
  return {
    id: pkg.id,
    destination_id: pkg.destinationId,
    destination_name: pkg.destinationName,
    title: pkg.title,
    tagline: pkg.tagline,
    duration_days: pkg.durationDays,
    duration_nights: pkg.durationNights,
    starting_price: pkg.startingPrice,
    currency: 'INR',
    discount: pkg.priceBreakdown?.discount || 0,
    price_breakdown: pkg.priceBreakdown,
    images: pkg.images,
    rating: pkg.rating,
    review_count: pkg.reviewCount,
    theme: pkg.theme,
    inclusions: pkg.inclusions,
    exclusions: pkg.exclusions,
    hotels: pkg.hotels,
    itinerary: pkg.itinerary,
    max_group_size: pkg.maxGroupSize,
    available_dates: pkg.availableDates,
    is_featured: Boolean(pkg.isFeatured),
    status: 'published',
    updated_at: new Date().toISOString()
  };
}

export class PackageService {
  /**
   * Fetch all packages with optional filtering.
   * Tries Supabase first; if table is empty or unavailable, falls back to local database.
   */
  async getPackages(filters?: {
    destinationId?: string;
    theme?: string;
    maxPrice?: number;
    search?: string;
    isFeatured?: boolean;
  }): Promise<TravelPackage[]> {
    let packages: TravelPackage[] = [];

    // 1. Try Supabase REST query if configured
    if (supabaseConfig.isConfigured && supabaseConfig.url) {
      try {
        const queryParams = new URLSearchParams();
        queryParams.set('select', '*');
        queryParams.set('status', 'eq.published');
        if (filters?.destinationId) queryParams.set('destination_id', `eq.${filters.destinationId}`);
        if (filters?.theme && filters.theme !== 'all') queryParams.set('theme', `eq.${filters.theme}`);
        if (filters?.maxPrice) queryParams.set('starting_price', `lte.${filters.maxPrice}`);
        if (filters?.isFeatured !== undefined) queryParams.set('is_featured', `eq.${filters.isFeatured}`);

        const response = await fetch(`${supabaseConfig.url}/rest/v1/packages?${queryParams.toString()}`, {
          headers: getSupabaseHeaders() || {},
        });

        if (response.ok) {
          const rows = await response.json();
          if (Array.isArray(rows) && rows.length > 0) {
            packages = rows.map(mapSupabaseToPackage);
          }
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local database store:', err);
      }
    }

    // 2. Fall back to local DB if Supabase returned no rows or is offline
    if (packages.length === 0) {
      packages = db.getPackages();
      if (!packages || packages.length === 0) {
        // Auto-seed local DB if empty
        packages = ALL_PACKAGES;
        for (const p of ALL_PACKAGES) {
          db.createPackage(p);
        }
      }

      // Apply in-memory filters
      if (filters?.destinationId) {
        packages = packages.filter(p => p.destinationId === filters.destinationId);
      }
      if (filters?.theme && filters.theme !== 'all') {
        packages = packages.filter(p => p.theme.toLowerCase() === filters.theme!.toLowerCase());
      }
      if (filters?.maxPrice) {
        packages = packages.filter(p => p.startingPrice <= filters.maxPrice!);
      }
      if (filters?.isFeatured !== undefined) {
        packages = packages.filter(p => Boolean(p.isFeatured) === filters.isFeatured);
      }
    }

    // 3. Search query filter
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      packages = packages.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.destinationName.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.theme.toLowerCase().includes(q)
      );
    }

    return packages;
  }

  /**
   * Get single package by ID.
   */
  async getPackageById(id: string): Promise<TravelPackage | null> {
    if (supabaseConfig.isConfigured && supabaseConfig.url) {
      try {
        const response = await fetch(`${supabaseConfig.url}/rest/v1/packages?id=eq.${id}&select=*`, {
          headers: getSupabaseHeaders() || {},
        });
        if (response.ok) {
          const rows = await response.json();
          if (Array.isArray(rows) && rows.length > 0) {
            return mapSupabaseToPackage(rows[0]);
          }
        }
      } catch {}
    }

    const localPkg = db.getPackageById(id);
    if (localPkg) return localPkg;

    // Check all packages seed dataset
    const seedPkg = ALL_PACKAGES.find(p => p.id === id);
    if (seedPkg) {
      db.createPackage(seedPkg);
      return seedPkg;
    }

    return null;
  }

  /**
   * Compare multiple packages by ID.
   */
  async comparePackages(packageIds: string[]): Promise<TravelPackage[]> {
    const promises = packageIds.map(id => this.getPackageById(id));
    const results = await Promise.all(promises);
    return results.filter((p): p is TravelPackage => p !== null);
  }

  /**
   * Create a new package (Admin / Owner authorized).
   */
  async createPackage(pkgData: Partial<TravelPackage>): Promise<TravelPackage> {
    const id = pkgData.id || `pkg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullPkg: TravelPackage = {
      id,
      destinationId: pkgData.destinationId || 'dest-goa',
      destinationName: pkgData.destinationName || 'Goa, India',
      title: pkgData.title || 'Curated Indian Experience',
      tagline: pkgData.tagline || 'Experience extraordinary travel with ExploreX',
      durationDays: pkgData.durationDays || 4,
      durationNights: pkgData.durationNights || 3,
      startingPrice: pkgData.startingPrice || 250,
      priceBreakdown: pkgData.priceBreakdown || {
        hotelStay: Math.round((pkgData.startingPrice || 250) * 0.45),
        transport: Math.round((pkgData.startingPrice || 250) * 0.20),
        activities: Math.round((pkgData.startingPrice || 250) * 0.20),
        meals: Math.round((pkgData.startingPrice || 250) * 0.15),
        taxesAndFees: 20,
        discount: 0,
        totalPerPerson: pkgData.startingPrice || 250
      },
      images: pkgData.images?.length ? pkgData.images : ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'],
      rating: pkgData.rating || 5.0,
      reviewCount: pkgData.reviewCount || 1,
      theme: pkgData.theme || 'heritage',
      inclusions: pkgData.inclusions || ['Luxury Boutique Accommodation', 'All Transfers in Private AC Cab', 'Guided Sightseeing'],
      exclusions: pkgData.exclusions || ['Airfare/Train tickets', 'Personal expenses'],
      hotels: pkgData.hotels || [{ name: 'ExploreX Verified Heritage Stay', stars: 5, roomType: 'Deluxe Suite', address: 'City Center' }],
      itinerary: pkgData.itinerary || [],
      maxGroupSize: pkgData.maxGroupSize || 12,
      availableDates: pkgData.availableDates || [new Date().toISOString().split('T')[0]],
      isFeatured: Boolean(pkgData.isFeatured)
    };

    // Save locally
    db.createPackage(fullPkg);

    // Sync to Supabase if configured
    if (supabaseConfig.isConfigured && supabaseConfig.url) {
      try {
        await fetch(`${supabaseConfig.url}/rest/v1/packages`, {
          method: 'POST',
          headers: {
            ...(getSupabaseHeaders() || {}),
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify(mapPackageToSupabase(fullPkg)),
        });
      } catch (err) {
        console.warn('Could not sync created package to Supabase:', err);
      }
    }

    return fullPkg;
  }

  /**
   * Update existing package.
   */
  async updatePackage(id: string, updates: Partial<TravelPackage>): Promise<TravelPackage | null> {
    const existing = await this.getPackageById(id);
    if (!existing) return null;

    const merged = { ...existing, ...updates };
    db.updatePackage(id, merged);

    if (supabaseConfig.isConfigured && supabaseConfig.url) {
      try {
        await fetch(`${supabaseConfig.url}/rest/v1/packages?id=eq.${id}`, {
          method: 'PATCH',
          headers: getSupabaseHeaders() || {},
          body: JSON.stringify(mapPackageToSupabase(merged)),
        });
      } catch (err) {
        console.warn('Could not sync update to Supabase:', err);
      }
    }

    return merged;
  }

  /**
   * Delete package.
   */
  async deletePackage(id: string): Promise<boolean> {
    const deleted = db.deletePackage(id);

    if (supabaseConfig.isConfigured && supabaseConfig.url) {
      try {
        await fetch(`${supabaseConfig.url}/rest/v1/packages?id=eq.${id}`, {
          method: 'DELETE',
          headers: getSupabaseHeaders() || {},
        });
      } catch (err) {
        console.warn('Could not delete from Supabase:', err);
      }
    }

    return deleted;
  }

  /**
   * Seed all initial packages to Supabase and local DB.
   */
  async seedAllPackages(): Promise<{ seededCount: number; supabaseSynced: boolean }> {
    let seededCount = 0;
    let supabaseSynced = false;

    // Seed local DB
    for (const pkg of ALL_PACKAGES) {
      const exists = db.getPackageById(pkg.id);
      if (!exists) {
        db.createPackage(pkg);
        seededCount++;
      } else {
        db.updatePackage(pkg.id, pkg);
      }
    }

    // Seed Supabase
    if (supabaseConfig.isConfigured && supabaseConfig.url) {
      try {
        const rows = ALL_PACKAGES.map(mapPackageToSupabase);
        const res = await fetch(`${supabaseConfig.url}/rest/v1/packages`, {
          method: 'POST',
          headers: {
            ...(getSupabaseHeaders() || {}),
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify(rows),
        });
        if (res.ok || res.status === 201) {
          supabaseSynced = true;
          console.log(`✅ Successfully synced ${ALL_PACKAGES.length} packages to Supabase`);
        }
      } catch (err) {
        console.warn('Supabase bulk seed warning:', err);
      }
    }

    return { seededCount: ALL_PACKAGES.length, supabaseSynced };
  }
}

export const packageService = new PackageService();
