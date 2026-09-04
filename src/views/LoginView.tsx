import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavTab } from '../components/Navbar';

interface LoginViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const ok = await login(email.trim(), password);
      if (ok) {
        onNavigate('home');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#E4E4DF] shadow-editorial">
        {/* Editorial Masthead */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#91482D] font-bold">
            <Compass className="w-3.5 h-3.5" />
            The Traveler Passport
          </div>
          <h2 className="font-display text-3xl font-bold text-[#242424] tracking-tight">
            Sign in to ExploreX
          </h2>
          <p className="font-prose text-sm text-[#6B6B67] italic">
            Access your curated itineraries, in-app wallet ledger, and travel vouchers.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B6B67] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] font-medium focus:border-[#242424] focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-[#6B6B67] absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B6B67] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] font-medium focus:border-[#242424] focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-[#6B6B67] absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#242424] hover:bg-[#91482D] text-[#FFFFFF] rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch to sign up */}
        <div className="text-center pt-2 border-t border-[#F7F7F4] text-xs text-[#6B6B67]">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="font-bold text-[#91482D] hover:underline cursor-pointer"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
