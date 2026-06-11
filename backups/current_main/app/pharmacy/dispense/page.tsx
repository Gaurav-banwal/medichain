'use client';

import { useState } from 'react';
import DashboardShell from '@/components/shared/DashboardShell';
import QRScanner from '@/components/pharmacy/QRScanner';
import VerificationCard from '@/components/pharmacy/VerificationCard';
import DispenseForm from '@/components/pharmacy/DispenseForm';
import { mockVerifiedPrescription } from '@/lib/mockData';

export default function PharmacyDispense() {
  const [step, setStep] = useState<'scan' | 'verify' | 'done'>('scan');

  return (
    <DashboardShell title="Dispense Medicine">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Medicine Dispensing Workflow</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Step-by-step verified dispensing — each action committed to Polygon blockchain.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold">
          {['Scan', 'Verify', 'Dispense'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                i < (step === 'scan' ? 0 : step === 'verify' ? 1 : 2)
                  ? 'bg-emerald-500 text-white'
                  : i === (step === 'scan' ? 0 : step === 'verify' ? 1 : 2)
                  ? 'bg-primary text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
              }`}>{i + 1}</div>
              <span className={i === (step === 'scan' ? 0 : step === 'verify' ? 1 : 2) ? 'text-slate-800 dark:text-white' : 'text-slate-400'}>{s}</span>
              {i < 2 && <div className="w-8 h-px bg-border/60 mx-1" />}
            </div>
          ))}
        </div>

        {step === 'scan' && (
          <QRScanner onScan={() => setStep('verify')} />
        )}
        {step === 'verify' && (
          <div className="space-y-4">
            <VerificationCard prescription={mockVerifiedPrescription} />
            <button onClick={() => setStep('done')} className="w-full h-10 rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 transition-all cursor-pointer">
              Proceed to Dispense
            </button>
          </div>
        )}
        {step === 'done' && (
          <DispenseForm prescription={mockVerifiedPrescription} onDispensed={() => setStep('scan')} />
        )}
      </div>
    </DashboardShell>
  );
}
