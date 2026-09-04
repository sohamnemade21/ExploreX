import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavTab } from '../components/Navbar';

interface SignupViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const SignupView: React.FC<SignupViewProps> = ({ onNavigate }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password.');
      return;
    }

    setLoading(true);
    try {
      const ok = await signup(name.trim(), email.trim(), password);
      if (ok) {
        onNavigate('home');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#E4E4DF] shadow-editorial">
        {/* Editorial Masthead */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#91482D] font-bold">
            <Compass className="w-3.5 h-3.5" />
            Curator Membership
          </div>
          <h2 className="font-display text-3xl font-bold text-[#242424] tracking-tight">
            Create Your Account
          </h2>
          <p className="font-prose text-sm text-[#6B6B67] italic">
            Join ExploreX for bespoke itineraries, verified transits, and ₹5,000 welcome wallet credits.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B6B67] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] font-medium focus:border-[#242424] focus:outline-none transition-colors"
              />
              <User className="w-4 h-4 text-[#6B6B67] absolute left-3.5 top-3" />
            </div>
          </div>

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
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] font-medium focus:border-[#242424] focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-[#6B6B67] absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B6B67] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E4E4DF] rounded-xl text-xs sm:text-sm text-[#242424] font-medium focus:border-[#242424] focus:outline-none transition-colors"
              />
              <ShieldCheck className="w-4 h-4 text-[#6B6B67] absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-[#242424] hover:bg-[#91482D] text-[#FFFFFF] rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch to sign in */}
        <div className="text-center pt-2 border-t border-[#F7F7F4] text-xs text-[#6B6B67]">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-bold text-[#91482D] hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
