'use client';

import React from 'react';
import { FilePlus2, CheckCircle2, Search, AlertTriangle, Link as LinkIcon } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'create' | 'dispense' | 'audit' | 'flag';
  txHash?: string;
}

export default function ActivityTimeline({ events, title = 'Recent Operations Log' }: { events: TimelineEvent[]; title?: string }) {
  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'create':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <FilePlus2 className="w-4 h-4" />
          </div>
        );
      case 'dispense':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'audit':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Search className="w-4 h-4" />
          </div>
        );
      case 'flag':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-6">
        {title}
      </h3>

      <div className="relative border-l border-border/40 pl-6 ml-3 space-y-6">
        {events.map((event) => (
          <div key={event.id} className="relative">
            {/* Timeline Icon Node */}
            <span className="absolute -left-[38px] top-0.5 bg-background dark:bg-gray-950 p-1 rounded-full">
              {getIcon(event.type)}
            </span>

            {/* Event Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {event.title}
              </h4>
              <span className="text-[10px] text-muted-foreground font-medium">
                {event.timestamp}
              </span>
            </div>
            
            <p className="mt-1 text-xs text-muted-foreground/80 leading-relaxed">
              {event.description}
            </p>

            {/* Mock Transaction Hash */}
            {event.txHash && (
              <div className="mt-2.5 flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary font-mono select-all cursor-pointer transition-colors bg-primary/5 px-2 py-1 rounded w-fit border border-primary/10">
                <LinkIcon className="w-3 h-3" />
                <span>{event.txHash.substring(0, 10)}...{event.txHash.substring(event.txHash.length - 8)}</span>
              </div>
            )}
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-600">
            No events logged in the last 24 hours.
          </div>
        )}
      </div>
    </div>
  );
}
