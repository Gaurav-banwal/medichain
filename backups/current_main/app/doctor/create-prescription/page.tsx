'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import PrescriptionForm from '@/components/prescription/PrescriptionForm';

export default function CreatePrescription() {
  return (
    <DashboardShell title="Issue Prescription">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Create Digital Prescription</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Generate a cryptographically signed prescription stored on IPFS and recorded on Polygon blockchain.</p>
        </div>
        <PrescriptionForm />
      </div>
    </DashboardShell>
  );
}
