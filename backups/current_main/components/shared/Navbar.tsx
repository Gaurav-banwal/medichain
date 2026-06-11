'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import NotificationPanel from './NotificationPanel';
import WalletConnect from '../blockchain/WalletConnect';
import { Sun, Moon, Bell, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';

export default function Navbar({ title }: { title: string }) {
  const { user, theme, toggleTheme, notifications, logout } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-md dark:bg-background/80">
      {/* Title / Role Badge */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight sm:text-xl">{title}</h1>
        {user && (
          <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            {user.role}
          </span>
        )}
      </div>

      {/* Action Tray */}
      <div className="flex items-center gap-4">
        {/* Mock Blockchain Wallet Button */}
        <WalletConnect />

        {/* Theme Control */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:border-border/30 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
          title="Toggle Color Theme"
        >
          {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:border-border/30 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-4 ring-background animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* User Profile Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-lg border border-border/50 p-1.5 hover:bg-slate-100 dark:border-border/30 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-tr from-primary to-secondary text-xs font-bold text-white shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden max-w-[100px] truncate text-xs font-medium text-slate-700 dark:text-slate-200 sm:block">
                {user.name}
              </span>
            </button>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-56 rounded-xl glass-card border border-border/80 z-50 py-1.5 shadow-lg animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-2 border-b border-border/50">
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Authenticated user</p>
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{user.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out Account
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
