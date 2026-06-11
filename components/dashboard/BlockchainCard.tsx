'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../shared/AuthContext';
import { Layers, ShieldCheck, Cpu, Flame, CheckCircle2 } from 'lucide-react';

export default function BlockchainCard() {
  const { walletAddress } = useAuth();
  const [blockHeight, setBlockHeight] = useState(4829381);
  const [gasPrice, setGasPrice] = useState(32);

  // Simulate block count growth and fluctuating gas fee
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight(prev => prev + 1);
      setGasPrice(prev => Math.max(12, Math.min(90, prev + Math.floor(Math.random() * 7) - 3)));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50 bg-gradient-to-br from-indigo-500/[0.02] to-primary/[0.02]">
      <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Ledger Connection
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Network status item */}
        <div className="p-3 bg-slate-500/5 dark:bg-slate-500/[0.02] border border-border/30 rounded-xl">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Network Node</span>
          </div>
          <p className="mt-1.5 text-xs font-bold text-slate-800 dark:text-white">
            Polygon Amoy
          </p>
        </div>

        {/* Block height status item */}
        <div className="p-3 bg-slate-500/5 dark:bg-slate-500/[0.02] border border-border/30 rounded-xl">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold uppercase">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Block Height</span>
          </div>
          <p className="mt-1.5 text-xs font-mono font-bold text-slate-800 dark:text-white animate-pulse">
            #{blockHeight.toLocaleString()}
          </p>
        </div>

        {/* Gas fee status item */}
        <div className="p-3 bg-slate-500/5 dark:bg-slate-500/[0.02] border border-border/30 rounded-xl">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Gas Price</span>
          </div>
          <p className="mt-1.5 text-xs font-bold text-slate-800 dark:text-white">
            {gasPrice} Gwei
          </p>
        </div>

        {/* Connected wallet status item */}
        <div className="p-3 bg-slate-500/5 dark:bg-slate-500/[0.02] border border-border/30 rounded-xl">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Wallet Status</span>
          </div>
          <p className="mt-1.5 text-[11px] font-semibold text-slate-800 dark:text-white truncate">
            {walletAddress ? 'Linked & Signed' : 'Not Linked'}
          </p>
        </div>
      </div>
      
      <div className="mt-5 border-t border-border/40 pt-4 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between font-medium">
        <span>Amoy Smart Contract</span>
        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[9px] border border-border/40 select-all cursor-pointer">
          0x71C4B...7595
        </span>
      </div>
    </div>
  );
}
