'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import PrescriptionTable from '@/components/prescription/PrescriptionTable';
import { mockPrescriptions } from '@/lib/mockData';

export default function CitizenPrescriptions() {
  return (
    <DashboardShell title="My Prescriptions">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Prescription Records</h2>
            <p className="text-xs text-muted-foreground mt-0.5">All prescriptions issued to you, verified on Polygon blockchain.</p>
          </div>
        </div>
        <PrescriptionTable prescriptions={mockPrescriptions} role="CITIZEN" />
      </div>
    </DashboardShell>
  );
}
