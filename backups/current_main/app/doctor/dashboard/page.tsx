'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import StatsCard from '@/components/dashboard/StatsCard';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import BlockchainCard from '@/components/dashboard/BlockchainCard';
import { mockTimeline, weeklyChartData } from '@/lib/mockData';
import { FileSpreadsheet, Users, CheckCircle2, Activity } from 'lucide-react';

export default function DoctorDashboard() {
  return (
    <DashboardShell title="Doctor Overview">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Prescriptions Issued" value="47" icon={FileSpreadsheet} color="primary" trend={{ value: '+6 today', isPositive: true }} description="Total prescriptions created" />
          <StatsCard title="Active Patients" value="23" icon={Users} color="success" trend={{ value: '+2 this week', isPositive: true }} description="Currently under treatment" />
          <StatsCard title="Dispensed" value="31" icon={CheckCircle2} color="indigo" description="Successfully dispensed at pharmacy" />
          <StatsCard title="Blockchain Logs" value="47" icon={Activity} color="warning" description="Immutable on-chain records" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart
              title="Prescriptions Issued vs Dispensed (Weekly)"
              data={weeklyChartData}
              dataKey="value"
              dataKey2="value2"
            />
          </div>
          <BlockchainCard />
        </div>

        <ActivityTimeline events={mockTimeline} title="Recent Prescription Activity" />
      </div>
    </DashboardShell>
  );
}
