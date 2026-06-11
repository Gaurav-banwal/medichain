'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import PrescriptionTable from '@/components/prescription/PrescriptionTable';
import { mockPrescriptions } from '@/lib/mockData';

export default function DoctorPrescriptions() {
  return (
    <DashboardShell title="Sent Prescriptions">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Issued Prescription Records</h2>
          <p className="text-xs text-muted-foreground mt-0.5">All prescriptions you have issued — each one immutably recorded on Polygon blockchain.</p>
        </div>
        <PrescriptionTable prescriptions={mockPrescriptions} role="DOCTOR" />
      </div>
    </DashboardShell>
  );
}
