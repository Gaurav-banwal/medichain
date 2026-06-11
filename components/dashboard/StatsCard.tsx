'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'indigo';
}

export default function StatsCard({ 
  title, 
  value, 
  icon: IconComponent, 
  description, 
  trend, 
  color = 'primary' 
}: StatsCardProps) {
  const colorMap = {
    primary: 'from-sky-500/10 to-sky-500/5 text-sky-500 border-sky-500/20 bg-sky-500/5',
    success: 'from-emerald-500/10 to-emerald-500/5 text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    warning: 'from-amber-500/10 to-amber-500/5 text-amber-500 border-amber-500/20 bg-amber-500/5',
    indigo: 'from-indigo-500/10 to-indigo-500/5 text-indigo-500 border-indigo-500/20 bg-indigo-500/5',
  };

  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-border/50">
      <div className="flex items-center justify-between">
        {/* Title */}
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        
        {/* Icon Wrapper */}
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colorMap[color]}`}>
          <IconComponent className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2.5">
        {/* Value */}
        <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-3xl">
          {value}
        </span>
        
        {/* Trend Indicator */}
        {trend && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            trend.isPositive 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="mt-2 text-xs text-muted-foreground font-medium">
          {description}
        </p>
      )}
    </div>
  );
}
