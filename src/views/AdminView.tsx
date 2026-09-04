import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck,
  TrendingUp, 
  Users, 
  MapPin, 
  Package, 
  ShoppingBag, 
  Tag, 
  Plus, 
  Trash2, 
  RotateCcw, 
  DollarSign, 
  CheckCircle2, 
  X,
  AlertTriangle,
  Lock,
  FileSpreadsheet,
  RefreshCw,
  MessageSquare,
  FileText,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { 
  Destination, 
  TravelPackage, 
  Booking, 
  AdminAnalyticsSummary,
  AdminUserSummary,
  AdminUserDetail,
  AdminAuditLog,
  Review
} from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../utils/currency';
import { NavTab } from '../components/Navbar';

import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminBookingsTab } from '../components/admin/AdminBookingsTab';
import { AdminBookingDetailModal } from '../components/admin/AdminBookingDetailModal';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { AdminUserDetailModal } from '../components/admin/AdminUserDetailModal';
import { AdminReviewsTab } from '../components/admin/AdminReviewsTab';
import { AdminAuditLogsTab } from '../components/admin/AdminAuditLogsTab';

interface AdminViewProps {
  onNavigate?: (tab: NavTab) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { success, error } = useToast();

  // Server-Side Authorization State (Strictly enforced by Supabase Auth + RLS/RBAC)
  const [authStatus, setAuthStatus] = useState<'checking' | 'authorized' | 'forbidden'>('checking');
  const [authErrorReason, setAuthErrorReason] = useState<string>('');
  const [adminProfile, setAdminProfile] = useState<any>(null);

  // Active Tab
  const [adminTab, setAdminTab] = useState<'overview' | 'bookings' | 'users' | 'reviews' | 'audit' | 'catalog'>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Data States
  const [analytics, setAnalytics] = useState<AdminAnalyticsSummary | null>(null);
  const [recentAuditLogs, setRecentAuditLogs] = useState<AdminAuditLog[]>([]);
  const [allAuditLogs, setAllAuditLogs] = useState<AdminAuditLog[]>([]);
  
  // Bookings State & Pagination
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [bookingPage, setBookingPage] = useState<number>(1);
  const [bookingTotalPages, setBookingTotalPages] = useState<number>(1);
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [emailStatusFilter, setEmailStatusFilter] = useState<string>('');

  // Users Directory State
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [userSearch, setUserSearch] = useState<string>('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUserDetail | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSearch, setReviewSearch] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  // Inspect Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Catalog State (Destinations, Packages, Offers)
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [offers, setOffers] = useState<any[]>([]);

  // New Destination Form state
  const [newDestModalOpen, setNewDestModalOpen] = useState(false);
  const [destName, setDestName] = useState('');
  const [destCountry, setDestCountry] = useState('Switzerland');
  const [destTagline, setDestTagline] = useState('Alpine peaks and crystal lakes');
  const [destPrice, setDestPrice] = useState(62500);
  const [destImage, setDestImage] = useState('https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80');

  /**
   * 1. MANDATORY SERVER-SIDE AUTHORIZATION HANDSHAKE
   * Never relies on frontend flags or client-supplied role claims.
   * Calls GET /api/v1/admin/verify which inspects the Supabase JWT and checks authorization.
   */
  const verifyServerAdmin = useCallback(async () => {
    setAuthStatus('checking');
    setAuthErrorReason('');
    try {
      const res = await api.verifyAdmin();
      if (res.verified) {
        setAuthStatus('authorized');
        setAdminProfile(res.admin);
      } else {
        setAuthStatus('forbidden');
        setAuthErrorReason('Server returned unauthorized status.');
      }
    } catch (err: any) {
      setAuthStatus('forbidden');
      setAuthErrorReason(err.message || '403 Forbidden: Administrator role verification failed on server.');
    }
  }, []);

  useEffect(() => {
    verifyServerAdmin();
  }, [verifyServerAdmin, user]);

  /**
   * 2. Load Core Admin Datasets once server-side clearance is confirmed.
   */
  const loadDashboardData = useCallback(async () => {
    if (authStatus !== 'authorized') return;
    setIsLoading(true);
    try {
      const [analyticsData, logsData, destList, pkgList, offersList] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminAuditLogs(100),
        api.getDestinations(),
        api.getPackages(),
        api.getOffers()
      ]);
      setAnalytics(analyticsData);
      setAllAuditLogs(logsData.auditLogs || []);
      setRecentAuditLogs(logsData.auditLogs?.slice(0, 10) || []);
      setDestinations(destList);
      setPackages(pkgList);
      setOffers(offersList);
    } catch (err: any) {
      error('Data Fetch Error', err.message || 'Could not load administrative telemetry');
    } finally {
      setIsLoading(false);
    }
  }, [authStatus, error]);

  useEffect(() => {
    if (authStatus === 'authorized') {
      loadDashboardData();
    }
  }, [authStatus, loadDashboardData]);

  /**
   * 3. Load Bookings with Filters & Pagination
   */
  const loadBookings = useCallback(async () => {
    if (authStatus !== 'authorized') return;
    try {
      const res = await api.getAdminBookings({
        search: bookingSearch || undefined,
        serviceType: serviceFilter || undefined,
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        emailStatus: emailStatusFilter || undefined,
        page: bookingPage,
        limit: 12
      });
      setBookings(res.bookings || []);
      setTotalBookings(res.total || 0);
      setBookingTotalPages(res.totalPages || 1);
    } catch (err: any) {
      console.error('Failed to load bookings:', err);
    }
  }, [authStatus, bookingSearch, serviceFilter, statusFilter, paymentStatusFilter, emailStatusFilter, bookingPage]);

  useEffect(() => {
    if (authStatus === 'authorized') {
      loadBookings();
    }
  }, [authStatus, loadBookings]);

  /**
   * 4. Load Users Directory
   */
  const loadUsers = useCallback(async () => {
    if (authStatus !== 'authorized') return;
    try {
      const res = await api.getAdminUsers(userSearch || undefined);
      setUsers(res.users || []);
    } catch (err: any) {
      console.error('Failed to load users:', err);
    }
  }, [authStatus, userSearch]);

  useEffect(() => {
    if (authStatus === 'authorized') {
      loadUsers();
    }
  }, [authStatus, loadUsers]);

  /**
   * 5. Load Reviews for Moderation
   */
  const loadReviews = useCallback(async () => {
    if (authStatus !== 'authorized') return;
    try {
      const res = await api.getAdminReviews({
        q: reviewSearch || undefined,
        rating: ratingFilter || undefined
      });
      setReviews(res.reviews || []);
    } catch (err: any) {
      console.error('Failed to load reviews:', err);
    }
  }, [authStatus, reviewSearch, ratingFilter]);

  useEffect(() => {
    if (authStatus === 'authorized') {
      loadReviews();
    }
  }, [authStatus, loadReviews]);

  // Actions
  const handleInspectUser = async (userId: string) => {
    try {
      const detail = await api.getAdminUserDetail(userId);
      setSelectedUserDetail(detail);
    } catch (err: any) {
      error('User Detail Error', err.message || 'Could not fetch user profile');
    }
  };

  const handleUpdateBookingStatus = async (id: string, newStatus: string, note?: string) => {
    try {
      const res = await api.adminUpdateBookingStatus(id, newStatus, note);
      success('Status Updated', `Booking #${id} status changed to ${newStatus}.`);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(res.booking);
      }
      loadBookings();
      loadDashboardData();
    } catch (err: any) {
      error('Update Failed', err.message);
    }
  };

  const handleCancelAndRefundBooking = async (id: string, reason: string) => {
    try {
      const res = await api.adminCancelBooking(id, reason);
      success('Refund Issued', res.message);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(res.booking);
      }
      loadBookings();
      loadDashboardData();
    } catch (err: any) {
      error('Refund Failed', err.message);
    }
  };

  const handleResendBookingEmail = async (id: string, recipientEmail?: string) => {
    try {
      const res = await api.adminResendBookingEmail(id, recipientEmail);
      success('Email Dispatched', res.message);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(res.booking);
      }
      loadBookings();
    } catch (err: any) {
      error('Email Error', err.message);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const res = await api.adminDeleteReview(reviewId);
      success('Review Removed', res.message);
      loadReviews();
      loadDashboardData();
    } catch (err: any) {
      error('Moderation Error', err.message);
    }
  };

  const handleExportBookingsCsv = () => {
    const token = localStorage.getItem('explorex_auth_token');
    window.open(`/api/v1/admin/export/bookings${token ? `?token=${encodeURIComponent(token)}` : ''}`, '_blank');
    success('Export Triggered', 'Downloading sanitized bookings reconciliation CSV.');
  };

  const handleCreateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createDestination({
        name: destName,
        stateOrRegion: destCountry,
        country: destCountry,
        tagline: destTagline,
        description: `${destName} in ${destCountry} offers majestic views and luxury travel experiences.`,
        startingPrice: destPrice,
        heroImage: destImage,
        galleryImages: [destImage],
        isInternational: true,
        vibe: ['nature', 'mountain'],
        lat: 46.8182,
        lng: 8.2275,
        currentWeather: { 
          tempC: 18, 
          condition: 'Clear Alpine', 
          icon: 'Sun', 
          forecast: 'Sunny and cool alpine weather', 
          airQualityIndex: 22 
        },
        safetyScore: { 
          overall: 96, 
          daySafety: 98, 
          nightSafety: 95, 
          emergencyContact: '112 (Emergency)', 
          advisory: 'Safe and peaceful alpine destination' 
        },
        crowdPrediction: { 
          currentStatus: 'Low', 
          peakHours: '12:00 PM - 02:00 PM', 
          quietHours: '08:00 AM - 10:00 AM', 
          recommendation: 'Visit early for quiet views.' 
        },
        bestMonths: ['June', 'July', 'August', 'September'],
        popularAttractions: [],
        localCuisines: ['Alpine Fondue', 'Swiss Chocolate'],
        rating: 4.9,
        reviewCount: 1
      });

      setDestinations(prev => [created, ...prev]);
      setNewDestModalOpen(false);
      setDestName('');
      success('Destination Created', `Added ${created.name} to global catalogue.`);
    } catch (err: any) {
      error('Creation Error', err.message);
    }
  };

  const handleDeleteDestination = async (id: string) => {
    try {
      await api.deleteDestination(id);
      setDestinations(prev => prev.filter(d => d.id !== id));
      success('Destination Removed', 'Deleted from destination inventory.');
    } catch (err: any) {
      error('Delete Error', err.message);
    }
  };

  const handleResetDatabase = async () => {
    if (confirm('Are you sure you want to reset all database stores back to initial seeds? This action is audited.')) {
      try {
        await api.resetDatabase();
        await loadDashboardData();
        await loadBookings();
        success('Database Restored', 'Reset data_store.json to clean baseline state.');
      } catch (err: any) {
        error('Reset Error', err.message);
      }
    }
  };

  /* ============================================================
     RENDER: 1. CHECKING CLEARANCE STATE
     ============================================================ */
  if (authStatus === 'checking') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto border border-stone-200">
          <RefreshCw className="w-6 h-6 text-stone-700 animate-spin" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-stone-900">Verifying Administrative Clearance</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Authenticating credentials against server-side Supabase Auth and Row Level Security permissions...
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     RENDER: 2. 403 FORBIDDEN / ACCESS DENIED STATE
     Strictly enforced: no data or UI tabs are rendered for non-admins.
     ============================================================ */
  if (authStatus === 'forbidden') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-700 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-mono font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            HTTP 403 • Access Strictly Prohibited
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Restricted Operations Console
          </h2>

          <p className="text-xs text-stone-600 max-w-lg mx-auto leading-relaxed">
            Administrative endpoints and business intelligence records are protected by server-side authorization and Row Level Security policies. Non-administrative sessions are completely blocked from viewing or managing client data.
          </p>

          {/* Session Diagnostic Dossier */}
          <div className="max-w-md mx-auto bg-stone-50 p-4 rounded-xl border border-stone-200 text-left text-xs space-y-2 mt-4">
            <div className="text-[10px] uppercase font-bold text-stone-400">Caller Authentication Context:</div>
            <div className="grid grid-cols-2 gap-2 text-stone-700">
              <div>Email: <strong className="text-stone-900">{user?.email || 'Unauthenticated'}</strong></div>
              <div>Detected Role: <strong className="text-rose-700 uppercase">{user?.role || 'Guest'}</strong></div>
            </div>
            <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500">
              Authorized Administrator account: <code className="text-stone-800 font-mono font-bold">explorexsih0426@gmail.com</code>.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('login')}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Authenticate as Admin
          </button>

          <button
            onClick={() => onNavigate ? onNavigate('explore') : (window.location.href = '/')}
            className="px-5 py-2.5 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold rounded-xl border border-stone-300 transition cursor-pointer"
          >
            Return to ExploreX Public Portal
          </button>
        </div>
      </div>
    );
  }

  /* ============================================================
     RENDER: 3. AUTHORIZED ADMIN CONSOLE
     ============================================================ */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-20 pt-4">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
              Supabase Auth • Server-Verified Administrator
            </span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            ExploreX Operations & Business Command
          </h1>
          <p className="text-xs text-stone-500">
            Authenticated Admin: <span className="font-semibold text-stone-800">{adminProfile?.email || user?.email}</span> (ID: {adminProfile?.id || user?.id})
          </p>
        </div>

        {/* Global Quick Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportBookingsCsv}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export Reconciled CSV
          </button>

          <button
            onClick={handleResetDatabase}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition cursor-pointer"
            title="Reset to verified seed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset DB
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200 text-xs">
        <button
          onClick={() => setAdminTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition cursor-pointer shrink-0 ${
            adminTab === 'overview'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Overview & Telemetry
        </button>

        <button
          onClick={() => setAdminTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition cursor-pointer shrink-0 ${
            adminTab === 'bookings'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Reservations & Bookings ({totalBookings || bookings.length})
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition cursor-pointer shrink-0 ${
            adminTab === 'users'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Travelers Directory ({users.length})
        </button>

        <button
          onClick={() => setAdminTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition cursor-pointer shrink-0 ${
            adminTab === 'reviews'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Reviews Moderation ({reviews.length})
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition cursor-pointer shrink-0 ${
            adminTab === 'audit'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Security Audit Ledger ({allAuditLogs.length})
        </button>

        <button
          onClick={() => setAdminTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition cursor-pointer shrink-0 ${
            adminTab === 'catalog'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Catalog & Inventory ({destinations.length})
        </button>
      </div>

      {/* TAB CONTENT: Overview */}
      {adminTab === 'overview' && (
        <AdminOverviewTab
          analytics={analytics}
          recentAuditLogs={recentAuditLogs}
          onExportCsv={handleExportBookingsCsv}
          onRefresh={loadDashboardData}
          isLoading={isLoading}
          onSelectTab={(tab) => setAdminTab(tab)}
        />
      )}

      {/* TAB CONTENT: Bookings */}
      {adminTab === 'bookings' && (
        <AdminBookingsTab
          bookings={bookings}
          totalBookings={totalBookings}
          currentPage={bookingPage}
          totalPages={bookingTotalPages}
          searchQuery={bookingSearch}
          onSearchChange={setBookingSearch}
          serviceFilter={serviceFilter}
          onServiceFilterChange={setServiceFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          paymentStatusFilter={paymentStatusFilter}
          onPaymentStatusFilterChange={setPaymentStatusFilter}
          emailStatusFilter={emailStatusFilter}
          onEmailStatusFilterChange={setEmailStatusFilter}
          onPageChange={setBookingPage}
          onSelectBooking={(bkg) => setSelectedBooking(bkg)}
          onExportCsv={handleExportBookingsCsv}
        />
      )}

      {/* TAB CONTENT: Users Directory */}
      {adminTab === 'users' && (
        <AdminUsersTab
          users={users}
          totalUsers={users.length}
          searchQuery={userSearch}
          onSearchChange={setUserSearch}
          onSelectUser={handleInspectUser}
        />
      )}

      {/* TAB CONTENT: Reviews Moderation */}
      {adminTab === 'reviews' && (
        <AdminReviewsTab
          reviews={reviews}
          totalReviews={reviews.length}
          searchQuery={reviewSearch}
          onSearchChange={setReviewSearch}
          ratingFilter={ratingFilter}
          onRatingFilterChange={setRatingFilter}
          onDeleteReview={handleDeleteReview}
        />
      )}

      {/* TAB CONTENT: Security Audit Logs */}
      {adminTab === 'audit' && (
        <AdminAuditLogsTab
          logs={allAuditLogs}
          totalLogs={allAuditLogs.length}
        />
      )}

      {/* TAB CONTENT: Catalog & Inventory Management */}
      {adminTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Destination & Package Inventory</h3>
              <p className="text-xs text-stone-500">Manage live tourist itineraries, pricing tiers, and promotional discount codes.</p>
            </div>
            <button
              onClick={() => setNewDestModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Destination
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map(d => (
              <div key={d.id} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="h-36 rounded-xl overflow-hidden bg-stone-100 relative">
                  <img src={d.heroImage} alt={d.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-stone-900/80 text-white font-mono text-[10px] font-bold">
                    {formatINR(d.startingPrice)}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{d.name}</h4>
                    <p className="text-[11px] text-stone-500">{d.country} • {d.stateOrRegion}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteDestination(d.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="Remove Destination"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAIL MODAL: Single Booking Dossier */}
      <AdminBookingDetailModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onUpdateStatus={handleUpdateBookingStatus}
        onCancelAndRefund={handleCancelAndRefundBooking}
        onResendEmail={handleResendBookingEmail}
        onInspectCustomer={handleInspectUser}
      />

      {/* DETAIL MODAL: User Profile & Trip History Dossier */}
      <AdminUserDetailModal
        detail={selectedUserDetail}
        isOpen={!!selectedUserDetail}
        onClose={() => setSelectedUserDetail(null)}
        onSelectBooking={(bkg) => {
          setSelectedUserDetail(null);
          setSelectedBooking(bkg);
        }}
      />

      {/* CREATE DESTINATION MODAL */}
      {newDestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-stone-200 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base">Register New Global Destination</h3>
              <button 
                onClick={() => setNewDestModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDestination} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Destination Name</label>
                <input
                  type="text"
                  required
                  value={destName}
                  onChange={e => setDestName(e.target.value)}
                  placeholder="e.g. Zermatt"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Country / State</label>
                  <input
                    type="text"
                    required
                    value={destCountry}
                    onChange={e => setDestCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Starting Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={destPrice}
                    onChange={e => setDestPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={destTagline}
                  onChange={e => setDestTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Hero Image URL</label>
                <input
                  type="url"
                  required
                  value={destImage}
                  onChange={e => setDestImage(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewDestModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl shadow-xs"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
