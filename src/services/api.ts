import { 
  Destination, 
  ExplorePOI,
  TravelPackage, 
  UserProfile, 
  Booking, 
  ExplorerRide, 
  ExplorerVehicleOption, 
  MagicMomentAlbum, 
  MagicMomentPhoto, 
  Review, 
  WalletTransaction, 
  GroupTrip, 
  SettlementDebt,
  WhatIfSimulationResult,
  DynamicPriceResponse,
  OptimizedItineraryResponse,
  AIChatResponse,
  AdminAuditLog,
  AdminAnalyticsSummary,
  AdminUserSummary,
  AdminUserDetail
} from '../types';

const envApiUrl = (typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '') : '').trim();
export const API_ROOT = envApiUrl ? envApiUrl.replace(/\/+$/, '') : '';
export const API_BASE = `${API_ROOT}/api/v1`;

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('explorex_auth_token');

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options?.headers || {})
    }
  });

  if (!res.ok) {
    let errMsg = `Request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.error) errMsg = errJson.error;
    } catch {}
    throw new Error(errMsg);
  }

  return res.json();
}

export const api = {
  // Auth & Profile
  login: (email: string, password: string) => 
    request<{ token: string; user: UserProfile }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (name: string, email: string, password: string) => 
    request<{ token: string; user: UserProfile }>('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  logout: () => 
    request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),
  forgotPassword: (email: string) => 
    request<{ success: boolean; message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  getSession: () => 
    request<{ authenticated: boolean; user: UserProfile | null }>('/auth/session'),
  getProfile: () => 
    request<UserProfile>('/auth/profile'),
  updateProfile: (updates: Partial<UserProfile>) => 
    request<UserProfile>('/auth/profile', { method: 'PUT', body: JSON.stringify(updates) }),
  updatePreferences: (preferences: UserProfile['preferences']) => 
    request<UserProfile>('/auth/preferences', { method: 'POST', body: JSON.stringify({ preferences }) }),
  toggleSaveDestination: (destinationId: string) => 
    request<UserProfile>('/auth/toggle-save-destination', { method: 'POST', body: JSON.stringify({ destinationId }) }),
  toggleSavePackage: (packageId: string) => 
    request<UserProfile>('/auth/toggle-save-package', { method: 'POST', body: JSON.stringify({ packageId }) }),
  deleteAccount: () => 
    request<{ success: boolean; message: string }>('/auth/account', { method: 'DELETE' }),

  // Destinations
  getDestinations: (params?: { search?: string; vibe?: string; type?: 'all' | 'domestic' | 'international' }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.vibe && params.vibe !== 'all') query.set('vibe', params.vibe);
    if (params?.type && params.type !== 'all') query.set('type', params.type);
    return request<Destination[]>(`/destinations?${query.toString()}`);
  },
  getDestinationById: (id: string) => 
    request<Destination>(`/destinations/${id}`),
  createDestination: (dest: Partial<Destination>) => 
    request<Destination>('/destinations', { method: 'POST', body: JSON.stringify(dest) }),
  updateDestination: (id: string, updates: Partial<Destination>) => 
    request<Destination>(`/destinations/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteDestination: (id: string) => 
    request<{ success: boolean }>(`/destinations/${id}`, { method: 'DELETE' }),

  // Explore POIs & Spatial Engine
  getExplorePOIs: (params?: {
    destinationId?: string;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: string;
    isOffbeat?: boolean;
    isPopular?: boolean;
  }) => {
    const query = new URLSearchParams();
    if (params?.destinationId) query.set('destinationId', params.destinationId);
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
    if (params?.minRating !== undefined) query.set('minRating', params.minRating.toString());
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    if (params?.isOffbeat !== undefined) query.set('isOffbeat', params.isOffbeat.toString());
    if (params?.isPopular !== undefined) query.set('isPopular', params.isPopular.toString());
    return request<ExplorePOI[]>(`/explore?${query.toString()}`);
  },
  getExploreCategories: () => 
    request<{ id: string; label: string; icon: string }[]>('/explore/categories'),
  getWhatsFamous: (destinationId: string) => 
    request<any>(`/explore/whats-famous/${destinationId}`),

  // Packages
  getPackages: (params?: { destinationId?: string; theme?: string; maxPrice?: number; search?: string; isFeatured?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.destinationId) query.set('destinationId', params.destinationId);
    if (params?.theme && params.theme !== 'all') query.set('theme', params.theme);
    if (params?.maxPrice) query.set('maxPrice', params.maxPrice.toString());
    if (params?.search) query.set('search', params.search);
    if (params?.isFeatured !== undefined) query.set('isFeatured', params.isFeatured.toString());
    return request<TravelPackage[]>(`/packages?${query.toString()}`);
  },
  getPackageById: (id: string) => 
    request<TravelPackage>(`/packages/${id}`),
  comparePackages: (packageIds: string[]) => 
    request<TravelPackage[]>('/packages/compare', { method: 'POST', body: JSON.stringify({ packageIds }) }),
  createPackage: (pkg: Partial<TravelPackage>) => 
    request<TravelPackage>('/packages', { method: 'POST', body: JSON.stringify(pkg) }),
  updatePackage: (id: string, updates: Partial<TravelPackage>) => 
    request<TravelPackage>(`/packages/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deletePackage: (id: string) => 
    request<{ success: boolean }>(`/packages/${id}`, { method: 'DELETE' }),
  seedPackages: () => 
    request<{ success: boolean; message: string; supabaseSynced: boolean }>('/packages/seed', { method: 'POST' }),

  // The Explorer
  getExplorerVehicles: () => 
    request<ExplorerVehicleOption[]>('/explorer/vehicles'),
  getFareEstimate: (body: { pickupCoords: { lat: number; lng: number }; dropCoords: { lat: number; lng: number }; vehicleType: string }) => 
    request<{ distanceKm: number; fare: number; durationMins: number; etaMins: number; vehicle: ExplorerVehicleOption }>('/explorer/fare-estimate', { method: 'POST', body: JSON.stringify(body) }),
  bookRide: (body: any) => 
    request<ExplorerRide>('/explorer/book', { method: 'POST', body: JSON.stringify(body) }),
  getRides: () => 
    request<ExplorerRide[]>('/explorer/rides'),
  getRideById: (id: string) => 
    request<ExplorerRide>(`/explorer/rides/${id}`),
  advanceRideStatus: (id: string) => 
    request<ExplorerRide>(`/explorer/rides/${id}/status-advance`, { method: 'POST' }),
  cancelRide: (id: string) => 
    request<{ success: boolean; ride: ExplorerRide }>(`/explorer/rides/${id}/cancel`, { method: 'POST' }),

  // Bookings
  getBookings: () => 
    request<Booking[]>('/bookings'),
  getBookingById: (id: string) => 
    request<Booking>(`/bookings/${id}`),
  createBooking: (bookingData: any) => 
    request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  cancelBooking: (id: string) => 
    request<{ booking: Booking; refundAmount: number }>(`/bookings/${id}/cancel`, { method: 'POST' }),

  // Magic Moments
  getAlbums: () => 
    request<MagicMomentAlbum[]>('/moments/albums'),
  createAlbum: (body: { title: string; destinationName?: string; tripStartDate?: string; tripEndDate?: string }) => 
    request<MagicMomentAlbum>('/moments/albums', { method: 'POST', body: JSON.stringify(body) }),
  deleteAlbum: (id: string) => 
    request<{ success: boolean }>('/moments/albums/' + id, { method: 'DELETE' }),
  getPhotos: (albumId: string) => 
    request<MagicMomentPhoto[]>(`/moments/albums/${albumId}/photos`),
  getStorageUsage: () => 
    request<{ usedBytes: number; quotaBytes: number; percentage: number }>('/moments/usage'),
  getStorageQuota: () => 
    request<{ usedBytes: number; quotaBytes: number; percentage: number }>('/moments/usage'),
  uploadPhoto: async (formData: FormData) => {
    const res = await fetch(`${API_BASE}/moments/upload`, {
      method: 'POST',
      headers: {
        'x-user-id': 'usr-current'
      },
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload image');
    }
    return res.json() as Promise<MagicMomentPhoto>;
  },
  deletePhoto: (id: string) => 
    request<{ success: boolean }>(`/moments/photos/${id}`, { method: 'DELETE' }),
  enhancePhoto: (photoId: string, style: string) => 
    request<{ success: boolean; filterApplied: string; enhancedUrl: string }>('/moments/enhance', { method: 'POST', body: JSON.stringify({ photoId, style }) }),

  // Reviews
  getReviews: (targetType?: string, targetId?: string) => {
    const q = new URLSearchParams();
    if (targetType) q.set('targetType', targetType);
    if (targetId) q.set('targetId', targetId);
    return request<Review[]>(`/reviews?${q.toString()}`);
  },
  createReview: (reviewData: Partial<Review>) => 
    request<Review>('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
  updateReview: (id: string, updates: Partial<Review>) => 
    request<Review>(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteReview: (id: string) => 
    request<{ success: boolean }>(`/reviews/${id}`, { method: 'DELETE' }),

  // Wallet
  getWallet: () => 
    request<{ balance: number; transactions: WalletTransaction[] }>('/wallet'),
  getWalletTransactions: async () => {
    const res = await request<{ balance: number; transactions: WalletTransaction[] }>('/wallet');
    return res.transactions || [];
  },
  topupWallet: (amount: number, method?: string) => 
    request<{ user: UserProfile; transaction: WalletTransaction }>('/wallet/topup', { method: 'POST', body: JSON.stringify({ amount, method }) }),

  // Group Expenses
  getGroupTrips: () => 
    request<GroupTrip[]>('/expenses/groups'),
  getGroupTripById: (id: string) => 
    request<{ trip: GroupTrip; settlement: { balances: Record<string, number>; settlements: SettlementDebt[] } }>(`/expenses/groups/${id}`),
  createGroupTrip: (body: { title?: string; name?: string; destinationName?: string; members?: any[] }) => 
    request<GroupTrip>('/expenses/groups', { method: 'POST', body: JSON.stringify({ title: body.title || body.name || 'Group Trip', destinationName: body.destinationName, members: body.members }) }),
  addExpense: (groupId: string, expenseData: any) => 
    request<{ trip: GroupTrip; settlement: any }>(`/expenses/groups/${groupId}/expenses`, { method: 'POST', body: JSON.stringify(expenseData) }),
  addGroupExpense: (groupId: string, expenseData: any) => 
    request<{ trip: GroupTrip; settlement: any }>(`/expenses/groups/${groupId}/expenses`, { method: 'POST', body: JSON.stringify(expenseData) }),
  deleteExpense: (groupId: string, expenseId: string) => 
    request<{ trip: GroupTrip; settlement: any }>(`/expenses/groups/${groupId}/expenses/${expenseId}`, { method: 'DELETE' }),
  settleGroupDebt: (groupId: string, debtorId: string, creditorId: string, amount: number) => 
    request<{ trip: GroupTrip; settlement: any }>(`/expenses/groups/${groupId}/settle`, { method: 'POST', body: JSON.stringify({ debtorId, creditorId, amount }) }),

  // AI Services
  askAssistant: (message: string, destinationId?: string, history?: any[], tripContext?: any) => 
    request<AIChatResponse>('/assistant/chat', { method: 'POST', body: JSON.stringify({ message, destinationId, conversation: history, tripContext }) }),
  askAIChat: (options: any, destinationId?: string, history?: any[]) => {
    if (typeof options === 'object' && options !== null) {
      return request<AIChatResponse>('/assistant/chat', { method: 'POST', body: JSON.stringify(options) });
    }
    return request<AIChatResponse>('/assistant/chat', { method: 'POST', body: JSON.stringify({ message: options, destinationId, conversation: history }) });
  },
  chatWithAssistant: (payload: { message: string; conversation?: any[]; tripContext?: any; destinationId?: string }) =>
    request<AIChatResponse>('/assistant/chat', { method: 'POST', body: JSON.stringify(payload) }),
  generateItinerary: (params: any) => 
    request<any>('/ai/generate-itinerary', { method: 'POST', body: JSON.stringify(params) }),
  validateItinerary: (itinerary: any) => 
    request<any>('/ai/validate-itinerary', { method: 'POST', body: JSON.stringify(itinerary) }),
  adaptItinerary: (payload: { destinationName: string; trigger?: string; customProblemDescription?: string; currentItinerary?: any; itinerary?: any; destinationId?: string }) =>
    request<any>('/itinerary/adapt', { method: 'POST', body: JSON.stringify(payload) }),
  autopilotReplan: (destinationName: string, trigger?: string, currentSchedule?: string[]) => 
    request<any>('/itinerary/adapt', { method: 'POST', body: JSON.stringify({ destinationName, trigger, currentSchedule }) }),
  runTripAutopilot: (options: any, trigger?: string, currentSchedule?: string[]) => {
    if (typeof options === 'object' && options !== null) {
      return request<any>('/itinerary/adapt', { method: 'POST', body: JSON.stringify({
        destinationName: options.destination || options.destinationName,
        trigger: options.disruption || options.trigger,
        customProblemDescription: options.customProblemDescription,
        currentItinerary: options.currentItinerary || options.itinerary,
        currentSchedule: options.currentSchedule
      }) });
    }
    return request<any>('/itinerary/adapt', { method: 'POST', body: JSON.stringify({ destinationName: options, trigger, currentSchedule }) });
  },
  runWhatIf: (scenario: string, destinationName: string, baseBudget?: number, groupSize?: number, durationDays?: number) => 
    request<WhatIfSimulationResult>('/ai/what-if', { method: 'POST', body: JSON.stringify({ scenario, destinationName, baseBudget, groupSize, durationDays }) }),
  simulateWhatIf: (options: any, destinationName?: string, baseBudget?: number, groupSize?: number, durationDays?: number) => {
    if (typeof options === 'object' && options !== null) {
      return request<WhatIfSimulationResult>('/ai/what-if', { method: 'POST', body: JSON.stringify({
        scenario: options.scenario,
        destinationName: options.destination || options.destinationName,
        baseBudget: options.budget || options.baseBudget,
        groupSize: options.groupSize,
        durationDays: options.durationDays
      }) });
    }
    return request<WhatIfSimulationResult>('/ai/what-if', { method: 'POST', body: JSON.stringify({ scenario: options, destinationName, baseBudget, groupSize, durationDays }) });
  },
  updateTravelDNA: (answers: Record<string, number>) => 
    request<UserProfile['travelDNA']>('/ai/travel-dna', { method: 'POST', body: JSON.stringify({ answers }) }),
  getContextualSuggestions: (destinationId?: string) => 
    request<any[]>(`/ai/contextual-suggestions?destinationId=${destinationId || ''}`),

  // Weather Services
  getWeather: (params?: { destination?: string; lat?: number; lng?: number }) => {
    const q = new URLSearchParams();
    if (params?.destination) q.set('destination', params.destination);
    if (params?.lat !== undefined) q.set('lat', params.lat.toString());
    if (params?.lng !== undefined) q.set('lng', params.lng.toString());
    return request<any>(`/weather?${q.toString()}`);
  },
  searchWeatherLocations: (query: string) => {
    const q = new URLSearchParams();
    q.set('q', query);
    return request<Array<{ name: string; state?: string; lat: number; lng: number }>>(`/weather/search?${q.toString()}`);
  },

  // Admin & Security Management (Protected by Server-Side Admin Authorization)
  verifyAdmin: () => 
    request<{ verified: boolean; admin: any; system: any }>('/admin/verify'),
  getAdminAnalytics: () => 
    request<AdminAnalyticsSummary>('/admin/analytics'),
  getAdminStats: () => 
    request<AdminAnalyticsSummary>('/admin/analytics'),
  getAdminUsers: (q?: string) => 
    request<{ users: AdminUserSummary[]; total: number }>(`/admin/users${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  getAdminUserDetail: (userId: string) => 
    request<AdminUserDetail>(`/admin/users/${userId}`),
  getAdminBookings: (filters?: {
    search?: string;
    serviceType?: string;
    status?: string;
    paymentStatus?: string;
    emailStatus?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          params.append(k, String(v));
        }
      });
    }
    return request<{ bookings: Booking[]; total: number; page: number; limit: number; totalPages: number }>(`/admin/bookings?${params.toString()}`);
  },
  getAdminBookingDetail: (bookingId: string) => 
    request<Booking>(`/admin/bookings/${bookingId}`),
  adminUpdateBookingStatus: (bookingId: string, status: string, note?: string) => 
    request<{ success: boolean; booking: Booking }>(`/admin/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note })
    }),
  adminCancelBooking: (bookingId: string, reason?: string) => 
    request<{ success: boolean; message: string; booking: Booking; refundAmount: number }>(`/admin/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    }),
  adminResendBookingEmail: (bookingId: string, recipientEmail?: string) => 
    request<{ success: boolean; message: string; booking: Booking }>(`/admin/bookings/${bookingId}/resend-email`, {
      method: 'POST',
      body: JSON.stringify({ recipientEmail })
    }),
  getAdminReviews: (params?: { q?: string; rating?: number }) => {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.rating) query.append('rating', String(params.rating));
    return request<{ reviews: Review[]; total: number }>(`/admin/reviews?${query.toString()}`);
  },
  adminDeleteReview: (reviewId: string) => 
    request<{ success: boolean; message: string }>(`/admin/reviews/${reviewId}`, { method: 'DELETE' }),
  getAdminAuditLogs: (limit = 100) => 
    request<{ auditLogs: AdminAuditLog[]; total: number }>(`/admin/audit-logs?limit=${limit}`),
  getOffers: () => 
    request<any[]>('/admin/offers'),
  resetDatabase: () => 
    request<{ success: boolean; message: string }>('/admin/reset-db', { method: 'POST' }),
  getExportBookingsUrl: () => {
    const token = localStorage.getItem('explorex_auth_token');
    return `${API_BASE}/admin/export/bookings${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  },

  // India Demand Balancer & Culture Engine
  balanceTourismDemand: (query: any) =>
    request<any[]>('/ai/demand-balancer', { method: 'POST', body: JSON.stringify(query) }),
  searchCulturalSpecialties: (params?: { q?: string; category?: string; state?: string }) => {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.category) query.append('category', params.category);
    if (params?.state) query.append('state', params.state);
    return request<any[]>(`/culture/search?${query.toString()}`);
  },
  getIndiaHierarchy: () =>
    request<any>('/culture/hierarchy'),
  getDestinationAlternatives: (destIdOrName: string) =>
    request<any>(`/destinations/${destIdOrName}/alternatives`),
  getDestinationBestTime: (destId: string) =>
    request<any>(`/destinations/${destId}/best-time`),
  getDestinationLocalEconomy: (destId: string) =>
    request<any>(`/destinations/${destId}/local-economy`),

  // ML Service Endpoints
  getDynamicPrice: (destinationId: string, params?: { date?: string }) => {
    const query = new URLSearchParams();
    if (params?.date) query.set('date', params.date);
    return request<DynamicPriceResponse>(`/destinations/${destinationId}/dynamic-price?${query.toString()}`);
  },
  optimizeItinerary: (packageId: string, body?: { numDays?: number; maxHoursPerDay?: number; categoryPreferences?: string[] }) =>
    request<OptimizedItineraryResponse>(`/packages/${packageId}/optimize-itinerary`, { method: 'POST', body: JSON.stringify(body || {}) }),

  // Razorpay & Server-Side Payment Integration
  createPaymentIntent: (params: any) =>
    request<{
      success: boolean;
      bookingId: string;
      paymentId: string;
      keyId: string;
      orderId: string;
      amountInPaise: number;
      amountInINR: number;
      currency: string;
      grandTotalINR: number;
    }>('/payments/create-intent', { method: 'POST', body: JSON.stringify(params) }),
  verifyPaymentIntent: (details: { bookingId: string; razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    request<{ verified: boolean; bookingStatus: 'confirmed' | 'pending_reconciliation' | 'failed'; booking?: any; message: string }>('/payments/verify', { method: 'POST', body: JSON.stringify(details) }),
  createRazorpayOrder: (amount: number, currency = 'INR', receipt?: string) =>
    request<{ success: boolean; keyId: string; order: any }>('/razorpay/create-order', { method: 'POST', body: JSON.stringify({ amount, currency, receipt }) }),
  verifyRazorpayPayment: (details: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; bookingId?: string }) =>
    request<{ verified: boolean; message: string; paymentId?: string; orderId?: string; bookingStatus?: string }>('/payments/verify', { method: 'POST', body: JSON.stringify(details) }),
  resendBookingEmail: (bookingId: string, email?: string) =>
    request<{ success: boolean; message: string; recipient: string }>(`/bookings/${bookingId}/resend-email`, { method: 'POST', body: JSON.stringify({ email }) }),

  // Database Management
  getDatabaseStatus: () =>
    request<{
      connected: boolean;
      provider: 'supabase' | 'local_store';
      supabaseConfigured: boolean;
      supabaseUrl: string | null;
      latencyMs: number;
      tables: { name: string; count: number; synced: boolean; status: string }[];
      summary: { totalDestinations: number; totalPOIs: number; totalPackages: number; totalBookings: number; totalUsers: number; totalReviews: number };
      lastSyncAt: string | null;
    }>('/database/status'),
  syncDatabase: () =>
    request<{ success: boolean; message: string; syncedRecords: Record<string, number> }>('/database/sync', { method: 'POST' }),
  seedDatabase: () =>
    request<{ success: boolean; count: number }>('/database/seed', { method: 'POST' }),

  // Traveler Safety & Emergency Hub
  getSafetyProfile: (userId?: string) =>
    request<any>('/safety/profile', {
      headers: userId ? { 'x-user-id': userId } : {}
    }),
  updateSafetyProfile: (profile: any, userId?: string) =>
    request<any>('/safety/profile', {
      method: 'PUT',
      headers: userId ? { 'x-user-id': userId } : {},
      body: JSON.stringify(profile)
    }),
  getSafetyAlerts: (params: { destination: string; lat?: number; lng?: number; travelMode?: string }) => {
    const q = new URLSearchParams();
    q.set('destination', params.destination);
    if (params.lat !== undefined) q.set('lat', params.lat.toString());
    if (params.lng !== undefined) q.set('lng', params.lng.toString());
    if (params.travelMode) q.set('travelMode', params.travelMode);
    return request<any[]>(`/safety/alerts?${q.toString()}`);
  },
  getGroupSafetyStatus: (userId?: string) =>
    request<any[]>('/safety/group-status', {
      headers: userId ? { 'x-user-id': userId } : {}
    }),
  triggerSOS: (payload: { alertType: string; customNote?: string; location?: { lat: number; lng: number; accuracyMeters?: number }; activeDestination?: string }, userId?: string) =>
    request<any>('/safety/sos', {
      method: 'POST',
      headers: userId ? { 'x-user-id': userId } : {},
      body: JSON.stringify(payload)
    }),
  resolveSOS: (payload?: { alertId?: string; resolutionNote?: string }, userId?: string) =>
    request<any>('/safety/sos/resolve', {
      method: 'POST',
      headers: userId ? { 'x-user-id': userId } : {},
      body: JSON.stringify(payload || {})
    }),
  safetyCheckIn: (payload: { checkInStatus: string; currentZone?: string; activeDestination?: string; location?: { lat: number; lng: number; accuracyMeters?: number } }, userId?: string) =>
    request<any>('/safety/checkin', {
      method: 'POST',
      headers: userId ? { 'x-user-id': userId } : {},
      body: JSON.stringify(payload)
    }),
  sendEmergencyContactAlert: (payload: { contactName: string; contactPhone: string; relationship: string; message: string; activeDestination?: string }, userId?: string) =>
    request<any>('/safety/contact-alert', {
      method: 'POST',
      headers: userId ? { 'x-user-id': userId } : {},
      body: JSON.stringify(payload)
    }),
};


