'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import BlockchainExplorer from '@/components/blockchain/BlockchainExplorer';

export default function CitizenBlockchainRecords() {
  return (
    <DashboardShell title="Blockchain Records">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Your Blockchain Ledger Records</h2>
          <p className="text-xs text-muted-foreground mt-0.5">View all on-chain transactions related to your prescriptions on Polygon Amoy testnet.</p>
        </div>
        <BlockchainExplorer />
      </div>
    </DashboardShell>
  );
}
