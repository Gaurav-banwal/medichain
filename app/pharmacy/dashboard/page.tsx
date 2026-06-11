'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import StatsCard from '@/components/dashboard/StatsCard';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import BlockchainCard from '@/components/dashboard/BlockchainCard';
import { mockTimeline, weeklyChartData } from '@/lib/mockData';
import { PackageCheck, QrCode, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function PharmacyDashboard() {
  return (
    <DashboardShell title="Pharmacy Overview">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Dispensed Today" value="18" icon={PackageCheck} color="success" trend={{ value: '+3 vs yesterday', isPositive: true }} description="Successful dispensing operations" />
          <StatsCard title="QR Scans Today" value="24" icon={QrCode} color="primary" description="Prescriptions scanned for verification" />
          <StatsCard title="Blockchain Verified" value="24" icon={ShieldCheck} color="indigo" description="All scans verified on-chain" />
          <StatsCard title="Rejected" value="2" icon={AlertTriangle} color="warning" trend={{ value: '-1 vs yesterday', isPositive: true }} description="Expired or invalid prescriptions" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart title="Daily Dispensing Activity" data={weeklyChartData} dataKey="value" color="#10b981" />
          </div>
          <BlockchainCard />
        </div>

        <ActivityTimeline events={mockTimeline} title="Recent Dispensing Operations" />
      </div>
    </DashboardShell>
  );
}
