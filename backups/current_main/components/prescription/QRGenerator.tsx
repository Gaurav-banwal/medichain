'use client';

import React, { useState } from 'react';
import { QrCode, Download, Copy, Check } from 'lucide-react';

export default function QRGenerator({ value, title = 'Prescription QR Verifier' }: { value: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(value)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-slate-500/5 border border-border/30 rounded-2xl max-w-sm mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="w-4.5 h-4.5 text-primary animate-pulse" />
        <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
          {title}
        </h4>
      </div>

      {/* QR Code Container */}
      <div className="relative p-4 bg-white dark:bg-slate-900 rounded-xl border border-border/50 shadow-inner flex items-center justify-center w-[180px] h-[180px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt="Prescription QR Code"
          className="w-full h-full object-contain dark:invert-0"
        />
      </div>

      <p className="mt-4 text-[10px] font-mono text-muted-foreground truncate w-full text-center select-all">
        Hash: {value}
      </p>

      {/* Controls */}
      <div className="mt-5 flex gap-2 w-full">
        <button
          onClick={handleCopy}
          className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg border border-border/50 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:border-border/30 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Hash</span>
            </>
          )}
        </button>
        
        <a
          href={qrUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:border-border/30 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
          title="Open Image"
        >
          <Download className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
