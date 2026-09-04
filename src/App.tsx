import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { BookingCheckoutModal } from './components/BookingCheckoutModal';

// Views
import { HomeView } from './views/HomeView';
import { DestinationsView } from './views/DestinationsView';
import { PackagesView } from './views/PackagesView';
import { ExploreView } from './views/ExploreView';
import { TheExplorerView } from './views/TheExplorerView';
import { AIAssistantView } from './views/AIAssistantView';
import { BookingsView } from './views/BookingsView';
import { MyTripsDashboardView } from './views/MyTripsDashboardView';
import { MagicMomentsView } from './views/MagicMomentsView';
import { WalletView } from './views/WalletView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { LoginView } from './views/LoginView';
import { SignupView } from './views/SignupView';
import { Destination, TravelPackage } from './types';

const MainAppContent: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/login') return 'login';
      if (path === '/signup') return 'signup';
    }
    return 'home';
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Navigation parameters passed across views
  const [navParams, setNavParams] = useState<Record<string, any>>({});

  // Direct package booking modal state
  const [bookingPkgModalOpen, setBookingPkgModalOpen] = useState<boolean>(false);
  const [selectedPkgForBooking, setSelectedPkgForBooking] = useState<TravelPackage | null>(null);

  // Selected destination for deep-linking into destination detail
  const [selectedDestinationForModal, setSelectedDestinationForModal] = useState<Destination | null>(null);

  const handleNavigate = (tab: NavTab, params?: Record<string, any>) => {
    setActiveTab(tab);
    if (params) {
      setNavParams(params);
    } else {
      setNavParams({});
    }
    
    // Sync browser URL if login/signup or home
    if (typeof window !== 'undefined' && window.history) {
      if (tab === 'login') {
        window.history.pushState({}, '', '/login');
      } else if (tab === 'signup') {
        window.history.pushState({}, '', '/signup');
      } else if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
        window.history.pushState({}, '', '/');
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/login') setActiveTab('login');
      else if (path === '/signup') setActiveTab('signup');
      else setActiveTab('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleBookPackage = (pkg: TravelPackage) => {
    setSelectedPkgForBooking(pkg);
    setBookingPkgModalOpen(true);
  };

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestinationForModal(dest);
    setActiveTab('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#242424] flex flex-col font-sans selection:bg-[#B45F3C] selection:text-white">
      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleNavigate}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onBookPackage={handleBookPackage}
            onSelectDestination={handleSelectDestination}
          />
        )}

        {activeTab === 'destinations' && (
          <DestinationsView
            initialSearch={navParams.search || ''}
            initialVibe={navParams.vibe || 'all'}
            onNavigate={handleNavigate}
            onBookPackage={handleBookPackage}
            selectedDestinationFromParent={selectedDestinationForModal}
            onClearSelectedDestination={() => setSelectedDestinationForModal(null)}
          />
        )}

        {activeTab === 'packages' && (
          <PackagesView
            onNavigate={handleNavigate}
            onBookPackage={handleBookPackage}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            onNavigate={handleNavigate}
            onSelectDestination={handleSelectDestination}
          />
        )}

        {activeTab === 'explorer' && (
          <TheExplorerView
            initialDestination={navParams.destination || ''}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'ai' && (
          <AIAssistantView
            initialPrompt={navParams.initialPrompt || ''}
            initialDestinationId={navParams.destinationId || ''}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsView onNavigate={handleNavigate} />
        )}

        {activeTab === 'mytrips' && (
          <MyTripsDashboardView onNavigate={handleNavigate} />
        )}

        {activeTab === 'moments' && (
          <MagicMomentsView />
        )}

        {activeTab === 'wallet' && (
          <WalletView />
        )}

        {activeTab === 'profile' && (
          <ProfileView onNavigate={handleNavigate} />
        )}

        {activeTab === 'admin' && (
          <AdminView onNavigate={handleNavigate} />
        )}

        {activeTab === 'login' && (
          <LoginView onNavigate={handleNavigate} />
        )}

        {activeTab === 'signup' && (
          <SignupView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleNavigate} />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Direct Package Booking Checkout Modal */}
      {selectedPkgForBooking && (
        <BookingCheckoutModal
          isOpen={bookingPkgModalOpen}
          onClose={() => {
            setBookingPkgModalOpen(false);
            setSelectedPkgForBooking(null);
          }}
          serviceType="package"
          title={selectedPkgForBooking.title}
          destinationName={selectedPkgForBooking.destinationName || selectedPkgForBooking.title}
          basePrice={selectedPkgForBooking.startingPrice}
          details={{
            packageId: selectedPkgForBooking.id,
            duration: `${selectedPkgForBooking.durationDays} Days / ${selectedPkgForBooking.durationNights} Nights`,
            hotelTier: selectedPkgForBooking.hotels?.[0]?.name || '5-Star Luxury Resort',
            transport: 'Private Chauffeured AC Transit & Transfers'
          }}
          onBookingSuccess={(b) => {
            success('Package Confirmed!', `Booking #${b.details?.pnrNumber || b.id} reserved.`);
          }}
          onNavigateToMyTrips={() => handleNavigate('mytrips')}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
