import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserPreferences } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'forgot';
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (prefs: UserPreferences) => Promise<void>;
  toggleSaveDestination: (destinationId: string) => Promise<void>;
  toggleSavePackage: (packageId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const token = localStorage.getItem('explorex_auth_token');
      const saved = localStorage.getItem('explorex_session_user');
      if (token && saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const { success, error } = useToast();

  useEffect(() => {
    const initSession = async () => {
      const token = localStorage.getItem('explorex_auth_token');
      if (token) {
        try {
          const session = await api.getSession();
          if (session.authenticated && session.user) {
            setUser(session.user);
            localStorage.setItem('explorex_session_user', JSON.stringify(session.user));
          } else {
            setUser(null);
            localStorage.removeItem('explorex_session_user');
            localStorage.removeItem('explorex_auth_token');
          }
        } catch (err) {
          console.warn('Session verification notice:', err);
          setUser(null);
          localStorage.removeItem('explorex_session_user');
          localStorage.removeItem('explorex_auth_token');
        }
      } else {
        setUser(null);
        localStorage.removeItem('explorex_session_user');
      }
    };
    initSession();
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('explorex_auth_token');
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const data = await api.getProfile();
      if (data && data.id) {
        setUser(data);
        localStorage.setItem('explorex_session_user', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.login(email, pass);
      if (res.user && res.token) {
        setUser(res.user);
        localStorage.setItem('explorex_session_user', JSON.stringify(res.user));
        localStorage.setItem('explorex_auth_token', res.token);
        closeAuthModal();
        success('Sign in successful', '');
        return true;
      }
      return false;
    } catch (err: any) {
      error('Login Failed', err.message || 'Invalid email or password');
      return false;
    }
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.signup(name, email, pass);
      if (res.user && res.token) {
        setUser(res.user);
        localStorage.setItem('explorex_session_user', JSON.stringify(res.user));
        localStorage.setItem('explorex_auth_token', res.token);
        closeAuthModal();
        success('Sign up successful', '');
        return true;
      }
      return false;
    } catch (err: any) {
      error('Signup Failed', err.message || 'Could not create account');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      localStorage.removeItem('explorex_session_user');
      localStorage.removeItem('explorex_auth_token');
      success('Signed out', 'You have been safely signed out.');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updated = await api.updateProfile(updates);
      setUser(updated);
      localStorage.setItem('explorex_session_user', JSON.stringify(updated));
      success('Profile Updated', 'Your profile details were saved successfully.');
    } catch (err: any) {
      error('Update Failed', err.message || 'Failed to update profile');
    }
  };

  const updatePreferences = async (prefs: UserPreferences) => {
    try {
      const updated = await api.updatePreferences(prefs);
      setUser(updated);
      localStorage.setItem('explorex_session_user', JSON.stringify(updated));
      success('Preferences Saved', 'AI personalized recommendations updated.');
    } catch (err: any) {
      error('Update Failed', err.message);
    }
  };

  const toggleSaveDestination = async (destinationId: string) => {
    try {
      const updated = await api.toggleSaveDestination(destinationId);
      const isSaved = updated.savedDestinations.includes(destinationId);
      setUser(updated);
      localStorage.setItem('explorex_session_user', JSON.stringify(updated));
      success(isSaved ? 'Destination Saved' : 'Removed from Saved', isSaved ? 'Added to your travel wishlist' : 'Removed from wishlist');
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const toggleSavePackage = async (packageId: string) => {
    try {
      const updated = await api.toggleSavePackage(packageId);
      const isSaved = updated.savedPackages.includes(packageId);
      setUser(updated);
      localStorage.setItem('explorex_session_user', JSON.stringify(updated));
      success(isSaved ? 'Package Saved' : 'Removed from Saved', isSaved ? 'Added to saved packages' : 'Removed from saved');
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        updateProfile,
        updatePreferences,
        toggleSaveDestination,
        toggleSavePackage,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
