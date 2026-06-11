'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyMedicine() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<'valid' | 'invalid' | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Mock: any ID starting with MC- is valid
    setResult(query.trim().toUpperCase().startsWith('MC-') ? 'valid' : 'invalid');
  };

  return (
    <DashboardShell title="Verify Medicine">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Medicine Authenticity Check</h2>
          <p className="text-xs text-muted-foreground mt-1">Enter a prescription ID or medicine batch code to verify authenticity on the Polygon blockchain.</p>
        </div>

        <form onSubmit={handleVerify} className="glass-card rounded-2xl border border-border/50 p-6 space-y-4">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prescription / Batch ID</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="MC-482938 or batch code..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-border/50 bg-background/50 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-primary dark:text-white dark:border-border/30 transition-colors"
              />
            </div>
            <button type="submit" className="h-11 px-6 rounded-xl bg-primary text-sm font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 transition-all cursor-pointer">
              Verify
            </button>
          </div>

          {result === 'valid' && (
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl animate-in fade-in duration-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Verified on Blockchain</p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">This medicine/prescription is authentic and has not been tampered with.</p>
              </div>
            </div>
          )}
          {result === 'invalid' && (
            <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl animate-in fade-in duration-200">
              <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">Not Found on Blockchain</p>
                <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-0.5">This ID could not be found. The medicine may be counterfeit. Report to authorities.</p>
              </div>
            </div>
          )}
        </form>

        <div className="glass-card rounded-2xl border border-border/50 p-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">How it works</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Every prescription issued through MediChain is stored as an immutable record on the Polygon blockchain. Enter the prescription ID or batch code to instantly verify its authenticity and check if it's been tampered with.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
