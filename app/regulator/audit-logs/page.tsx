'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import { mockTimeline } from '@/lib/mockData';
import { BookOpen, Filter, Download } from 'lucide-react';
import { FilePlus2, CheckCircle2, Search, AlertTriangle } from 'lucide-react';

const typeIcons = { create: FilePlus2, dispense: CheckCircle2, audit: Search, flag: AlertTriangle };
const typeColors: Record<string, string> = {
  create: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  dispense: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  audit: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  flag: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
};

export default function AuditLogs() {
  return (
    <DashboardShell title="Audit Logs">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">System Audit Logs</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Complete immutable audit trail of all prescription lifecycle events on Polygon.</p>
          </div>
          <button className="flex items-center gap-1.5 h-9 px-4 rounded-xl border border-border/50 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>

        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {mockTimeline.length + 120} Total Operations Logged
            </span>
          </div>
          <div className="divide-y divide-border/30">
            {[...mockTimeline, ...mockTimeline, ...mockTimeline].map((event, i) => {
              const Icon = typeIcons[event.type];
              return (
                <div key={`${event.id}-${i}`} className="px-5 py-4 flex items-start gap-4 hover:bg-slate-500/[0.01] transition-colors">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${typeColors[event.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{event.title}</p>
                      <span className="text-[10px] text-muted-foreground">{event.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{event.description}</p>
                    {event.txHash && (
                      <span className="mt-1.5 inline-block font-mono text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded border border-border/30 select-all">
                        {event.txHash.substring(0, 18)}...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
