'use client';

import React from 'react';
import QRGenerator from './QRGenerator';
import { X, ShieldCheck, Calendar, User, UserCheck, Stethoscope, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export interface MedicineItem {
  name: string;
  dosage: string;
  duration: string;
  quantity: number;
}

export interface Prescription {
  id: string;
  prescriptionId: string;
  doctorName: string;
  patientName: string;
  abhaId: string;
  ipfsHash: string;
  status: 'ACTIVE' | 'DISPENSED' | 'EXPIRED';
  issueDate: string;
  expiryDate: string;
  medicines: MedicineItem[];
  txHash?: string;
  blockNumber?: number;
}

interface PrescriptionDetailsProps {
  prescription: Prescription | null;
  onClose: () => void;
}

export default function PrescriptionDetails({ prescription, onClose }: PrescriptionDetailsProps) {
  if (!prescription) return null;

  const statusColors = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
    DISPENSED: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400',
    EXPIRED: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
  };

  const statusIcons = {
    ACTIVE: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    DISPENSED: <UserCheck className="w-4 h-4 text-indigo-500" />,
    EXPIRED: <AlertCircle className="w-4 h-4 text-rose-500" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-background border border-border/80 p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 h-8 w-8 flex items-center justify-center rounded-lg border border-border/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5 mb-6">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Blockchain Record Node
            </span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-1">
              Prescription Details
            </h2>
          </div>
          
          <div className="flex items-center gap-2.5">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[prescription.status]}`}>
              {statusIcons[prescription.status]}
              <span>{prescription.status}</span>
            </span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Details Section */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Stakeholders Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Doctor */}
              <div className="p-4 bg-slate-500/5 dark:bg-slate-500/[0.02] border border-border/30 rounded-2xl flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Doctor Authority</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5 truncate">{prescription.doctorName}</p>
                  <p className="text-[10px] text-muted-foreground">Reg. Medical Practitioner</p>
                </div>
              </div>

              {/* Patient */}
              <div className="p-4 bg-slate-500/5 dark:bg-slate-500/[0.02] border border-border/30 rounded-2xl flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Patient (Citizen)</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5 truncate">{prescription.patientName}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">ABHA: {prescription.abhaId}</p>
                </div>
              </div>
            </div>

            {/* Medicines List */}
            <div className="border border-border/40 rounded-2xl overflow-hidden bg-slate-500/[0.01]">
              <div className="px-4 py-3 border-b border-border/40 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Prescribed Medication List
                </h3>
              </div>
              <div className="divide-y divide-border/30">
                {prescription.medicines.map((med, index) => (
                  <div key={index} className="px-4 py-3 flex items-center justify-between text-xs hover:bg-slate-500/[0.01]">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{med.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Dosage: {med.dosage} • Duration: {med.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-700 dark:text-slate-300">Qty: {med.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timestamps & Ledger Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Issued: {prescription.issueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4 text-primary" />
                <span>Expires: {prescription.expiryDate}</span>
              </div>
            </div>

            {/* Blockchain Details Section */}
            <div className="p-4 bg-indigo-500/[0.02] border border-indigo-500/10 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500">
                <ShieldCheck className="w-4.5 h-4.5" />
                <span>On-Chain Audit Records</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 font-mono text-[10px] pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">IPFS Metadata Hash:</span>
                  <span className="text-slate-600 dark:text-slate-300 select-all truncate max-w-[200px]">{prescription.ipfsHash}</span>
                </div>
                {prescription.txHash && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transaction ID:</span>
                    <span className="text-slate-600 dark:text-slate-300 select-all truncate max-w-[200px]">{prescription.txHash}</span>
                  </div>
                )}
                {prescription.blockNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Block Number:</span>
                    <span className="text-slate-600 dark:text-slate-300">#{prescription.blockNumber.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* QR Side */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <QRGenerator value={prescription.prescriptionId} title="Scan to Verify Ledger" />
            <p className="mt-4 text-[10px] text-center text-muted-foreground/80 max-w-xs mx-auto leading-relaxed">
              Scan this secure QR code at any certified pharmacy node. The blockchain verification occurs in real-time.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
