'use client';

import React from 'react';

export default function Loader({ size = 'md', text = 'Loading Secure Ledger...' }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-6">
      <div className="relative flex items-center justify-center">
        {/* Outer Blockchain Ring */}
        <div className={`${sizeClasses[size]} border-4 border-dashed border-primary rounded-full animate-spin [animation-duration:8s]`}></div>
        
        {/* Middle Pulse Ring */}
        <div className={`absolute ${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-20 h-20' : 'w-12 h-12'} border-4 border-emerald-500/40 rounded-full animate-ping [animation-duration:1.5s]`}></div>
        
        {/* Inner Heartbeat Node */}
        <div className={`absolute ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-14 h-14' : 'w-8 h-8'} bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center shadow-lg shadow-primary/20`}>
          <svg className={`${size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'} text-white animate-pulse`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
      
      {text && (
        <span className="mt-6 text-sm font-semibold tracking-wide text-muted-foreground/80 dark:text-muted-foreground animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}
