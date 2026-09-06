import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Compass, ArrowRight, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, login, signup } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Clear inputs and errors when modal opens or mode changes
  useEffect(() => {
    setFormError(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setFormError('Please enter your email address.');
      return;
    }

    if (authModalMode === 'signup') {
      if (!name.trim() || name.trim().length < 2) {
        setFormError('Please enter your full name (at least 2 characters).');
        return;
      }
      if (!password || password.length < 6) {
        setFormError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('Passwords do not match. Please verify your password.');
        return;
      }
    } else if (authModalMode === 'login') {
      if (!password) {
        setFormError('Please enter your password.');
        return;
      }
    }

    setLoading(true);

    try {
      if (authModalMode === 'login') {
        const ok = await login(cleanEmail, password);
        if (ok) {
          setEmail('');
          setPassword('');
          closeAuthModal();
        }
      } else if (authModalMode === 'signup') {
        const ok = await signup(name.trim(), cleanEmail, password);
        if (ok) {
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          closeAuthModal();
        }
      } else if (authModalMode === 'forgot') {
        await api.forgotPassword(cleanEmail);
        success('Reset Link Dispatched', `Password reset instructions sent to ${cleanEmail}`);
        openAuthModal('login');
      }
    } catch (err: any) {
      setFormError(err.message || 'Authentication request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E4E4DF] overflow-hidden my-auto"
        >
          {/* Top Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#F7F7F4] hover:bg-[#E4E4DF] text-[#6B6B67] hover:text-[#242424] transition-colors border border-[#E4E4DF] cursor-pointer"
            aria-label="Close modal and continue public browsing"
            title="Close & Browse Public Catalog"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Editorial Header */}
          <div className="bg-[#242424] p-6 sm:p-7 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
            
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#B45F3C] text-white mb-3 shadow-md">
              <Compass className="w-5 h-5" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[9.5px] font-mono tracking-widest uppercase mb-1.5 border border-white/15">
              <Sparkles className="w-3 h-3 text-[#E6A88E]" />
              ExploreX Passport Gate
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-bold tracking-tight">
              {authModalMode === 'login' && 'Sign In to ExploreX'}
              {authModalMode === 'signup' && 'Join ExploreX Atelier'}
              {authModalMode === 'forgot' && 'Reset Account Password'}
            </h3>

            <p className="text-xs text-stone-300 font-prose italic mt-1 max-w-xs mx-auto">
              {authModalMode === 'login' && 'Access your curated itineraries, live bookings & expedition wallet.'}
              {authModalMode === 'signup' && 'Unlock AI Trip Studio, bespoke itineraries, member perks & wallet.'}
              {authModalMode === 'forgot' && 'Enter your registered email to receive recovery instructions.'}
            </p>

            {/* Mode Switcher Tabs */}
            {authModalMode !== 'forgot' && (
              <div className="flex items-center justify-center mt-5 p-1 bg-white/10 rounded-xl max-w-xs mx-auto border border-white/10">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className={`flex-1 py-1.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg transition-all cursor-pointer ${
                    authModalMode === 'login'
                      ? 'bg-white text-[#242424] shadow-xs'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className={`flex-1 py-1.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg transition-all cursor-pointer ${
                    authModalMode === 'signup'
                      ? 'bg-white text-[#242424] shadow-xs'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                {formError}
              </div>
            )}

            {authModalMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B6B67] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6B6B67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] font-medium focus:outline-none focus:border-[#242424] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B6B67] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B6B67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] font-medium focus:outline-none focus:border-[#242424] transition-all"
                />
              </div>
            </div>

            {authModalMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#6B6B67]">
                    Password
                  </label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => openAuthModal('forgot')}
                      className="text-[11px] font-mono text-[#B45F3C] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B6B67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] font-medium focus:outline-none focus:border-[#242424] transition-all"
                  />
                </div>
              </div>
            )}

            {authModalMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B6B67] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-[#6B6B67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] font-medium focus:outline-none focus:border-[#242424] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Feature Unlock Indicator */}
            <div className="py-2 px-3 bg-[#F7F7F4] border border-[#E4E4DF] rounded-xl text-[11px] text-[#6B6B67] flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-[#B45F3C] shrink-0" />
              <span>Unlocks AI Trip Studio, Live Bookings, Wallet & Custom Itineraries.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#242424] hover:bg-[#B45F3C] text-white text-xs font-mono uppercase tracking-wider font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authModalMode === 'login' && 'Sign In to Account'}
                    {authModalMode === 'signup' && 'Create Account & Unlock All'}
                    {authModalMode === 'forgot' && 'Send Reset Instructions'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Switch mode links */}
            <div className="text-center pt-2 text-xs text-[#6B6B67]">
              {authModalMode === 'login' && (
                <p>
                  First time visiting?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    className="text-[#B45F3C] font-semibold hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              )}
              {authModalMode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-[#B45F3C] font-semibold hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              )}
              {authModalMode === 'forgot' && (
                <p>
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-[#B45F3C] font-semibold hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
