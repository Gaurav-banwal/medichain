'use client';

import { useAuth } from '@/components/shared/AuthContext';
import DashboardShell from '@/components/shared/DashboardShell';
import { User, Mail, Shield, Calendar, Edit3 } from 'lucide-react';

export default function ProfilePage({ role }: { role: string }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardShell title="Profile">
      <div className="max-w-2xl space-y-6">
        {/* Profile Card */}
        <div className="glass-card rounded-3xl border border-border/50 p-8">
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 text-3xl font-bold text-white shadow-lg shadow-sky-500/20">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">{user.name}</h2>
                  <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 text-xs font-bold text-sky-600 dark:text-sky-400">
                    <Shield className="w-3 h-3" />
                    {user.role}
                  </span>
                </div>
                <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border/50 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:border-border/30 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3.5 bg-slate-500/5 border border-border/30 rounded-xl">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase">Email</p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-slate-500/5 border border-border/30 rounded-xl">
              <User className="w-4 h-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase">User ID</p>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate">{user.id.substring(0, 16)}...</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-slate-500/5 border border-border/30 rounded-xl">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Member Since</p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="glass-card rounded-2xl border border-border/50 p-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Security & Authentication</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-slate-500/5 border border-border/30 rounded-xl">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</p>
                <p className="text-[10px] text-muted-foreground">Last changed: Never</p>
              </div>
              <button className="h-8 px-3 rounded-lg text-xs font-bold text-primary border border-primary/20 hover:bg-primary/5 transition-colors cursor-pointer">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <div>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">JWT Session Active</p>
                <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60">7-day token — expires automatically</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
