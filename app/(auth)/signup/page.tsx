'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/shared/AuthContext';
import { UserRole } from '@/types/user';
import { HeartPulse, Eye, EyeOff, User, Stethoscope, Building2, ShieldCheck } from 'lucide-react';

const ROLES: { value: UserRole; label: string; icon: React.ComponentType<any>; description: string }[] = [
  { value: 'CITIZEN', label: 'Citizen', icon: User, description: 'Access prescriptions & verify medicines' },
  { value: 'DOCTOR', label: 'Doctor', icon: Stethoscope, description: 'Issue & manage prescriptions' },
  { value: 'PHARMACY', label: 'Pharmacy', icon: Building2, description: 'Verify & dispense medications' },
  { value: 'REGULATOR', label: 'Regulator', icon: ShieldCheck, description: 'Audit and monitor activity' },
];

export default function SignupPage() {
  const { signup, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CITIZEN');
  const [walletAddress, setWalletAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await signup(name, email, password, role, walletAddress);
    if (!result.success) {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full">
      {/* Brand */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 shadow-xl shadow-sky-500/20 mb-3">
          <HeartPulse className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">Create Your Node</h1>
        <p className="text-slate-400 text-xs mt-1">Join the MediChain healthcare network</p>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-7 shadow-2xl">
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name + Email */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label>
              <input
                type="text"
                required
                placeholder="Dr. Arjun Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@medichain.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-3.5 pr-11 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3 text-slate-400 hover:text-white cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Your Role</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(({ value, label, icon: Icon, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    role === value
                      ? 'border-sky-500/60 bg-sky-500/10 text-sky-400'
                      : 'border-slate-700/40 bg-slate-800/30 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1.5" />
                  <p className="text-xs font-bold">{label}</p>
                  <p className="text-[9px] leading-tight mt-0.5 opacity-70">{description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Wallet (Optional) */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Wallet Address <span className="normal-case text-slate-600 font-medium">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="0x71C4B4E..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-3.5 text-sm font-mono text-white placeholder-slate-500 outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-sky-400 transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {loading ? 'Creating Account...' : 'Register on MediChain'}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
