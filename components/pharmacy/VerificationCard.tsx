'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Link as LinkIcon, User, Stethoscope, Calendar } from 'lucide-react';

export interface VerifiedPrescription {
  prescriptionId: string;
  patientName: string;
  doctorName: string;
  issueDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'DISPENSED' | 'EXPIRED';
  medicines: Array<{ name: string; dosage: string; quantity: number }>;
  txHash: string;
  blockNumber: number;
  ipfsHash: string;
}

export default function VerificationCard({ prescription }: { prescription: VerifiedPrescription }) {
  const isValid = prescription.status === 'ACTIVE';

  return (
    <div className={`rounded-2xl border p-6 animate-in zoom-in-95 duration-300 ${
      isValid 
        ? 'bg-emerald-500/5 border-emerald-500/30' 
        : 'bg-rose-500/5 border-rose-500/30'
    }`}>
      {/* Header Status Banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl mb-5 ${
        isValid ? 'bg-emerald-500/10' : 'bg-rose-500/10'
      }`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isValid ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
        }`}>
          {isValid ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
        </div>
        <div>
          <p className={`text-sm font-bold ${isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isValid ? 'Blockchain Verified — Safe to Dispense' : `Prescription ${prescription.status} — Cannot Dispense`}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Polygon Amoy Testnet • Block #{prescription.blockNumber.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Patient / Doctor Row */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Patient</p>
            <p className="text-xs font-semibold text-slate-800 dark:text-white">{prescription.patientName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Doctor</p>
            <p className="text-xs font-semibold text-slate-800 dark:text-white">{prescription.doctorName}</p>
          </div>
        </div>
      </div>

      {/* Medicines */}
      <div className="mb-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Prescribed Medicines</p>
        <div className="space-y-1.5">
          {prescription.medicines.map((med, i) => (
            <div key={i} className="flex justify-between items-center text-xs px-3 py-2 bg-slate-500/5 rounded-lg border border-border/30">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{med.name}</span>
              <div className="flex gap-3 text-slate-400">
                <span>{med.dosage}</span>
                <span>Qty: <span className="text-slate-600 dark:text-slate-300 font-bold">{med.quantity}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dates and Hash */}
      <div className="pt-4 border-t border-border/30 space-y-2 font-mono text-[10px]">
        <div className="flex justify-between">
          <span className="text-slate-400 font-sans">Rx ID:</span>
          <span className="text-slate-600 dark:text-slate-300 select-all">{prescription.prescriptionId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 font-sans">Tx Hash:</span>
          <span className="text-slate-600 dark:text-slate-300 select-all truncate max-w-[200px]">
            {prescription.txHash.substring(0, 12)}...{prescription.txHash.substring(prescription.txHash.length - 8)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400 font-sans">Expires:</span>
          <span className="text-slate-600 dark:text-slate-300">{prescription.expiryDate}</span>
        </div>
      </div>
    </div>
  );
}
