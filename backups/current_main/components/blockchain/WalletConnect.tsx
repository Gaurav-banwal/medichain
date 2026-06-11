'use client';

import React from 'react';
import { useAuth } from '../shared/AuthContext';
import { Wallet, Check, AlertCircle } from 'lucide-react';

export default function WalletConnect() {
  const { walletAddress, connectWallet, disconnectWallet } = useAuth();

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (walletAddress) {
    return (
      <div className="flex items-center gap-2">
        {/* Network Badge */}
        <span className="hidden lg:flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 tracking-wider">
          POLYGON AMOY
        </span>
        
        {/* Wallet Address Action Button */}
        <button
          onClick={disconnectWallet}
          className="group flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 transition-all duration-200 cursor-pointer"
          title="Disconnect Wallet"
        >
          <Check className="w-3.5 h-3.5 group-hover:hidden" />
          <AlertCircle className="w-3.5 h-3.5 hidden group-hover:block text-rose-500" />
          <span className="group-hover:hidden">{truncateAddress(walletAddress)}</span>
          <span className="hidden group-hover:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary/95 transition-all hover:scale-[1.02] cursor-pointer"
    >
      <Wallet className="w-3.5 h-3.5" />
      <span>Link Wallet</span>
    </button>
  );
}
