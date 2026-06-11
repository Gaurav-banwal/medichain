'use client';

import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, ExternalLink, HelpCircle } from 'lucide-react';

export interface TransactionData {
  txHash: string;
  blockNumber: number;
  fromAddress: string;
  toAddress: string;
  action: string;
  timestamp: string;
  gasUsed: string;
}

export default function TransactionCard({ tx }: { tx: TransactionData }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tx.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncate = (str: string) => {
    return `${str.substring(0, 10)}...${str.substring(str.length - 8)}`;
  };

  return (
    <div className="glass-card rounded-xl border border-border/50 p-5 bg-gradient-to-br from-indigo-500/[0.01] to-slate-500/[0.01] hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/30 pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
          <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            {tx.action}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-medium">
          {tx.timestamp}
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-[11px]">
        {/* Hash */}
        <div className="flex justify-between items-center gap-4">
          <span className="text-slate-400 font-sans">Tx Hash:</span>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="select-all">{truncate(tx.txHash)}</span>
            <button
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              title="Copy Hash"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Block */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-sans">Block:</span>
          <span className="text-slate-700 dark:text-slate-300">#{tx.blockNumber.toLocaleString()}</span>
        </div>

        {/* Sender */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-sans">From:</span>
          <span className="text-slate-700 dark:text-slate-300 select-all">{truncate(tx.fromAddress)}</span>
        </div>

        {/* Receiver */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-sans">Contract To:</span>
          <span className="text-slate-700 dark:text-slate-300 select-all">{truncate(tx.toAddress)}</span>
        </div>

        {/* Gas */}
        <div className="flex justify-between items-center border-t border-border/30 pt-2.5 mt-2.5">
          <span className="text-slate-400 font-sans">Gas Cost:</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">{tx.gasUsed} ETH</span>
        </div>
      </div>
    </div>
  );
}
