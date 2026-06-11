'use client';

import React, { useState } from 'react';
import PrescriptionDetails, { Prescription } from './PrescriptionDetails';
import { Search, Eye, Filter, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface PrescriptionTableProps {
  prescriptions: Prescription[];
  role: 'CITIZEN' | 'DOCTOR' | 'PHARMACY' | 'REGULATOR';
}

export default function PrescriptionTable({ prescriptions, role }: { prescriptions: Prescription[]; role: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DISPENSED' | 'EXPIRED'>('ALL');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const filtered = prescriptions.filter((item: any) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      item.doctorName.toLowerCase().includes(query) ||
      item.patientName.toLowerCase().includes(query) ||
      item.prescriptionId.toLowerCase().includes(query) ||
      item.medicines.some((m: any) => m.name.toLowerCase().includes(query));

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Prescription['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active</span>
          </span>
        );
      case 'DISPENSED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Dispensed</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            <span>Expired</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Filter Dashboard Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/50 bg-background/50 pl-10 pr-4 text-xs font-semibold text-slate-800 outline-none focus:border-primary dark:text-white dark:border-border/30 transition-colors"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex gap-1 bg-slate-500/5 dark:bg-slate-500/[0.02] border border-border/40 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {(['ALL', 'ACTIVE', 'DISPENSED', 'EXPIRED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === status
                  ? 'bg-white text-slate-800 dark:bg-slate-800 dark:text-white shadow-sm'
                  : 'text-muted-foreground hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Prescription Code</th>
                <th className="px-5 py-3">{role === 'DOCTOR' ? 'Patient Name' : 'Physician'}</th>
                <th className="px-5 py-3">Medications</th>
                <th className="px-5 py-3">Issue Date</th>
                <th className="px-5 py-3">Expiry</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-500/[0.01] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[10px] text-slate-500 dark:text-slate-400 select-all">
                    {item.prescriptionId}
                  </td>
                  <td className="px-5 py-3.5 text-slate-800 dark:text-slate-200">
                    {role === 'DOCTOR' ? item.patientName : item.doctorName}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                    {item.medicines.map((m: any) => m.name).join(', ')}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {item.issueDate}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {item.expiryDate}
                  </td>
                  <td className="px-5 py-3.5">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedPrescription(item)}
                      className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border/50 text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:border-border/30 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
                      title="Inspect Prescription Node"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400 dark:text-slate-600">
                    No prescription records match the filter query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Dialog overlay */}
      {selectedPrescription && (
        <PrescriptionDetails
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </div>
  );
}
