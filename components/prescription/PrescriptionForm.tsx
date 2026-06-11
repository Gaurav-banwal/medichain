'use client';

import React, { useState } from 'react';
import QRGenerator from './QRGenerator';
import { Plus, Trash, ShieldCheck, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

interface MedicineInput {
  name: string;
  dosage: string;
  duration: string;
  quantity: number;
}

export default function PrescriptionForm() {
  const [patientName, setPatientName] = useState('');
  const [abhaId, setAbhaId] = useState('');
  const [expiryDays, setExpiryDays] = useState('30');
  const [medicines, setMedicines] = useState<MedicineInput[]>([{ name: '', dosage: '1-0-1', duration: '5 days', quantity: 5 }]);
  
  const [submitting, setSubmitting] = useState(false);
  const [createdPrescriptionId, setCreatedPrescriptionId] = useState<string | null>(null);
  const [createdTxHash, setCreatedTxHash] = useState<string | null>(null);

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '1-0-1', duration: '5 days', quantity: 5 }]);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof MedicineInput, val: any) => {
    const next = [...medicines];
    next[index] = { ...next[index], [field]: val };
    setMedicines(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !abhaId.trim()) {
      alert('Please fill out patient identification details.');
      return;
    }

    setSubmitting(true);

    // Mock contract invocation & IPFS upload latency
    setTimeout(() => {
      const generatedId = `MC-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedTx = `0x3bf9a8d${Math.random().toString(16).substring(2, 10)}b1c7811ef123b1b7596e7614d1487595`;
      
      setCreatedPrescriptionId(generatedId);
      setCreatedTxHash(generatedTx);
      setSubmitting(false);
    }, 2000);
  };

  const resetForm = () => {
    setPatientName('');
    setAbhaId('');
    setExpiryDays('30');
    setMedicines([{ name: '', dosage: '1-0-1', duration: '5 days', quantity: 5 }]);
    setCreatedPrescriptionId(null);
    setCreatedTxHash(null);
  };

  if (createdPrescriptionId && createdTxHash) {
    return (
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-border/50 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Prescription Ledger Initialized</h2>
        <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6">
          The prescription metadata was uploaded to IPFS and the cryptographic hash was committed to the Polygon blockchain ledger node.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border border-border/30 rounded-2xl p-6 bg-slate-500/[0.01]">
          {/* Details side */}
          <div className="text-left space-y-3 font-medium text-xs">
            <div>
              <p className="text-slate-400">Prescription ID:</p>
              <p className="font-mono text-sm font-bold text-slate-800 dark:text-white">{createdPrescriptionId}</p>
            </div>
            <div>
              <p className="text-slate-400">Patient ABHA:</p>
              <p className="font-mono text-slate-800 dark:text-white">{abhaId}</p>
            </div>
            <div>
              <p className="text-slate-400">Ledger Commited Hash:</p>
              <p className="font-mono text-slate-600 dark:text-slate-300 truncate max-w-[200px] select-all">{createdTxHash}</p>
            </div>
          </div>
          
          {/* QR Code generator */}
          <div className="flex justify-center">
            <QRGenerator value={createdPrescriptionId} title="Scan for Verification" />
          </div>
        </div>

        <button
          onClick={resetForm}
          className="mt-6 h-10 px-6 rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>Issue Another</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-border/50 p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 border-b border-border/40 pb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
          Create Digital Prescription
        </h2>
      </div>

      {/* Patient Identification */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Patient Full Name</label>
          <input
            type="text"
            required
            placeholder="John Doe"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/50 bg-background/50 px-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-primary dark:text-white dark:border-border/30 transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">14-Digit ABHA ID</label>
          <input
            type="text"
            required
            placeholder="91-2093-8472-1823"
            value={abhaId}
            onChange={(e) => setAbhaId(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/50 bg-background/50 px-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-primary dark:text-white dark:border-border/30 transition-colors"
          />
        </div>
      </div>

      {/* Expiration Settings */}
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Prescription Validity</label>
        <select
          value={expiryDays}
          onChange={(e) => setExpiryDays(e.target.value)}
          className="h-10 w-full rounded-xl border border-border/50 bg-background px-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-primary dark:text-white dark:border-border/30 transition-colors"
        >
          <option value="7">7 Days (Short Term)</option>
          <option value="30">30 Days (Standard)</option>
          <option value="90">90 Days (Long Term)</option>
          <option value="180">180 Days (Chronic Care)</option>
        </select>
      </div>

      {/* Medications Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Medications ({medicines.length})</span>
          <button
            type="button"
            onClick={addMedicine}
            className="h-8 px-3 rounded-lg border border-primary/20 text-[11px] font-bold text-primary hover:bg-primary/5 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-3.5">
          {medicines.map((med, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 border border-border/30 bg-slate-500/5 dark:bg-slate-500/[0.01] rounded-2xl animate-in fade-in duration-200">
              {/* Name */}
              <div className="col-span-12 sm:col-span-4">
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1.5">Medicine Name</label>
                <input
                  type="text"
                  required
                  placeholder="Amoxicillin 500mg"
                  value={med.name}
                  onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                  className="h-9 w-full rounded-lg border border-border/50 bg-background px-3 text-xs font-semibold text-slate-800 outline-none focus:border-primary dark:text-white dark:border-border/30 transition-colors"
                />
              </div>
              
              {/* Dosage */}
              <div className="col-span-12 sm:col-span-3">
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1.5">Dosage Cycle</label>
                <input
                  type="text"
                  required
                  placeholder="1-0-1"
                  value={med.dosage}
                  onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                  className="h-9 w-full rounded-lg border border-border/50 bg-background px-3 text-xs font-semibold text-slate-800 outline-none focus:border-primary dark:text-white dark:border-border/30 transition-colors"
                />
              </div>

              {/* Duration */}
              <div className="col-span-6 sm:col-span-3">
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1.5">Duration</label>
                <input
                  type="text"
                  required
                  placeholder="5 days"
                  value={med.duration}
                  onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                  className="h-9 w-full rounded-lg border border-border/50 bg-background px-3 text-xs font-semibold text-slate-800 outline-none focus:border-primary dark:text-white dark:border-border/30 transition-colors"
                />
              </div>

              {/* Quantity */}
              <div className="col-span-4 sm:col-span-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1.5">Qty</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={med.quantity}
                  onChange={(e) => handleMedicineChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="h-9 w-full rounded-lg border border-border/50 bg-background px-2 text-xs font-semibold text-slate-800 outline-none focus:border-primary dark:text-white dark:border-border/30 transition-colors"
                />
              </div>

              {/* Action */}
              <div className="col-span-2 sm:col-span-0.5 flex justify-end">
                <button
                  type="button"
                  disabled={medicines.length === 1}
                  onClick={() => removeMedicine(index)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg border border-rose-500/10 text-rose-500 hover:bg-rose-500/10 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Remove medicine"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Submission */}
      <div className="pt-4 border-t border-border/40 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="h-10 px-6 rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{submitting ? 'Generating On-Chain Record...' : 'Publish to Blockchain'}</span>
        </button>
      </div>
    </form>
  );
}
