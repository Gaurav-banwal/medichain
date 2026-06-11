'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import { AlertTriangle, Search, Eye, Clock } from 'lucide-react';

const investigations = [
  { id: 'INV-001', title: 'Suspicious Multi-Pharmacy Dispensing', patient: 'Unknown Citizen', status: 'Open', severity: 'High', date: 'Jun 09, 2026', prescriptionId: 'MC-938472', description: 'Same prescription MC-938472 was scanned at 3 different pharmacies within 24 hours.' },
  { id: 'INV-002', title: 'Forged Doctor Signature', patient: 'Ramesh Patel', status: 'Under Review', severity: 'Critical', date: 'Jun 07, 2026', prescriptionId: 'MC-829374', description: 'Digital signature does not match registered doctor cryptographic key on-chain.' },
  { id: 'INV-003', title: 'Expired Prescription Usage Attempt', patient: 'Geeta Sharma', status: 'Resolved', severity: 'Low', date: 'Jun 01, 2026', prescriptionId: 'MC-182736', description: 'Patient attempted to use expired prescription. System blocked dispensing automatically.' },
  { id: 'INV-004', title: 'Abnormal Opioid Prescription Pattern', patient: 'Confidential', status: 'Open', severity: 'High', date: 'Jun 10, 2026', prescriptionId: 'MC-374859', description: 'Doctor issued 12 opioid prescriptions in one day — 8x above network average.' },
];

const severityColors: Record<string, string> = {
  Critical: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  High: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
};

const statusColors: Record<string, string> = {
  Open: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  'Under Review': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Resolved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
};

export default function RegulatorInvestigations() {
  return (
    <DashboardShell title="Investigations">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Active Investigations</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Flagged cases requiring regulatory review and intervention.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            {investigations.filter(i => i.status === 'Open').length} Open Cases
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {investigations.map((inv) => (
            <div key={inv.id} className="glass-card rounded-2xl border border-border/50 p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${severityColors[inv.severity]}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{inv.title}</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Case: {inv.id} • Rx: {inv.prescriptionId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${severityColors[inv.severity]}`}>
                    {inv.severity}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusColors[inv.status]}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{inv.description}</p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{inv.date}</span>
                <button className="flex items-center gap-1 font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer">
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
