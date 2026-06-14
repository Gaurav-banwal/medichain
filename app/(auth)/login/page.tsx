'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useAuth } from '@/components/shared/AuthContext';
import { UserRole } from '@/types/user';
import { HeartPulse, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login, loginWithGoogle, registerGoogleUser, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Google Login UI & Registration states
  const [googleRegisterOpen, setGoogleRegisterOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CITIZEN');
  const [walletAddress, setWalletAddress] = useState('');
  const [googleError, setGoogleError] = useState('');

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Initialize Google Identity Services
  const initGoogleSignIn = () => {
    if (!clientId) {
      console.log('Google Client ID is not configured. Google Sign-In will operate in Demo Mode.');
      return;
    }

    try {
      if (typeof window !== 'undefined' && (window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });

        (window as any).google.accounts.id.renderButton(
          document.getElementById('google-signin-btn') as HTMLElement,
          {
            theme: 'outline',
            size: 'large',
            width: 382, // exact width for container
            text: 'signin_with',
            shape: 'rectangular',
          }
        );
      }
    } catch (err) {
      console.error('Error rendering Google Sign-In button:', err);
    }
  };

  useEffect(() => {
    // If Script onLoad doesn't fire or script is already loaded
    if (typeof window !== 'undefined' && (window as any).google) {
      initGoogleSignIn();
    }
  }, []);


  const handleGoogleCredentialResponse = async (response: any) => {
    setError('');
    setGoogleError('');
    const result = await loginWithGoogle(response.credential);
    if (result.success) {
      if (result.isNewUser) {
        setGoogleEmail(result.email || '');
        setGoogleName(result.name || '');
        setGoogleRegisterOpen(true);
      }
    } else {
      setError(result.error || 'Google Login failed.');
    }
  };

  const handleGoogleDemoLogin = async () => {
    setError('');
    setGoogleError('');
    const result = await loginWithGoogle('mock-google-credential');
    if (result.success) {
      if (result.isNewUser) {
        setGoogleEmail(result.email || '');
        setGoogleName(result.name || '');
        setGoogleRegisterOpen(true);
      }
    } else {
      setError(result.error || 'Google Login failed.');
    }
  };

  const handleGoogleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError('');
    const result = await registerGoogleUser(googleName, googleEmail, selectedRole, walletAddress);
    if (result.success) {
      setGoogleRegisterOpen(false);
    } else {
      setGoogleError(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password, rememberMe);
    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogleSignIn}
      />

      {/* Brand */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 shadow-xl shadow-sky-500/20 mb-4">
          <HeartPulse className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">MediChain</h1>
        <p className="text-slate-400 text-sm mt-1.5">Secure Decentralized Healthcare Platform</p>
      </div>

      {/* Card */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-1">Welcome back</h2>
        <p className="text-slate-400 text-xs mb-6">Sign in to access your secure healthcare node</p>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="doctor@medichain.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 pr-11 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-500 accent-sky-500"
              />
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full h-11 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-sm font-bold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-sky-500 transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In Securely'}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Or Connect</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Google Sign In Button */}
        <div className="w-full flex flex-col items-center">
          {clientId ? (
            <div id="google-signin-btn" className="w-full min-h-[44px]" />
          ) : (
            <button
              type="button"
              onClick={handleGoogleDemoLogin}
              className="w-full h-11 rounded-xl bg-slate-800 border border-slate-700/60 hover:bg-[#1a233a] hover:border-slate-600 text-sm font-semibold text-white transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.14-.94 2.7l3.51 2.73c2.05-1.9 3.48-4.7 3.48-7.28z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.89-3.02c-1.08.72-2.48 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96L1.29 17.37C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.27c-.25-.72-.39-1.5-.39-2.27s.14-1.55.39-2.27L1.29 6.63C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.37l3.98-3.1z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.31 0 3.26 2.7 1.29 6.63l3.98 3.1c.95-2.85 3.6-4.98 6.73-4.98z"
                />
              </svg>
              Sign In with Google (Demo)
            </button>
          )}
        </div>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            New healthcare provider?{' '}
            <Link href="/signup" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Role Selection Modal */}
      {googleRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-1">Complete Registration</h3>
            <p className="text-slate-400 text-xs mb-6">
              Welcome, {googleName}! Select your role to link your Google account to MediChain.
            </p>

            {googleError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium">
                {googleError}
              </div>
            )}

            <form onSubmit={handleGoogleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Email Address
                </label>
                <input
                  type="text"
                  disabled
                  value={googleEmail}
                  className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Select Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-sky-500 transition-colors"
                >
                  <option value="CITIZEN">Citizen (Patient)</option>
                  <option value="DOCTOR">Doctor (Medical Practitioner)</option>
                  <option value="PHARMACY">Pharmacy Store</option>
                  <option value="REGULATOR">Government Regulator</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Wallet Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="0x71C4B4E839878a7..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGoogleRegisterOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-sm font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-sm font-bold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-sky-500 transition-all cursor-pointer"
                >
                  Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-6 flex justify-center gap-6 text-[10px] text-slate-600 font-medium">
        <span className="flex items-center gap-1">🔐 JWT Secured</span>
        <span className="flex items-center gap-1">⛓️ Polygon Blockchain</span>
        <span className="flex items-center gap-1">📁 IPFS Storage</span>
      </div>
    </div>
  );
}

