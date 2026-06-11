'use client';

import DashboardShell from '@/components/shared/DashboardShell';
import BlockchainExplorer from '@/components/blockchain/BlockchainExplorer';

export default function RegulatorBlockchainExplorer() {
  return (
    <DashboardShell title="Blockchain Scan">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Blockchain Ledger Explorer</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Search and inspect all on-chain transactions across the MediChain Polygon smart contract.</p>
        </div>
        <BlockchainExplorer />
      </div>
    </DashboardShell>
  );
}
