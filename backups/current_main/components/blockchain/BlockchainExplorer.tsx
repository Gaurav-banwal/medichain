'use client';

import React, { useState } from 'react';
import TransactionCard, { TransactionData } from './TransactionCard';
import { Search, RotateCcw, ShieldCheck } from 'lucide-react';

const mockTransactions: TransactionData[] = [
  {
    txHash: '0x3bf9a8d9b1c7811ef123b1b7596e7614d1487595',
    blockNumber: 4829381,
    fromAddress: '0x71C4B4E839878a7f9c41b1B7596E7614d1487595',
    toAddress: '0x0284c78129038cb2e93b1b7596e7614d1487595',
    action: 'Prescription Created',
    timestamp: '2 mins ago',
    gasUsed: '0.000421',
  },
  {
    txHash: '0x7e3a61f224b1c7812eb123b1b7596e7614d1487595',
    blockNumber: 4829378,
    fromAddress: '0x0284c78129038cb2e93b1b7596e7614d1487595',
    toAddress: '0x10b981249b1c7812eb123b1b7596e7614d1487595',
    action: 'Prescription Verified',
    timestamp: '15 mins ago',
    gasUsed: '0.000210',
  },
  {
    txHash: '0x9d2e16f391b1c7812ab123b1b7596e7614d1487595',
    blockNumber: 4829352,
    fromAddress: '0x10b981249b1c7812eb123b1b7596e7614d1487595',
    toAddress: '0x71C4B4E839878a7f9c41b1B7596E7614d1487595',
    action: 'Prescription Dispensed',
    timestamp: '1 hour ago',
    gasUsed: '0.000582',
  },
  {
    txHash: '0xf83c21a421b1c7812bb123b1b7596e7614d1487595',
    blockNumber: 4829310,
    fromAddress: '0x71C4B4E839878a7f9c41b1B7596E7614d1487595',
    toAddress: '0x0284c78129038cb2e93b1b7596e7614d1487595',
    action: 'Prescription Revoked',
    timestamp: '4 hours ago',
    gasUsed: '0.000311',
  }
];

export default function BlockchainExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<TransactionData[]>(mockTransactions);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setTransactions(mockTransactions);
      return;
    }
    const query = searchQuery.trim().toLowerCase();
    const filtered = mockTransactions.filter(
      (tx) =>
        tx.txHash.toLowerCase().includes(query) ||
        tx.fromAddress.toLowerCase().includes(query) ||
        tx.action.toLowerCase().includes(query) ||
        tx.blockNumber.toString() === query
    );
    setTransactions(filtered);
  };

  const handleReset = () => {
    setSearchQuery('');
    setTransactions(mockTransactions);
  };

  return (
    <div className="space-y-6">
      {/* Search Console */}
      <div className="glass-panel rounded-2xl p-6 border border-border/40">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Ledger Scan Explorer
          </h2>
        </div>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Block, Tx Hash, Wallet address, or Action Node..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/50 bg-background/50 pl-10 pr-4 text-xs font-semibold text-slate-800 outline-none focus:border-primary dark:text-white dark:border-border/30 transition-colors"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="submit"
              className="h-11 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 transition-all cursor-pointer"
            >
              Scan
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="h-11 w-11 flex items-center justify-center rounded-xl border border-border/50 hover:bg-slate-50 dark:border-border/30 dark:hover:bg-slate-900 transition-colors text-slate-500 hover:text-slate-800 cursor-pointer"
              title="Reset scan"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Grid of Results */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Ledger Transactions ({transactions.length})
          </span>
          {searchQuery && (
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
              Filter Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions.map((tx) => (
            <TransactionCard key={tx.txHash} tx={tx} />
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center border border-border/50">
            <p className="text-sm text-slate-400 dark:text-slate-600">
              No transactions matching the query were found on the Polygon blockchain ledger.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
