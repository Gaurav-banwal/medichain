'use client';

import React from 'react';
import { useAuth } from './AuthContext';
import { Bell, CheckCircle2, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export default function NotificationPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { notifications, markNotificationsAsRead } = useAuth();

  React.useEffect(() => {
    if (isOpen) {
      markNotificationsAsRead();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Info className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <>
      {/* Overlay for dismissing */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      {/* Panel dropdown */}
      <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-card border border-border/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">System Alerts</h3>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>

        <div className="max-h-[350px] overflow-y-auto divide-y divide-border/30">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400 dark:text-slate-600">
              No recent notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`px-5 py-4 flex gap-3.5 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-all ${
                  !n.read ? 'bg-primary/[0.02] dark:bg-primary/[0.01]' : ''
                }`}
              >
                <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs text-slate-600 dark:text-slate-300 leading-relaxed ${!n.read ? 'font-medium text-slate-800 dark:text-white' : ''}`}>
                    {n.message}
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-1.5 block">
                    {n.date}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="px-5 py-2.5 border-t border-border/50 bg-slate-50/50 dark:bg-slate-900/50 text-center">
          <button 
            onClick={onClose} 
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Dismiss Panel
          </button>
        </div>
      </div>
    </>
  );
}
