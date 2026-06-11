'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import StatsCard from '@/components/dashboard/StatsCard';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import BlockchainCard from '@/components/dashboard/BlockchainCard';
import { mockTimeline, weeklyChartData } from '@/lib/mockData';
import { FileSpreadsheet, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export default function CitizenDashboard() {
  return (
    <DashboardShell title="Citizen Overview">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="My Prescriptions" value="4" icon={FileSpreadsheet} color="primary" trend={{ value: '+1 this week', isPositive: true }} description="Total issued to you" />
          <StatsCard title="Active Prescriptions" value="2" icon={CheckCircle2} color="success" description="Ready to use at pharmacy" />
          <StatsCard title="Pending Verification" value="1" icon={Clock} color="warning" description="Awaiting pharmacy scan" />
          <StatsCard title="Blockchain Records" value="8" icon={ShieldCheck} color="indigo" description="On-chain immutable logs" />
        </div>

        {/* Chart + Blockchain Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart title="My Prescription Activity (Weekly)" data={weeklyChartData} dataKey="value" />
          </div>
          <div className="lg:col-span-1">
            <BlockchainCard />
          </div>
        </div>

        {/* Timeline */}
        <ActivityTimeline events={mockTimeline} title="My Recent Healthcare Activity" />
      </div>
    </DashboardShell>
  );
}
