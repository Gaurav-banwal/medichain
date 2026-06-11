'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import { Package, AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react';

const inventory = [
  { id: '1', name: 'Amoxicillin 500mg', stock: 248, reorderLevel: 50, status: 'In Stock', category: 'Antibiotics' },
  { id: '2', name: 'Metformin 500mg', stock: 520, reorderLevel: 100, status: 'In Stock', category: 'Anti-diabetic' },
  { id: '3', name: 'Paracetamol 650mg', stock: 35, reorderLevel: 100, status: 'Low Stock', category: 'Analgesic' },
  { id: '4', name: 'Atorvastatin 10mg', stock: 180, reorderLevel: 50, status: 'In Stock', category: 'Statin' },
  { id: '5', name: 'Amlodipine 5mg', stock: 12, reorderLevel: 50, status: 'Critical', category: 'Antihypertensive' },
  { id: '6', name: 'Losartan 50mg', stock: 95, reorderLevel: 50, status: 'In Stock', category: 'Antihypertensive' },
];

export default function PharmacyInventory() {
  return (
    <DashboardShell title="Drug Inventory">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Drug Inventory Management</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time stock levels with automated reorder alerts.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              2 Critical Items
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Medicine</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Reorder At</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 font-medium">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-500/[0.01] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                        <Package className="w-4 h-4 text-sky-500" />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{item.category}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${item.stock <= item.reorderLevel ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'}`}>
                        {item.stock} units
                      </span>
                      {item.stock <= item.reorderLevel && <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
                    </div>
                    {/* Stock bar */}
                    <div className="mt-1.5 h-1 bg-slate-200 dark:bg-slate-700 rounded-full w-24 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.stock <= item.reorderLevel ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, (item.stock / (item.reorderLevel * 5)) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{item.reorderLevel} units</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                      item.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    }`}>
                      {item.status === 'In Stock' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
