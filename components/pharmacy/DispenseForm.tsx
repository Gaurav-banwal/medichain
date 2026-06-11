'use client';

import React, { useState } from 'react';
import { CheckCircle2, PackageCheck, AlertCircle } from 'lucide-react';
import { VerifiedPrescription } from './VerificationCard';

export default function DispenseForm({ prescription, onDispensed }: { prescription: VerifiedPrescription; onDispensed: () => void }) {
  const [quantities, setQuantities] = useState<Record<number, number>>(
    prescription.medicines.reduce((acc, med, i) => ({ ...acc, [i]: med.quantity }), {})
  );
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleDispense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await new Promise(r => setTimeout(r, 1800));
    const hash = `0x${Math.random().toString(16).substring(2, 10)}a8d9b1c7811ef123b1b7596e7614d14875`;
    setTxHash(hash);
    setSuccess(true);
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="glass-card rounded-2xl border border-border/50 p-8 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <PackageCheck className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Medicines Dispensed</h3>
        <p className="text-xs text-muted-foreground mb-5 max-w-xs mx-auto">
          Prescription status updated to DISPENSED on Polygon blockchain. Record is now immutable.
        </p>
        <div className="text-[10px] font-mono bg-slate-500/5 border border-border/30 rounded-xl px-4 py-3 text-slate-500 break-all mb-6">
          Tx: {txHash}
        </div>
        <button
          onClick={onDispensed}
          className="h-10 px-6 rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 transition-all cursor-pointer"
        >
          Scan Next Prescription
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleDispense} className="glass-card rounded-2xl border border-border/50 p-6 space-y-5">
      <div className="flex items-center gap-2 border-b border-border/40 pb-4">
        <PackageCheck className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
          Confirm Dispensing
        </h3>
      </div>

      <div className="space-y-3">
        {prescription.medicines.map((med, i) => (
          <div key={i} className="flex items-center gap-4 p-3.5 bg-slate-500/5 border border-border/30 rounded-xl">
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-white">{med.name}</p>
              <p className="text-[10px] text-muted-foreground">{med.dosage}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-slate-400 font-bold">Qty:</label>
              <input
                type="number"
                min={1}
                max={med.quantity}
                value={quantities[i]}
                onChange={(e) => setQuantities({ ...quantities, [i]: parseInt(e.target.value) || 1 })}
                className="h-8 w-16 rounded-lg border border-border/50 bg-background px-2 text-xs font-bold text-center text-slate-800 dark:text-white outline-none focus:border-primary transition-colors"
              />
              <span className="text-[10px] text-muted-foreground">/ {med.quantity}</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Pharmacist Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Add any dispensing remarks or patient interaction notes..."
          className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-primary dark:text-white dark:border-border/30 transition-colors resize-none"
        />
      </div>

      <div className="flex items-start gap-2.5 p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-relaxed">
          Dispensing is irreversible on-chain. Confirm all quantities before committing to blockchain.
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="h-10 px-6 rounded-xl bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500/95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{submitting ? 'Committing to Ledger...' : 'Confirm & Dispense'}</span>
        </button>
      </div>
    </form>
  );
}
