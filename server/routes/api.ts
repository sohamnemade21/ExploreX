import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db';
import { generateAutopilotReplan, runWhatIfSimulation } from '../gemini';
import { askTravelAssistant as askTravelAssistantChat } from '../services/aiChatService';
import { itineraryAdaptationService } from '../services/itineraryAdaptationService';
import { Booking, ExplorerRide, MagicMomentAlbum, MagicMomentPhoto, Review, GroupTrip, GroupExpense, UserProfile } from '../../src/types';
import { EXPLORER_VEHICLES } from '../data/initialData';
import { balanceTourismDemand, balanceTourismDemandML } from '../services/demandBalancerService';
import { searchCulturalSpecialties, getAlternativeRecommendations, getIndiaExplorerHierarchy } from '../services/culturalService';
import { createRazorpayOrder, verifyRazorpayPayment, createPaymentIntentHandler, razorpayWebhookHandler } from '../services/razorpayService';
import { packageService } from '../services/packageService';
import { exploreService } from '../services/exploreService';
import { itineraryService } from '../services/itineraryService';
import { itineraryValidator } from '../services/itineraryValidator';
import { supabaseAuthService, requireAuth, requireAdmin } from '../services/supabaseAuthService';
import { emailService } from '../services/emailService';
import { paymentService } from '../services/paymentService';
import { PdfInvoiceService } from '../services/pdfInvoiceService';
import { weatherService } from '../services/weatherService';
import { safetyService } from '../services/safetyService';
import { databaseService } from '../services/databaseService';
import { ENV } from '../config/env';

export const apiRouter = Router();

// In-memory rate limiter for administrative endpoints (120 reqs/min per IP)
const adminRateLimitMap = new Map<string, { count: number; resetAt: number }>();
export const adminRateLimiter = (req: Request, res: Response, next: () => void) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReqs = 120;

  const record = adminRateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    adminRateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (record.count >= maxReqs) {
    return res.status(429).json({
      error: 'Too many requests. Admin API rate limit exceeded. Please wait a minute and retry.',
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000)
    });
  }

  record.count++;
  next();
};

// Ensure upload directory exists (use /tmp on Vercel serverless)
const UPLOAD_DIR = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } catch {}
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `moment-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB single file limit
});

// Extract bearer token on all API routes to attach authenticated Supabase user if present
apiRouter.use(async (req: Request, res: Response, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    try {
      const user = await supabaseAuthService.verifySession(token);
      if (user) {
        (req as any).user = user;
        (req as any).userId = user.id;
      }
    } catch {
      // Non-fatal for unauthenticated or public routes
    }
  }
  next();
});

// Helper for getting current user ID
const getCurrentUserId = (req: Request): string => {
  return (req as any).userId || (req as any).user?.id || (req.headers['x-user-id'] as string) || 'usr-current';
};

// Helper for verifying if the active request is authenticated as an admin
const isRequestAdmin = (req: Request): boolean => {
  const user = (req as any).user;
  if (!user) return false;
  return supabaseAuthService.isAuthorizedAdmin(user);
};

// System status and health metrics
apiRouter.get('/status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    platform: 'ExploreX - Smart Tourism Platform',
    version: '2.4.0',
    auth: {
      provider: 'Supabase Auth',
      configured: supabaseAuthService.isLive()
    },
    payments: {
      provider: 'Razorpay',
      configured: Boolean(ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET)
    },
    email: {
      provider: 'Resend',
      configured: emailService.isConfigured()
    },
    timestamp: new Date().toISOString()
  });
});

/* ============================================================
   1. AUTH & PROFILE ROUTES (Supabase Auth & User Sessions)
   ============================================================ */

apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await supabaseAuthService.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Invalid credentials' });
  }
});

apiRouter.post('/auth/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const result = await supabaseAuthService.signUp(name, email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Could not register user' });
  }
});

apiRouter.post('/auth/logout', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7).trim() : undefined;
  const result = await supabaseAuthService.logout(token);
  res.json(result);
});

apiRouter.post('/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const result = await supabaseAuthService.resetPassword(email);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to process password reset' });
  }
});

apiRouter.get('/auth/session', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7).trim() : undefined;
  if (!token) {
    return res.status(401).json({ authenticated: false, user: null });
  }
  const user = await supabaseAuthService.verifySession(token);
  if (!user) {
    return res.status(401).json({ authenticated: false, user: null, error: 'Session expired or invalid' });
  }
  res.json({ authenticated: true, user });
});

apiRouter.get('/auth/profile', requireAuth, (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const user = (req as any).user || db.getUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

apiRouter.put('/auth/profile', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const updates = { ...req.body };

    // Validate and sanitize phone number if provided
    if (updates.phone !== undefined && updates.phone !== null) {
      const cleanPhone = String(updates.phone).trim();
      if (cleanPhone) {
        // E.164-compatible: digits, spaces, plus, dashes, parentheses allowed; minimum 7 digits, maximum 16 digits
        const digitsOnly = cleanPhone.replace(/\D/g, '');
        if (digitsOnly.length < 7 || digitsOnly.length > 15) {
          return res.status(400).json({ error: 'Please provide a valid phone number (between 7 and 15 digits).' });
        }
      }
      updates.phone = cleanPhone;
    }

    const updated = db.updateUser(userId, updates);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update user profile' });
  }
});

// Live Open-Meteo Weather Endpoint (Direct, Cached, Geocoded)
apiRouter.get('/weather', async (req: Request, res: Response) => {
  try {
    let destinationName = (req.query.destination || req.query.q) as string | undefined;
    let lat = req.query.lat !== undefined ? Number(req.query.lat) : undefined;
    let lng = req.query.lng !== undefined ? Number(req.query.lng) : undefined;

    // If destination name is provided without coords, resolve coordinates via geocoder
    if (destinationName && (lat === undefined || isNaN(lat) || lng === undefined || isNaN(lng))) {
      const geocoded = await weatherService.geocodeLocation(destinationName);
      lat = geocoded.lat;
      lng = geocoded.lng;
      destinationName = geocoded.name;
    }

    const finalLat = lat !== undefined && !isNaN(lat) ? lat : 18.5204;
    const finalLng = lng !== undefined && !isNaN(lng) ? lng : 73.8567;
    const finalName = destinationName || 'Pune, India';

    const report = await weatherService.getWeather(finalLat, finalLng, finalName);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch weather forecast' });
  }
});

// Location Search for Weather Destination Selector
apiRouter.get('/weather/search', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q || req.query.query || '') as string;
    if (!query || query.trim().length === 0) {
      return res.json([]);
    }
    const results = await weatherService.searchLocations(query);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to search locations' });
  }
});

// Traveler Safety Center: Get Profile
apiRouter.get('/safety/profile', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const profile = safetyService.getSafetyProfile(userId);
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch safety profile' });
  }
});

// Traveler Safety Center: Update Profile
apiRouter.put('/safety/profile', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const updated = safetyService.updateSafetyProfile(userId, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update safety profile' });
  }
});

// Traveler Safety Center: Trigger Emergency SOS
apiRouter.post('/safety/sos', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const user = (req as any).user || db.getUser(userId);
    const payload = {
      userId,
      userName: user?.name || 'Traveler',
      travelMode: req.body.travelMode || user?.safetyProfile?.travelMode || 'general',
      location: req.body.location,
      customMessage: req.body.customMessage,
      isDiscreet: Boolean(req.body.isDiscreet),
      batteryLevel: req.body.batteryLevel,
      timestamp: new Date().toISOString()
    };
    const alertResult = safetyService.triggerSos(payload);
    res.json(alertResult);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to trigger SOS alert' });
  }
});

// Traveler Safety Center: Record Check-In
apiRouter.post('/safety/checkin', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const { status = 'safe', note } = req.body;
    const result = safetyService.recordCheckIn(userId, status, note);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to record check-in' });
  }
});

// Traveler Safety Center: Destination Safety Alerts & Night-Travel Warnings
apiRouter.get('/safety/alerts', async (req: Request, res: Response) => {
  try {
    const destinationName = (req.query.destination as string) || 'India';
    const lat = req.query.lat ? Number(req.query.lat) : undefined;
    const lng = req.query.lng ? Number(req.query.lng) : undefined;
    const travelMode = (req.query.travelMode as any) || 'general';
    const alerts = await safetyService.getDestinationSafetyAlerts(destinationName, lat, lng, travelMode);
    res.json(alerts);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load safety alerts' });
  }
});

// Traveler Safety Center: Resolve Emergency SOS
apiRouter.post('/safety/sos/resolve', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const result = safetyService.resolveSos(userId);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to resolve SOS alert' });
  }
});

// Traveler Safety Center: Quick Trusted Contact Alert
apiRouter.post('/safety/contact-alert', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const { contactId, note, location } = req.body;
    const result = safetyService.pingTrustedContact(userId, contactId, note, location);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to send contact alert' });
  }
});

// Traveler Safety Center: Group Safety Status
apiRouter.get('/safety/group-status', requireAuth, (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const statuses = safetyService.getGroupSafetyStatus(userId);
    res.json(statuses);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch group safety status' });
  }
});

// Traveler Safety Center: Emergency Numbers Directory
apiRouter.get('/safety/directory', (req: Request, res: Response) => {
  try {
    const country = (req.query.country as string) || 'IN';
    const directory = safetyService.getEmergencyDirectory(country);
    res.json(directory);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load emergency directory' });
  }
});

apiRouter.post('/auth/preferences', requireAuth, (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { preferences } = req.body;
  const user = db.updateUser(userId, { preferences });
  res.json(user);
});

apiRouter.post('/auth/toggle-save-destination', requireAuth, (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { destinationId } = req.body;
  const user = db.getUser(userId);
  let saved = user.savedDestinations || [];
  if (saved.includes(destinationId)) {
    saved = saved.filter(id => id !== destinationId);
  } else {
    saved.push(destinationId);
  }
  const updated = db.updateUser(userId, { savedDestinations: saved });
  res.json(updated);
});

apiRouter.post('/auth/toggle-save-package', requireAuth, (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { packageId } = req.body;
  const user = db.getUser(userId);
  let saved = user.savedPackages || [];
  if (saved.includes(packageId)) {
    saved = saved.filter(id => id !== packageId);
  } else {
    saved.push(packageId);
  }
  const updated = db.updateUser(userId, { savedPackages: saved });
  res.json(updated);
});

apiRouter.delete('/auth/account', requireAuth, (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  db.deleteUser(userId);
  res.json({ success: true, message: 'Account permanently deleted.' });
});

/* ============================================================
   2. DESTINATIONS
   ============================================================ */

apiRouter.get('/destinations', (req: Request, res: Response) => {
  const { search, vibe, type } = req.query;
  let list = db.getDestinations();

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.country.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q)
    );
  }

  if (vibe && typeof vibe === 'string' && vibe !== 'all') {
    list = list.filter(d => d.vibe.includes(vibe as any));
  }

  if (type === 'domestic') {
    list = list.filter(d => !d.isInternational);
  } else if (type === 'international') {
    list = list.filter(d => d.isInternational);
  }

  res.json(list);
});

apiRouter.get('/destinations/:id', (req: Request, res: Response) => {
  const dest = db.getDestinationById(req.params.id);
  if (!dest) return res.status(404).json({ error: 'Destination not found' });
  res.json(dest);
});

apiRouter.post('/destinations', requireAdmin, (req: Request, res: Response) => {
  const newDest = db.createDestination(req.body);
  res.status(201).json(newDest);
});

apiRouter.put('/destinations/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateDestination(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Destination not found' });
  res.json(updated);
});

apiRouter.delete('/destinations/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteDestination(req.params.id);
  res.json({ success: deleted });
});

/* ============================================================
   2.5 EXPLORE POIS & SPATIAL ENGINE
   ============================================================ */

apiRouter.get('/explore', async (req: Request, res: Response) => {
  try {
    const { destinationId, category, search, minPrice, maxPrice, minRating, sortBy, isOffbeat, isPopular } = req.query;
    const pois = await exploreService.getExplorePOIs({
      destinationId: typeof destinationId === 'string' ? destinationId : undefined,
      category: typeof category === 'string' ? category : undefined,
      search: typeof search === 'string' ? search : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      sortBy: sortBy as any,
      isOffbeat: isOffbeat !== undefined ? isOffbeat === 'true' : undefined,
      isPopular: isPopular !== undefined ? isPopular === 'true' : undefined,
    });
    res.json(pois);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch explore POIs' });
  }
});

apiRouter.get('/explore/categories', (req: Request, res: Response) => {
  const categories = [
    { id: 'all', label: 'All Markers', icon: '📍' },
    { id: 'Sightseeing', label: '🏛️ Sightseeing', icon: '🏛️' },
    { id: 'Heritage', label: '⛩️ Heritage & Temples', icon: '⛩️' },
    { id: 'Nature', label: '🌲 Nature & Parks', icon: '🌲' },
    { id: 'Beach', label: '🏖️ Beaches', icon: '🏖️' },
    { id: 'Adventure', label: '🪂 Adventure', icon: '🪂' },
    { id: 'Food', label: '🍛 Food & Restaurants', icon: '🍛' },
    { id: 'Hotel', label: '🏨 Hotels & Homestays', icon: '🏨' },
    { id: 'Craft', label: '🧶 GI Crafts & Artisan Guilds', icon: '🧶' },
    { id: 'Experience', label: '✨ Local Experiences', icon: '✨' },
    { id: 'Event', label: '🎉 Cultural Festivals', icon: '🎉' }
  ];
  res.json(categories);
});

apiRouter.get('/explore/whats-famous/:destinationId', (req: Request, res: Response) => {
  try {
    const info = exploreService.getWhatsFamousInfo(req.params.destinationId);
    if (!info) return res.status(404).json({ error: 'Destination details not found' });
    res.json(info);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/* ============================================================
   3. PACKAGES
   ============================================================ */

apiRouter.get('/packages', async (req: Request, res: Response) => {
  try {
    const { destinationId, theme, maxPrice, search, isFeatured } = req.query;
    const packages = await packageService.getPackages({
      destinationId: typeof destinationId === 'string' ? destinationId : undefined,
      theme: typeof theme === 'string' ? theme : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      search: typeof search === 'string' ? search : undefined,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined
    });
    res.json(packages);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch packages' });
  }
});

apiRouter.get('/packages/:id', async (req: Request, res: Response) => {
  try {
    const pkg = await packageService.getPackageById(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    res.json(pkg);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch package' });
  }
});

apiRouter.post('/packages/compare', async (req: Request, res: Response) => {
  try {
    const { packageIds } = req.body;
    if (!Array.isArray(packageIds)) {
      return res.status(400).json({ error: 'packageIds array required' });
    }
    const packages = await packageService.comparePackages(packageIds);
    res.json(packages);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to compare packages' });
  }
});

apiRouter.post('/packages', requireAdmin, async (req: Request, res: Response) => {
  try {
    const newPkg = await packageService.createPackage(req.body);
    res.status(201).json(newPkg);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create package' });
  }
});

apiRouter.put('/packages/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await packageService.updatePackage(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Package not found' });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update package' });
  }
});

apiRouter.delete('/packages/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await packageService.deletePackage(req.params.id);
    res.json({ success: deleted });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete package' });
  }
});

apiRouter.post('/packages/seed', requireAdmin, async (req: Request, res: Response) => {
  try {
    const result = await packageService.seedAllPackages();
    res.json({ success: true, message: `Seeded ${result.seededCount} packages`, supabaseSynced: result.supabaseSynced });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to seed packages' });
  }
});

/* ============================================================
   4. THE EXPLORER (MICRO-MOBILITY & CABS)
   ============================================================ */

apiRouter.get('/explorer/vehicles', (req: Request, res: Response) => {
  res.json(EXPLORER_VEHICLES);
});

apiRouter.post('/explorer/fare-estimate', (req: Request, res: Response) => {
  const { pickupCoords, dropCoords, vehicleType } = req.body;
  
  // Calculate approximate distance in km using Haversine formula
  let distKm = 8.5; // fallback
  if (pickupCoords && dropCoords) {
    const R = 6371; // Earth's radius in km
    const dLat = ((dropCoords.lat - pickupCoords.lat) * Math.PI) / 180;
    const dLon = ((dropCoords.lng - pickupCoords.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickupCoords.lat * Math.PI) / 180) *
        Math.cos((dropCoords.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distKm = Math.max(1.2, Number((R * c).toFixed(1)));
  }

  const vehicle = EXPLORER_VEHICLES.find(v => v.type === vehicleType) || EXPLORER_VEHICLES[0];
  const fare = Number((vehicle.baseFare + distKm * vehicle.perKmRate).toFixed(2));
  const durationMins = Math.round(distKm * 2.8 + 4);
  const etaMins = vehicle.etaMins;

  res.json({
    distanceKm: distKm,
    fare,
    durationMins,
    etaMins,
    vehicle
  });
});

apiRouter.post('/explorer/book', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { vehicleType, pickupAddress, dropAddress, pickupCoords, dropCoords, fare, distanceKm, durationMins } = req.body;

  const vehicle = EXPLORER_VEHICLES.find(v => v.type === vehicleType) || EXPLORER_VEHICLES[0];

  const drivers = [
    { name: 'Vikram Singh', phone: '+91 98210 44912', rating: 4.95, vehicleNumber: 'GA-03-K-9812', vehicleModel: 'White Dzire Prime', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
    { name: 'Made Wardana', phone: '+62 812 3910 882', rating: 4.92, vehicleNumber: 'DK-4921-AZ', vehicleModel: 'Silver Innova Reborn', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
    { name: 'Rajesh Sharma', phone: '+91 99120 77319', rating: 4.88, vehicleNumber: 'HP-01-M-4411', vehicleModel: 'Electric Scooter EV-40', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' }
  ];

  const assignedDriver = drivers[Math.floor(Math.random() * drivers.length)];

  const newRide: ExplorerRide = {
    id: `RID-${Date.now()}`,
    userId,
    vehicleType,
    vehicleName: vehicle.name,
    pickupAddress: pickupAddress || 'Current Location',
    dropAddress: dropAddress || 'Destination Point',
    pickupCoords: pickupCoords || { lat: 15.2993, lng: 74.1240 },
    dropCoords: dropCoords || { lat: 15.4989, lng: 73.8278 },
    distanceKm: distanceKm || 8.5,
    fare: fare || vehicle.baseFare + 8.5 * vehicle.perKmRate,
    durationMins: durationMins || 25,
    status: 'driver_assigned',
    createdAt: new Date().toISOString(),
    driver: assignedDriver,
    otp: `${Math.floor(1000 + Math.random() * 9000)}`
  };

  db.createRide(newRide);

  // Also record in booking history
  db.createBooking({
    id: `BKG-EXP-${newRide.id}`,
    userId,
    serviceType: 'explorer',
    title: `The Explorer Ride: ${vehicle.name}`,
    destinationName: pickupAddress || 'Local City Ride',
    bookingDate: new Date().toISOString(),
    travelDate: new Date().toISOString().split('T')[0],
    passengersCount: 1,
    passengerDetails: [{ name: 'Traveler', age: 28, gender: 'Any' }],
    totalAmount: newRide.fare,
    status: 'confirmed',
    paymentMethod: 'wallet',
    paymentStatus: 'paid',
    isSimulation: true,
    details: {
      providerName: 'The Explorer Micro-Mobility',
      boardingPoint: newRide.pickupAddress,
      droppingPoint: newRide.dropAddress,
      pnrNumber: `OTP: ${newRide.otp}`
    },
    invoice: {
      invoiceNo: `INV-EXP-${Date.now()}`,
      baseFare: newRide.fare,
      taxes: 0,
      discounts: 0,
      grandTotal: newRide.fare,
      generatedAt: new Date().toISOString()
    }
  });

  res.status(201).json(newRide);
});

apiRouter.get('/explorer/rides', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  res.json(db.getRides(userId));
});

apiRouter.get('/explorer/rides/:id', (req: Request, res: Response) => {
  const ride = db.getRideById(req.params.id);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  res.json(ride);
});

apiRouter.post('/explorer/rides/:id/status-advance', (req: Request, res: Response) => {
  const ride = db.getRideById(req.params.id);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });

  const statusProgression: Record<string, ExplorerRide['status']> = {
    'searching': 'driver_assigned',
    'driver_assigned': 'arrived',
    'arrived': 'in_progress',
    'in_progress': 'completed'
  };

  const nextStatus = statusProgression[ride.status] || ride.status;
  const updated = db.updateRide(ride.id, { status: nextStatus });
  res.json(updated);
});

apiRouter.post('/explorer/rides/:id/cancel', (req: Request, res: Response) => {
  const ride = db.getRideById(req.params.id);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  if (ride.status === 'completed' || ride.status === 'cancelled') {
    return res.status(400).json({ error: 'Ride cannot be cancelled at this stage' });
  }

  const updated = db.updateRide(ride.id, { status: 'cancelled' });

  // Refund fare to wallet
  const user = db.getUser(ride.userId);
  user.walletBalance += ride.fare;
  db.updateUser(ride.userId, { walletBalance: user.walletBalance });

  db.createWalletTransaction({
    id: `txn-exp-ref-${Date.now()}`,
    userId: ride.userId,
    amount: ride.fare,
    type: 'credit',
    source: 'refund',
    description: `Refund for cancelled Explorer ride #${ride.id}`,
    timestamp: new Date().toISOString(),
    status: 'success',
    referenceId: ride.id
  });

  res.json({ success: true, ride: updated });
});

/* ============================================================
   5. BOOKINGS (FLIGHTS, TRAINS, BUSES, HOTELS, PACKAGES)
   ============================================================ */

apiRouter.get('/bookings', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  res.json(db.getBookings(userId));
});

apiRouter.get('/bookings/:id', (req: Request, res: Response) => {
  const bkg = db.getBookingById(req.params.id);
  if (!bkg) return res.status(404).json({ error: 'Booking not found' });
  
  const userId = getCurrentUserId(req);
  const isAdmin = isRequestAdmin(req);
  if (!isAdmin && bkg.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden: You do not have permission to view this booking.' });
  }

  res.json(bkg);
});

apiRouter.post('/bookings', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { 
    serviceType, 
    title, 
    destinationName, 
    travelDate, 
    returnDate, 
    passengersCount, 
    passengerDetails, 
    totalAmount, 
    paymentMethod, 
    details, 
    promoCode 
  } = req.body;

  let discount = 0;
  if (promoCode === 'WANDER20') {
    discount = Math.min(12500, Math.round(totalAmount * 0.2));
  } else if (promoCode === 'AIPEAK10') {
    discount = Math.min(6250, Math.round(totalAmount * 0.1));
  }

  const finalAmount = Math.max(830, totalAmount - discount);
  const taxes = Math.round(finalAmount * 0.18); // 18% GST
  const baseFare = finalAmount - taxes;

  const newBooking: Booking = {
    id: `EXX-BKG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    userId,
    serviceType: serviceType || 'hotel',
    title: title || 'Custom Travel Booking',
    destinationName: destinationName || 'Featured City',
    bookingDate: new Date().toISOString(),
    travelDate: travelDate || new Date().toISOString().split('T')[0],
    returnDate,
    passengersCount: passengersCount || 1,
    passengerDetails: passengerDetails || [{ name: 'Traveler', age: 28, gender: 'Any' }],
    totalAmount: finalAmount,
    status: 'confirmed',
    paymentMethod: paymentMethod || 'wallet',
    paymentStatus: 'paid',
    isSimulation: true, // Transparent simulation indicator per requirements
    details: {
      ...details,
      providerReference: `EXX-CONF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      confirmationNotice: 'ExploreX Simulated Reservation (Safe Demo Mode)'
    },
    invoice: {
      invoiceNo: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      baseFare,
      taxes,
      discounts: discount,
      grandTotal: finalAmount,
      generatedAt: new Date().toISOString()
    }
  };

  const created = db.createBooking(newBooking);

  // Trigger Resend confirmation email if booking is confirmed and paid (e.g. via wallet)
  if (created.status === 'confirmed' && created.paymentStatus === 'paid') {
    const userObj = (req as any).user || db.getUser(userId);
    const recipient = userObj?.email || created.details?.contactEmail || 'traveler@explorex.com';
    const name = userObj?.name || created.passengerDetails?.[0]?.name || 'Valued Traveler';

    emailService.sendBookingConfirmationEmail(created, recipient, name)
      .then(result => {
        db.updateBooking(created.id, {
          emailStatus: result.success ? 'sent' : 'failed',
          emailError: result.error || undefined,
          emailSentAt: result.success ? new Date().toISOString() : undefined,
          emailRecipient: result.recipient
        });
      })
      .catch(err => {
        console.warn('Wallet booking email dispatch notice (non-fatal):', err);
        db.updateBooking(created.id, {
          emailStatus: 'failed',
          emailError: err.message || 'Email delivery failed'
        });
      });
  }

  res.status(201).json(created);
});

apiRouter.post('/bookings/:id/resend-email', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await paymentService.resendBookingConfirmationEmail(req.params.id, email);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to resend confirmation email' });
  }
});

apiRouter.get('/bookings/:id/invoice.pdf', (req: Request, res: Response) => {
  const bkg = db.getBookingById(req.params.id);
  if (!bkg) return res.status(404).json({ error: 'Booking not found' });

  const userId = getCurrentUserId(req);
  const isAdmin = isRequestAdmin(req);
  if (!isAdmin && bkg.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden: You do not have permission to download this invoice.' });
  }

  try {
    const pdfBuf = PdfInvoiceService.generateInvoicePdf(bkg);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ExploreX-Tax-Invoice-${bkg.id}.pdf"`);
    res.send(pdfBuf);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate invoice PDF: ' + err.message });
  }
});

apiRouter.post('/bookings/:id/cancel', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const isAdmin = isRequestAdmin(req);
  const bkg = db.getBookingById(req.params.id);
  if (!bkg) return res.status(404).json({ error: 'Booking not found' });

  if (!isAdmin && bkg.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden: You do not have permission to cancel this booking.' });
  }

  const result = db.cancelBooking(req.params.id, isAdmin ? 'admin' : userId);
  if (!result) return res.status(404).json({ error: 'Booking not found or already cancelled' });
  res.json(result);
});

/* ============================================================
   6. MAGIC MOMENTS (PRIVATE GALLERY & 20MB QUOTA)
   ============================================================ */

apiRouter.get('/moments/albums', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  res.json(db.getAlbums(userId));
});

apiRouter.post('/moments/albums', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { title, destinationName, tripStartDate, tripEndDate } = req.body;

  if (!title) return res.status(400).json({ error: 'Album title is required' });

  const newAlbum: MagicMomentAlbum = {
    id: `alb-${Date.now()}`,
    userId,
    title,
    destinationName: destinationName || 'My Journey',
    tripStartDate: tripStartDate || new Date().toISOString().split('T')[0],
    tripEndDate: tripEndDate || new Date().toISOString().split('T')[0],
    photosCount: 0,
    totalSizeBytes: 0
  };

  const created = db.createAlbum(newAlbum);
  res.status(201).json(created);
});

apiRouter.delete('/moments/albums/:id', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  db.deleteAlbum(req.params.id, userId);
  res.json({ success: true, message: 'Album deleted' });
});

apiRouter.get('/moments/albums/:id/photos', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  res.json(db.getPhotosByAlbum(req.params.id, userId));
});

apiRouter.get('/moments/usage', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  res.json(db.getUserStorageUsage(userId));
});

apiRouter.post('/moments/upload', upload.single('file') as any, (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { albumId, caption, locationName, tags, directUrl } = req.body;

  const usage = db.getUserStorageUsage(userId);
  const file = req.file;

  const fileSize = file ? file.size : 1200000; // ~1.2MB if URL

  // Strict 20 MB quota check per Requirement 7
  if (usage.usedBytes + fileSize > usage.quotaBytes) {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return res.status(400).json({
      error: `Storage quota exceeded! You have used ${(usage.usedBytes / (1024 * 1024)).toFixed(1)} MB of your strict 20 MB quota.`
    });
  }

  const photoUrl = file 
    ? `/uploads/${file.filename}` 
    : (directUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80');

  const photo: MagicMomentPhoto = {
    id: `pho-${Date.now()}`,
    userId,
    albumId: albumId || 'alb-1',
    url: photoUrl,
    caption: caption || 'Unforgettable travel memory',
    locationName: locationName || 'Scenic Location',
    takenAt: new Date().toISOString(),
    fileSizeBytes: fileSize,
    mediaType: 'image',
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim())) : ['Travel']
  };

  const created = db.createPhoto(photo);
  res.status(201).json(created);
});

apiRouter.delete('/moments/photos/:id', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const deleted = db.deletePhoto(req.params.id, userId);
  res.json({ success: deleted });
});

/* ============================================================
   7. REVIEWS & FEEDBACK (1-5 STARS, <= 100 WORDS, DUPLICATE CHECK)
   ============================================================ */

apiRouter.get('/reviews', (req: Request, res: Response) => {
  const { targetType, targetId } = req.query;
  res.json(db.getReviews(targetType as string, targetId as string));
});

apiRouter.post('/reviews', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { targetType, targetId, targetName, rating, reviewText } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' });
  }

  // Word count validation (<= 100 words per requirement 8)
  const words = (reviewText || '').trim().split(/\s+/).filter(Boolean);
  if (words.length > 100) {
    return res.status(400).json({ error: `Review is too long (${words.length} words). Maximum allowed is 100 words.` });
  }

  const user = db.getUser(userId);

  const review: Review = {
    id: `rev-${Date.now()}`,
    userId,
    userName: user.name || 'Verified Traveler',
    userAvatar: user.avatar,
    targetType,
    targetId,
    targetName: targetName || 'Travel Service',
    rating: Number(rating),
    reviewText,
    createdAt: new Date().toISOString(),
    verifiedBooking: true,
    likes: 0
  };

  const result = db.createReview(review);
  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }
  res.status(201).json(result.review);
});

apiRouter.put('/reviews/:id', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { rating, reviewText } = req.body;

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' });
  }

  if (reviewText) {
    const words = reviewText.trim().split(/\s+/).filter(Boolean);
    if (words.length > 100) {
      return res.status(400).json({ error: `Review is too long (${words.length} words). Maximum allowed is 100 words.` });
    }
  }

  const updated = db.updateReview(req.params.id, userId, { rating, reviewText });
  if (!updated) return res.status(404).json({ error: 'Review not found or unauthorized' });
  res.json(updated);
});

apiRouter.delete('/reviews/:id', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const deleted = db.deleteReview(req.params.id, userId);
  res.json({ success: deleted });
});

/* ============================================================
   8. WALLET & TRANSACTIONS
   ============================================================ */

apiRouter.get('/wallet', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const user = db.getUser(userId);
  const transactions = db.getWalletTransactions(userId);
  res.json({
    balance: user.walletBalance,
    transactions
  });
});

apiRouter.post('/wallet/topup', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { amount, method } = req.body;
  const numAmount = Number(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Invalid top-up amount' });
  }

  const result = db.topupWallet(userId, numAmount, method || 'UPI / Card (Simulation)');
  res.json(result);
});

/* ============================================================
   9. GROUP EXPENSES & SPLITTING MATRIX
   ============================================================ */

apiRouter.get('/expenses/groups', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  res.json(db.getGroupTrips(userId));
});

apiRouter.get('/expenses/groups/:id', (req: Request, res: Response) => {
  const trip = db.getGroupTripById(req.params.id);
  if (!trip) return res.status(404).json({ error: 'Group trip not found' });
  const settlement = db.calculateGroupSettlement(req.params.id);
  res.json({ trip, settlement });
});

apiRouter.post('/expenses/groups', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { title, destinationName, members } = req.body;

  if (!title) return res.status(400).json({ error: 'Group title is required' });

  const defaultUser = db.getUser(userId);
  const allMembers = [
    { id: userId, name: `${defaultUser.name} (You)`, email: defaultUser.email, avatar: defaultUser.avatar },
    ...(members || [])
  ];

  const newGroup: GroupTrip = {
    id: `grp-${Date.now()}`,
    userId,
    title,
    destinationName: destinationName || 'Group Trip',
    members: allMembers,
    expenses: [],
    createdAt: new Date().toISOString()
  };

  const created = db.createGroupTrip(newGroup);
  res.status(201).json(created);
});

apiRouter.post('/expenses/groups/:id/expenses', (req: Request, res: Response) => {
  const { title, category, amount, paidById, paidByName, splitAmongIds, notes } = req.body;

  if (!title || !amount || !paidById) {
    return res.status(400).json({ error: 'Title, amount, and payer are required' });
  }

  const expense: GroupExpense = {
    id: `exp-${Date.now()}`,
    groupId: req.params.id,
    title,
    category: category || 'Other',
    amount: Number(amount),
    paidById,
    paidByName: paidByName || 'Member',
    splitAmongIds: splitAmongIds || [],
    splitType: 'equal',
    date: new Date().toISOString().split('T')[0],
    notes
  };

  const updatedTrip = db.addExpenseToGroup(req.params.id, expense);
  if (!updatedTrip) return res.status(404).json({ error: 'Group trip not found' });
  const settlement = db.calculateGroupSettlement(req.params.id);

  res.status(201).json({ trip: updatedTrip, settlement });
});

apiRouter.delete('/expenses/groups/:id/expenses/:expId', (req: Request, res: Response) => {
  const updatedTrip = db.deleteExpenseFromGroup(req.params.id, req.params.expId);
  if (!updatedTrip) return res.status(404).json({ error: 'Group trip not found' });
  const settlement = db.calculateGroupSettlement(req.params.id);
  res.json({ trip: updatedTrip, settlement });
});

/* ============================================================
   10. AI TRAVEL ENGINE & INTELLIGENCE
   ============================================================ */

apiRouter.post('/ai/generate-itinerary', async (req: Request, res: Response) => {
  try {
    const itinerary = await itineraryService.generateItinerary(req.body);
    res.json(itinerary);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate AI itinerary' });
  }
});

apiRouter.post('/ai/validate-itinerary', (req: Request, res: Response) => {
  try {
    const result = itineraryValidator.validate(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to validate itinerary' });
  }
});

// 1. Conversational Trip Assistant Chat (OpenAI / Gemini / Grounded Catalog)
const handleChatRequest = async (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const user = userId ? db.getUser(userId) : null;
    const { message, conversation, history, tripContext, destinationId } = req.body;

    const chatHistory = conversation || history || [];

    const result = await askTravelAssistantChat({
      message: message || '',
      history: chatHistory,
      destinationId: destinationId || tripContext?.destinationId,
      tripContext,
      userContext: {
        name: user?.name,
        budget: user?.preferences?.budgetLevel,
        vibes: user?.preferences?.vibes
      }
    });

    res.json(result);
  } catch (err: any) {
    console.error('AI Assistant Error Detail:', err);
    res.status(500).json({ error: err.message || 'AI Assistant service error', stack: err.stack });
  }
};

apiRouter.post('/assistant/chat', handleChatRequest);
apiRouter.post('/ai/chat', handleChatRequest);

// 2. Intelligent Itinerary Adaptation & Autopilot Replan
const handleAdaptItinerary = async (req: Request, res: Response) => {
  try {
    const { destinationName, trigger, customProblemDescription, currentItinerary, itinerary, currentSchedule, destinationId } = req.body;

    const result = await itineraryAdaptationService.adaptItinerary({
      destinationName: destinationName || 'Goa',
      destinationId,
      trigger: trigger || 'heavy_rain',
      customProblemDescription,
      currentItinerary: itinerary || currentItinerary
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to adapt itinerary' });
  }
};

apiRouter.post('/itinerary/adapt', handleAdaptItinerary);
apiRouter.post('/ai/autopilot/replan', handleAdaptItinerary);

apiRouter.post('/ai/what-if', async (req: Request, res: Response) => {
  try {
    const { scenario, destinationName, baseBudget, groupSize, durationDays } = req.body;
    const result = await runWhatIfSimulation({
      scenario: scenario || 'What if it rains on Day 2?',
      destinationName: destinationName || 'Swiss Alps',
      baseBudget: Number(baseBudget) || 1200,
      groupSize: Number(groupSize) || 2,
      durationDays: Number(durationDays) || 5
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/ai/travel-dna', (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { answers } = req.body; // e.g. { adventure: 85, culture: 90, ... }

  const updatedDNA = {
    culturalExplorer: answers?.culturalExplorer || 85,
    adventureSeeker: answers?.adventureSeeker || 75,
    gastronomyLover: answers?.gastronomyLover || 90,
    relaxationScore: answers?.relaxationScore || 80,
    ecoConscious: answers?.ecoConscious || 88,
    spontaneity: answers?.spontaneity || 70,
    primaryArchetype: 'Authentic Heritage & Epicurean Explorer',
    secondaryArchetype: 'Scenic Alpine & Coastal Trailblazer',
    description: 'You prioritize deep cultural resonance, hyper-local gastronomy, and panoramic natural wonders with a strong preference for sustainable transport and boutique accommodations.'
  };

  const updatedUser = db.updateUser(userId, { travelDNA: updatedDNA });
  res.json(updatedUser.travelDNA);
});

apiRouter.get('/ai/contextual-suggestions', (req: Request, res: Response) => {
  const { destinationId, timeOfDay } = req.query;
  const dest = destinationId ? db.getDestinationById(destinationId as string) : db.getDestinations()[0];

  const suggestions = [
    {
      title: 'Optimal Photo Lighting Window',
      detail: `Current soft sunlight at ${dest?.name || 'your destination'} is ideal for panoramic photography.`,
      icon: 'Camera',
      action: 'View Recommended Viewpoints'
    },
    {
      title: 'Low Crowd Window Active',
      detail: 'Local attractions currently report 40% below average crowd levels for the next 90 minutes.',
      icon: 'Users',
      action: 'Book Fast-Track Entry'
    },
    {
      title: 'The Explorer Cab Nearby',
      detail: '3 Explorer Sedan cabs currently cruising within 4 minutes of your location.',
      icon: 'Car',
      action: 'Call Explorer Ride'
    }
  ];

  res.json(suggestions);
});

/* ============================================================
   11. SECURE ADMIN & BUSINESS ANALYTICS (PROTECTED BY Supabase Auth + RLS/RBAC)
   ============================================================ */

/**
 * 1. Admin Verification:
 * Validates the caller is an authenticated admin with server-side authorization.
 */
apiRouter.get('/admin/verify', adminRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const admin = (req as any).user;
  res.json({
    verified: true,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name || 'ExploreX Administrator',
      role: 'admin'
    },
    system: {
      authProvider: 'Supabase Auth',
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * 2. High-Level Operations & Revenue Analytics
 */
apiRouter.get('/admin/analytics', adminRateLimiter, requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getAdminAnalytics());
});

/**
 * 3. User Directory & Registration Summaries
 * Never exposes passwords or sensitive credentials.
 */
apiRouter.get('/admin/users', adminRateLimiter, requireAdmin, (req: Request, res: Response) => {
  let users = db.getAllUsersSummary();
  const q = (req.query.q as string)?.toLowerCase()?.trim();
  if (q) {
    users = users.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      u.id.toLowerCase().includes(q)
    );
  }
  res.json({ users, total: users.length });
});

/**
 * 4. Deep User Profile with complete booking & trip history
 */
apiRouter.get('/admin/users/:id', adminRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const detail = db.getUserDetailWithHistory(req.params.id);
  if (!detail) {
    return res.status(404).json({ error: 'User profile not found' });
  }
  res.json(detail);
});

/**
 * 5. Paginated, Filtered & Searchable Bookings
 */
apiRouter.get('/admin/bookings', adminRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const filters = {
    search: req.query.search as string,
    serviceType: req.query.serviceType as string,
    status: req.query.status as string,
    paymentStatus: req.query.paymentStatus as string,
    emailStatus: req.query.emailStatus as string,
    sortBy: req.query.sortBy as string,
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 15
  };
  const result = db.getPaginatedBookings(filters);
  res.json(result);
});

/**
 * 6. Single Booking Detail (Sanitized)
 */
apiRouter.get('/admin/bookings/:id', adminRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const bkg = db.getBookingById(req.params.id);
  if (!bkg) return res.status(404).json({ error: 'Booking not found' });
  res.json(bkg);
});

/**
 * 7. Admin Update Booking Status (with Audit Log)
 */
apiRouter.patch('/admin/bookings/:id/status', adminRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const { status, note } = req.body;
  const validStatuses: Booking['status'][] = ['confirmed', 'completed', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const admin = (req as any).user;
  const updated = db.adminUpdateBookingStatus(req.params.id, status, admin.id, admin.email, note);
  if (!updated) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  res.json({ success: true, booking: updated });
});

/**
 * 8. Admin Cancel & Refund Booking (with Audit Log & Wallet credit)
 */
apiRouter.post('/admin/bookings/:id/cancel', adminRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const { reason } = req.body;
  const admin = (req as any).user;
  const result = db.adminCancelAndRefundBooking(req.params.id, admin.id, admin.email, reason);
  if (!result) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  res.json({
    success: true,
    message: `Booking #${req.params.id} cancelled. ₹${result.refundAmount.toLocaleString('en-IN')} refunded to traveler wallet.`,
    booking: result.booking,
    refundAmount: result.refundAmount
  });
});

/**
 * 9. Admin Resend Confirmation Email (with Audit Log)
 */
apiRouter.post('/admin/bookings/:id/resend-email', adminRateLimiter, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { recipientEmail } = req.body;
    const admin = (req as any).user;
    const result = db.adminResendBookingEmail(req.params.id, admin.id, admin.email, recipientEmail);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to resend confirmation email' });
  }
});

/**
 * 10. Reviews & Customer Feedback Management
 */
apiRouter.get('/admin/reviews', adminRateLimiter, requireAdmin, (req: Request, res: Response) => {
  let reviews = db.getReviews();
  const ratingFilter = req.query.rating ? Number(req.query.rating) : null;
  const q = (req.query.q as string)?.toLowerCase()?.trim();

  if (ratingFilter) {
    reviews = reviews.filter(r => r.rating === ratingFilter);
  }
  if (q) {
    reviews = reviews.filter(r => 
      r.userName.toLowerCase().includes(q) || 
      (r.reviewText && r.reviewText.toLowerCase().includes(q)) ||
      (r.targetName && r.targetName.toLowerCase().includes(q))
    );
  }
  res.json({ reviews, total: reviews.length });
});

/**
 * 11. Moderate / Delete Inappropriate Review
 */
apiRouter.delete('/admin/reviews/:id', adminRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const admin = (req as any).user;
  const deleted = db.deleteReview(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Review not found' });
  }

  db.logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    action: 'REVIEW_DELETED',
    targetType: 'review',
    targetId: req.params.id,
    details: `Admin deleted review #${req.params.id} during content moderation.`
  });

  res.json({ success: true, message: 'Review successfully removed.' });
});

/**
 * 12. Security Audit Logs
 */
apiRouter.get('/admin/audit-logs', adminRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 100;
  const logs = db.getAdminAuditLogs(limit);
  res.json({ auditLogs: logs, total: logs.length });
});

/**
 * 13. Secure CSV Data Export (Never exports passwords or card credentials)
 */
apiRouter.get('/admin/export/bookings', adminRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const admin = (req as any).user;
  const bookings = db.getPaginatedBookings({ limit: 1000 }).bookings;

  // Sanitize helper against CSV injection (=, +, -, @)
  const sanitizeCsv = (val: any) => {
    if (val === null || val === undefined) return '""';
    let str = String(val).replace(/"/g, '""');
    if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
      str = `'${str}`;
    }
    return `"${str}"`;
  };

  const headers = [
    'Booking ID',
    'Customer ID',
    'Primary Traveler',
    'Service Type',
    'Booking Title',
    'Destination',
    'Booking Date',
    'Travel Date',
    'Return Date',
    'Guests',
    'Total Amount (INR)',
    'Base Fare (INR)',
    'Taxes (INR)',
    'Payment Method',
    'Payment Status',
    'Razorpay Payment ID',
    'Razorpay Order ID',
    'Booking Status',
    'Email Status'
  ];

  const rows = bookings.map(b => [
    sanitizeCsv(b.id),
    sanitizeCsv(b.userId),
    sanitizeCsv(b.passengerDetails?.[0]?.name || 'Traveler'),
    sanitizeCsv(b.serviceType),
    sanitizeCsv(b.title),
    sanitizeCsv(b.destinationName),
    sanitizeCsv(b.bookingDate),
    sanitizeCsv(b.travelDate),
    sanitizeCsv(b.returnDate || ''),
    sanitizeCsv(b.passengersCount),
    sanitizeCsv(b.totalAmount),
    sanitizeCsv(b.invoice?.baseFare || Math.round(b.totalAmount * 0.82)),
    sanitizeCsv(b.invoice?.taxes || Math.round(b.totalAmount * 0.18)),
    sanitizeCsv(b.paymentMethod),
    sanitizeCsv(b.paymentStatus),
    sanitizeCsv(b.details?.razorpayPaymentId || 'N/A'),
    sanitizeCsv(b.details?.razorpayOrderId || 'N/A'),
    sanitizeCsv(b.status),
    sanitizeCsv(b.emailStatus || 'sent')
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');

  db.logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    action: 'DATA_EXPORTED',
    targetType: 'report',
    targetId: 'bookings_csv',
    details: `Exported ${bookings.length} booking records to CSV reconciliation sheet.`
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="ExploreX-Bookings-Report-${new Date().toISOString().split('T')[0]}.csv"`);
  res.send(csvContent);
});

/**
 * 14. Promotional Offers Management
 */
apiRouter.get('/admin/offers', adminRateLimiter, requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getOffers());
});

/**
 * 15. Factory Seed Reset (Admin Only)
 */
apiRouter.post('/admin/reset-db', adminRateLimiter, requireAdmin, (req: Request, res: Response) => {
  const admin = (req as any).user;
  db.resetToDefaults();
  
  db.logAdminAction({
    adminId: admin.id,
    adminEmail: admin.email,
    action: 'DESTINATION_CREATED', // generic system action
    targetType: 'system',
    targetId: 'db_reset',
    details: 'Database factory seed re-initialized by authorized admin.'
  });

  res.json({ success: true, message: 'Database reset to initial verified factory seed.' });
});

apiRouter.post('/moments/enhance', (req: Request, res: Response) => {
  const { photoId, style } = req.body;
  // Simulating AI photo enhancement filter
  res.json({
    success: true,
    filterApplied: style || 'Vivid HDR',
    enhancedUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=90'
  });
});

apiRouter.post('/expenses/groups/:id/settle', (req: Request, res: Response) => {
  const { debtorId, creditorId, amount } = req.body;
  const trip = db.getGroupTripById(req.params.id);
  if (!trip) return res.status(404).json({ error: 'Group trip not found' });

  // Add settlement expense
  const settleExp: GroupExpense = {
    id: `exp-settle-${Date.now()}`,
    groupId: trip.id,
    title: `Wallet Settlement to ${creditorId}`,
    category: 'Other',
    amount: Number(amount) || 0,
    paidById: debtorId,
    paidByName: debtorId,
    splitAmongIds: [creditorId],
    splitType: 'exact',
    date: new Date().toISOString().split('T')[0],
    notes: 'Direct ExploreX Wallet peer transfer'
  };

  const updatedTrip = db.addExpenseToGroup(trip.id, settleExp);
  const settlement = db.calculateGroupSettlement(trip.id);
  res.json({ trip: updatedTrip, settlement });
});

/* ============================================================
   12. INDIA AI TOURISM DEMAND BALANCER & LOCAL CULTURE ENGINE
   ============================================================ */

// 1. AI Tourism Demand Balancer (ML-enhanced with rule-based fallback)
apiRouter.post('/ai/demand-balancer', async (req: Request, res: Response) => {
  try {
    const query = req.body || {};
    let results;
    try {
      results = await balanceTourismDemandML(query);
    } catch (mlErr) {
      console.warn('ML demand balancer unavailable, using rule-based fallback:', (mlErr as Error).message);
      results = balanceTourismDemand(query);
    }
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error executing AI Demand Balancer' });
  }
});

// 1b. Dynamic Pricing — ML Service with algorithmic fallback
apiRouter.get('/destinations/:id/dynamic-price', async (req: Request, res: Response) => {
  try {
    const ML_URL = ENV.ML_SERVICE_URL;
    const { date } = req.query;
    const targetDate = (date as string) || new Date().toISOString().split('T')[0];
    const response = await fetch(`${ML_URL}/price/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationId: req.params.id,
        date: targetDate,
      }),
    });
    if (!response.ok) throw new Error('Price prediction failed');
    const prediction = await response.json();
    return res.json(prediction);
  } catch {
    // Algorithmic dynamic pricing fallback
    const dest = db.getDestinationById(req.params.id);
    const targetDate = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const dateObj = new Date(targetDate);
    const monthName = dateObj.toLocaleString('en-US', { month: 'long' });
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
    const baseLine = dest ? (dest.startingPrice * 75) : 4500;
    const isBestMonth = dest ? dest.bestMonths.some(m => m.toLowerCase().includes(monthName.toLowerCase())) : false;
    
    let multiplier = 1.0;
    const topFactors: string[] = [];
    if (isBestMonth) {
      multiplier += 0.18;
      topFactors.push(`Peak Season: ${monthName} is historically an optimal travel window`);
    } else {
      multiplier -= 0.08;
      topFactors.push(`Shoulder Season: Favorable budget pricing in ${monthName}`);
    }
    if (isWeekend) {
      multiplier += 0.08;
      topFactors.push('Weekend demand surge');
    }
    const predictedPrice = Math.round(baseLine * multiplier);
    const changeVsBaseline = Math.round(((predictedPrice - baseLine) / baseLine) * 100);

    return res.json({
      destinationId: req.params.id,
      destinationName: dest?.name || req.params.id,
      date: targetDate,
      month: monthName,
      predictedPrice,
      baseLine,
      changeVsBaseline,
      isHoliday: isWeekend,
      isBestMonth,
      popularityTier: dest?.popularityTier || 'popular',
      topFactors,
      featureImportances: {
        seasonality: 0.45,
        weekend_demand: 0.25,
        destination_tier: 0.2,
        capacity_load: 0.1
      }
    });
  }
});

// 1c. Itinerary Optimization — ML Service with algorithmic fallback
apiRouter.post('/packages/:id/optimize-itinerary', async (req: Request, res: Response) => {
  try {
    const ML_URL = ENV.ML_SERVICE_URL;
    const pkg = db.getPackageById(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });

    const { numDays, maxHoursPerDay, categoryPreferences } = req.body;
    const response = await fetch(`${ML_URL}/itinerary/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationId: pkg.destinationId,
        numDays: numDays || pkg.durationDays,
        maxHoursPerDay: maxHoursPerDay || 8,
        categoryPreferences: categoryPreferences || undefined,
      }),
    });
    if (!response.ok) throw new Error('Itinerary optimization failed');
    const optimized = await response.json();
    return res.json(optimized);
  } catch {
    const pkg = db.getPackageById(req.params.id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    const dest = db.getDestinationById(pkg.destinationId);

    const days = (pkg.itinerary || []).map((dayItem, idx) => {
      const stops = (dayItem.activities || []).map((actName, actIdx) => ({
        order: actIdx + 1,
        attractionId: `act-${idx + 1}-${actIdx + 1}`,
        name: typeof actName === 'string' ? actName : String(actName),
        category: 'Sightseeing',
        indoorOutdoor: 'outdoor',
        arrivalTime: `${8 + actIdx * 2}:30 AM`,
        departureTime: `${10 + actIdx * 2}:30 AM`,
        visitDurationMins: 90,
        travelFromPrevMins: 20,
        estimatedCost: Math.round((pkg.startingPrice || 5000) / (pkg.durationDays * 4)),
        lat: dest?.lat || 15.2993,
        lng: dest?.lng || 74.1240
      }));
      return {
        day: dayItem.dayNumber || (idx + 1),
        stops,
        totalTravelMins: stops.length * 20,
        totalVisitMins: stops.length * 90,
        totalCost: Math.round((pkg.startingPrice || 5000) / pkg.durationDays),
        finishTime: '06:00 PM'
      };
    });

    return res.json({
      destinationId: pkg.destinationId,
      solver: 'Algorithmic Sequence Planner (ExploreX Heuristic Engine)',
      numDays: pkg.durationDays,
      maxHoursPerDay: 8,
      startTime: '09:00 AM',
      days,
      grandTotalCost: pkg.startingPrice || 5000,
      grandTotalTravelMins: days.reduce((acc, d) => acc + d.totalTravelMins, 0)
    });
  }
});

// 2. India Culture & Specialty Discovery Search
apiRouter.get('/culture/search', (req: Request, res: Response) => {
  try {
    const { q, category, state } = req.query;
    const items = searchCulturalSpecialties(
      q as string, 
      category as string, 
      state as string
    );
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error searching cultural specialties' });
  }
});

// 3. India Travel Explorer State -> Region -> District Hierarchy
apiRouter.get('/culture/hierarchy', (req: Request, res: Response) => {
  try {
    const hierarchy = getIndiaExplorerHierarchy();
    res.json(hierarchy);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error retrieving hierarchy' });
  }
});

// 4. AI Hidden Gem Alternatives Dispenser
apiRouter.get('/destinations/:id/alternatives', (req: Request, res: Response) => {
  try {
    const data = getAlternativeRecommendations(req.params.id);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error finding alternatives' });
  }
});

// 5. Destination Best Time & Timing Engine
apiRouter.get('/destinations/:id/best-time', (req: Request, res: Response) => {
  const dest = db.getDestinationById(req.params.id);
  if (!dest) return res.status(404).json({ error: 'Destination not found' });
  res.json({
    destinationId: dest.id,
    destinationName: dest.name,
    bestMonths: dest.bestMonths,
    currentWeather: dest.currentWeather,
    crowdPrediction: dest.crowdPrediction,
    bestTimeEngine: dest.bestTimeEngine
  });
});

// 6. Destination Local Economy & Impact Directory
apiRouter.get('/destinations/:id/local-economy', (req: Request, res: Response) => {
  const dest = db.getDestinationById(req.params.id);
  if (!dest) return res.status(404).json({ error: 'Destination not found' });
  res.json({
    destinationId: dest.id,
    destinationName: dest.name,
    localImpactScore: dest.localEconomy?.localImpactScore || dest.sustainabilityScore || 90,
    localEconomicRetentionPct: dest.localEconomicRetentionPct || 85,
    localEconomy: dest.localEconomy
  });
});

// 7. Razorpay Payment Gateway & Server-Side Price Calculation APIs
apiRouter.post('/payments/create-intent', createPaymentIntentHandler);
apiRouter.post('/payments/verify', verifyRazorpayPayment);
apiRouter.post('/payments/webhook', razorpayWebhookHandler);

// Legacy route compatibility
apiRouter.post('/razorpay/create-order', createRazorpayOrder);
apiRouter.post('/razorpay/verify-payment', verifyRazorpayPayment);
apiRouter.post('/razorpay/webhook', razorpayWebhookHandler);

// 8. Database Health, Status, and Sync Endpoints
apiRouter.get('/database/status', async (_req: Request, res: Response) => {
  try {
    const status = await databaseService.getStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch database status' });
  }
});

apiRouter.post('/database/sync', async (_req: Request, res: Response) => {
  try {
    const result = await databaseService.syncToSupabase();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to synchronize database' });
  }
});

apiRouter.post('/database/seed', async (_req: Request, res: Response) => {
  try {
    const result = await databaseService.seedDatabase();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to seed database' });
  }
});




