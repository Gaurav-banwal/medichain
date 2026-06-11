'use client';

import { useState } from 'react';
import DashboardShell from '@/components/shared/DashboardShell';
import QRScanner from '@/components/pharmacy/QRScanner';
import VerificationCard from '@/components/pharmacy/VerificationCard';
import { mockVerifiedPrescription } from '@/lib/mockData';

export default function PharmacyVerify() {
  const [scanned, setScanned] = useState(false);

  const handleScan = (id: string) => {
    setScanned(true);
  };

  return (
    <DashboardShell title="Scan QR Code">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Prescription Verification</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Scan the patient's QR code or enter their prescription ID to verify on Polygon blockchain.</p>
        </div>

        {!scanned ? (
          <QRScanner onScan={handleScan} />
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <VerificationCard prescription={mockVerifiedPrescription} />
            <button
              onClick={() => setScanned(false)}
              className="w-full h-10 rounded-xl border border-border/50 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Scan Another Prescription
            </button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
