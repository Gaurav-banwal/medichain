'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import StatsCard from '@/components/dashboard/StatsCard';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import BlockchainCard from '@/components/dashboard/BlockchainCard';
import { mockTimeline, monthlyChartData } from '@/lib/mockData';
import { BookOpen, FileWarning, Activity, ShieldCheck } from 'lucide-react';

export default function RegulatorDashboard() {
  return (
    <DashboardShell title="Regulatory Overview">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Audit Logs" value="1,284" icon={BookOpen} color="primary" trend={{ value: '+48 today', isPositive: true }} description="Total auditable records on-chain" />
          <StatsCard title="Flagged Cases" value="7" icon={FileWarning} color="warning" trend={{ value: '-2 resolved', isPositive: true }} description="Suspicious prescription patterns" />
          <StatsCard title="System Transactions" value="4,829" icon={Activity} color="indigo" description="Total Polygon blockchain operations" />
          <StatsCard title="Compliance Rate" value="98.4%" icon={ShieldCheck} color="success" description="Platform-wide verified compliance" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart
              title="Monthly Prescription Volume Audit"
              data={monthlyChartData}
              dataKey="value"
              color="#6366f1"
            />
          </div>
          <BlockchainCard />
        </div>

        <ActivityTimeline events={mockTimeline} title="System-Wide Audit Operations" />
      </div>
    </DashboardShell>
  );
}
