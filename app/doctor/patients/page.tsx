'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import { Users, User, Calendar, FileSpreadsheet, ShieldCheck } from 'lucide-react';

const patients = [
  { id: '1', name: 'Ravi Kumar', abhaId: '91-2093-8472-1823', lastVisit: 'Jun 10, 2026', prescriptions: 2, status: 'Active' },
  { id: '2', name: 'Anita Singh', abhaId: '91-3847-2910-4823', lastVisit: 'Jun 01, 2026', prescriptions: 1, status: 'Dispensed' },
  { id: '3', name: 'Mohan Das', abhaId: '91-1234-5678-9012', lastVisit: 'May 01, 2026', prescriptions: 3, status: 'Inactive' },
  { id: '4', name: 'Preethi Rajan', abhaId: '91-9876-5432-1098', lastVisit: 'Jun 08, 2026', prescriptions: 1, status: 'Active' },
];

export default function DoctorPatients() {
  return (
    <DashboardShell title="My Patients">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Patient Registry</h2>
            <p className="text-xs text-muted-foreground mt-0.5">All patients with prescriptions issued by you, linked to ABHA identifiers.</p>
          </div>
          <div className="flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-xl px-3 py-2">
            <Users className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">{patients.length} Total Patients</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {patients.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl border border-border/50 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 border border-border/30 text-sm font-bold text-slate-700 dark:text-slate-300">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{p.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">ABHA: {p.abhaId}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                  p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                  p.status === 'Dispensed' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' :
                  'bg-slate-500/10 text-slate-500 border-slate-500/20'
                }`}>{p.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[10px] font-medium text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Last: {p.lastVisit}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-primary" />
                  <span>{p.prescriptions} prescription(s)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
