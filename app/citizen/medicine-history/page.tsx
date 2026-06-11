'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import { History, Pill, Calendar, ShieldCheck } from 'lucide-react';

const medicineHistory = [
  { id: '1', name: 'Amoxicillin 500mg', prescriptionId: 'MC-482938', dispensedAt: 'Jun 10, 2026', pharmacy: 'Apollo Pharmacy, MG Road', quantity: 14, status: 'Completed' },
  { id: '2', name: 'Metformin 500mg', prescriptionId: 'MC-293847', dispensedAt: 'Jun 01, 2026', pharmacy: 'MedPlus, Koramangala', quantity: 60, status: 'Completed' },
  { id: '3', name: 'Atorvastatin 10mg', prescriptionId: 'MC-182736', dispensedAt: 'May 01, 2026', pharmacy: 'Guardian Pharmacy, HSR', quantity: 90, status: 'Completed' },
  { id: '4', name: 'Amlodipine 5mg', prescriptionId: 'MC-374859', dispensedAt: 'May 15, 2026', pharmacy: 'Apollo Pharmacy, Indiranagar', quantity: 30, status: 'Completed' },
];

export default function MedicineHistory() {
  return (
    <DashboardShell title="Medicine History">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Medicine Dispensing History</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Complete history of medicines dispensed to you — verified on-chain.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {medicineHistory.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl border border-border/50 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500">
                <Pill className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.pharmacy}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-[10px] font-medium text-slate-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.dispensedAt}</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" />Rx: {item.prescriptionId}</span>
                  <span>Qty: {item.quantity} units</span>
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
