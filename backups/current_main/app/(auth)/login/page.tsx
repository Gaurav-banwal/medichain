'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/shared/AuthContext';
import { HeartPulse, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

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

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            New healthcare provider?{' '}
            <Link href="/signup" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 flex justify-center gap-6 text-[10px] text-slate-600 font-medium">
        <span className="flex items-center gap-1">🔐 JWT Secured</span>
        <span className="flex items-center gap-1">⛓️ Polygon Blockchain</span>
        <span className="flex items-center gap-1">📁 IPFS Storage</span>
      </div>
    </div>
  );
}
