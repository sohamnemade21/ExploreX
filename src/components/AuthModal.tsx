import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, login, signup } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        const ok = await login(email, password);
        if (ok) {
          setEmail('');
          setPassword('');
        }
      } else if (authModalMode === 'signup') {
        const ok = await signup(name, email, password);
        if (ok) {
          setName('');
          setEmail('');
          setPassword('');
        }
      } else if (authModalMode === 'forgot') {
        await api.forgotPassword(email);
        success('Reset Instructions Sent', `We've sent a verification code to ${email}`);
        openAuthModal('login');
      }
    } catch (err: any) {
      error('Authentication Error', err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* Header decoration */}
          <div className="bg-gradient-to-r from-sky-600 to-indigo-600 p-6 text-white text-center relative">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md mb-3">
              <Compass className="w-6 h-6 text-sky-200" />
            </div>
            <h3 className="text-xl font-bold">
              {authModalMode === 'login' && 'Welcome Back to ExploreX'}
              {authModalMode === 'signup' && 'Start Your Smart Journey'}
              {authModalMode === 'forgot' && 'Reset Your Password'}
            </h3>
            <p className="text-xs text-sky-100 mt-1 max-w-xs mx-auto">
              {authModalMode === 'login' && 'Sign in to access personalized itineraries, wallet & bookings'}
              {authModalMode === 'signup' && 'Unlock AI Travel DNA, Autopilot replanning, and member perks'}
              {authModalMode === 'forgot' && 'Enter your email to receive a password reset link'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {authModalMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {authModalMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => openAuthModal('forgot')}
                      className="text-xs text-sky-600 hover:text-sky-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authModalMode === 'login' && 'Sign In to Account'}
                    {authModalMode === 'signup' && 'Create Free Account'}
                    {authModalMode === 'forgot' && 'Send Reset Code'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Switch mode links */}
            <div className="text-center pt-2 text-xs text-slate-600">
              {authModalMode === 'login' && (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    className="text-sky-600 hover:text-sky-700 font-semibold"
                  >
                    Sign up now
                  </button>
                </p>
              )}
              {authModalMode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-sky-600 hover:text-sky-700 font-semibold"
                  >
                    Log in
                  </button>
                </p>
              )}
              {authModalMode === 'forgot' && (
                <p>
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-sky-600 hover:text-sky-700 font-semibold"
                  >
                    Back to Log in
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
