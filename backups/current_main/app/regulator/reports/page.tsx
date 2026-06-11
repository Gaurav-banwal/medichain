'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { monthlyChartData, weeklyChartData } from '@/lib/mockData';
import { Download, BarChart3, FileSpreadsheet } from 'lucide-react';

const reportItems = [
  { title: 'Monthly Prescription Report – May 2026', type: 'PDF', generated: 'Jun 01, 2026', size: '1.2 MB' },
  { title: 'Pharmacy Compliance Audit – Q1 2026', type: 'XLSX', generated: 'Apr 15, 2026', size: '3.8 MB' },
  { title: 'Flagged Prescriptions Report – May 2026', type: 'PDF', generated: 'Jun 05, 2026', size: '540 KB' },
  { title: 'Blockchain Transaction Ledger – May 2026', type: 'CSV', generated: 'Jun 01, 2026', size: '8.2 MB' },
];

export default function RegulatorReports() {
  return (
    <DashboardShell title="System Reports">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Regulatory Reports</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Generated compliance reports, audit summaries, and blockchain transaction exports.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChart title="Monthly System Volume Trend" data={monthlyChartData} dataKey="value" color="#6366f1" />
          <AnalyticsChart title="Weekly Dispense vs Issue Activity" data={weeklyChartData} dataKey="value" dataKey2="value2" />
        </div>

        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Generated Reports Archive</h3>
          </div>
          <div className="divide-y divide-border/30">
            {reportItems.map((r, i) => (
              <div key={i} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-500/[0.01] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{r.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{r.generated} • {r.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[9px] font-bold border border-border/40 rounded px-1.5 py-0.5 text-slate-500">{r.type}</span>
                  <button className="flex items-center gap-1 h-8 px-3 rounded-lg border border-border/50 text-[10px] font-bold text-primary hover:bg-primary/5 transition-colors cursor-pointer">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
