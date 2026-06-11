'use client';

import React, { useState } from 'react';
import { Camera, QrCode, Keyboard, HelpCircle, ArrowRight } from 'lucide-react';

export default function QRScanner({ onScan }: { onScan: (id: string) => void }) {
  const [manualId, setManualId] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      onScan(manualId.trim());
    }
  };

  const triggerMockScan = () => {
    // Simulate finding a code MC-482938
    const mockId = `MC-${Math.floor(100000 + Math.random() * 900000)}`;
    onScan(mockId);
  };

  return (
    <div className="glass-card rounded-2xl border border-border/50 p-6 space-y-6 max-w-md mx-auto">
      {/* Tab Selectors */}
      <div className="flex gap-2 bg-slate-500/5 p-1 rounded-xl">
        <button
          onClick={() => setIsScanning(true)}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isScanning ? 'bg-white text-slate-800 dark:bg-slate-800 dark:text-white shadow-sm' : 'text-slate-400'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Active Scan</span>
        </button>
        <button
          onClick={() => setIsScanning(false)}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            !isScanning ? 'bg-white text-slate-800 dark:bg-slate-800 dark:text-white shadow-sm' : 'text-slate-400'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>Manual Input</span>
        </button>
      </div>

      {isScanning ? (
        /* QR Camera Simulator */
        <div className="space-y-4 text-center">
          <div className="relative aspect-square w-full rounded-2xl bg-black overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Pulsing grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            {/* Lasers scanning effect */}
            <div className="absolute left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981] animate-bounce [animation-duration:3s]"></div>
            
            {/* Frame corners */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
            
            {/* QR Icon */}
            <QrCode className="w-16 h-16 text-slate-800 dark:text-slate-900 animate-pulse" />
            
            <span className="absolute bottom-4 text-[10px] font-bold tracking-widest text-emerald-500 uppercase bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              Camera Nodes Active
            </span>
          </div>

          <button
            onClick={triggerMockScan}
            className="w-full h-10 rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 transition-all cursor-pointer"
          >
            Simulate Scan Action
          </button>
        </div>
      ) : (
        /* Manual Form Input */
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Prescription ID Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="MC-482938"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="h-10 flex-1 rounded-xl border border-border/50 bg-background/50 px-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-primary dark:text-white dark:border-border/30 transition-colors"
              />
              <button
                type="submit"
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/10 hover:bg-primary/95 cursor-pointer shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex gap-2 items-start text-[10px] text-slate-400 leading-normal p-3 bg-slate-500/5 rounded-xl border border-border/30">
            <HelpCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
            <span>Enter the prescription reference ID found below the QR code to pull data from Polygon.</span>
          </div>
        </form>
      )}
    </div>
  );
}
