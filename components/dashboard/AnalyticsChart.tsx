'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface AnalyticsChartProps {
  title: string;
  data: Array<{ name: string; value: number; value2?: number }>;
  dataKey: string;
  dataKey2?: string;
  color?: string;
  color2?: string;
}

export default function AnalyticsChart({
  title,
  data,
  dataKey,
  dataKey2,
  color = '#0284c7', // primary (Sky 600)
  color2 = '#10b981', // secondary (Emerald 500)
}: AnalyticsChartProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-6">
        {title}
      </h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
              {dataKey2 && (
                <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color2} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color2} stopOpacity={0} />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '11px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
            {dataKey2 && (
              <Area
                type="monotone"
                dataKey={dataKey2}
                stroke={color2}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue2)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
