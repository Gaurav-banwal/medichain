'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  QrCode, 
  User, 
  Pill, 
  Calendar, 
  FileText, 
  Clock, 
  Eye, 
  X, 
  Download, 
  ExternalLink,
  ChevronRight,
  LogOut
} from 'lucide-react';

// Mock data tracking the Prisma schema fields exactly for mock validation flow
const INITIAL_PRESCRIPTIONS = [
  {
    id: "pr_1",
    prescriptionId: "MC-TX-9082",
    doctorName: "Dr. Arvind Sharma",
    institution: "AIIMS New Delhi",
    status: "ACTIVE", // ACTIVE, DISPENSED, EXPIRED
    expiryDate: "2026-08-15",
    ipfsHash: "QmXoypujjZisZ3X9Jv3K...789",
    items: [
      { name: "Amoxicillin 500mg", dosage: "1-0-1", duration: "5 Days", quantity: 10 },
      { name: "Paracetamol 650mg", dosage: "1-1-1", duration: "3 Days", quantity: 9 }
    ]
  },
  {
    id: "pr_2",
    prescriptionId: "MC-TX-4310",
    doctorName: "Dr. Meera Nair",
    institution: "Fortis Hospital",
    status: "DISPENSED",
    expiryDate: "2026-05-10",
    ipfsHash: "QmZ3KxoypujjZis9Jv7X...123",
    items: [
      { name: "Metformin 500mg", dosage: "0-1-0", duration: "30 Days", quantity: 30 }
    ]
  },
  {
    id: "pr_3",
    prescriptionId: "MC-TX-2219",
    doctorName: "Dr. Rajesh Patel",
    institution: "Apollo Clinics",
    status: "EXPIRED",
    expiryDate: "2026-03-01",
    ipfsHash: "QmYv7X3KxoypujjZis9J...456",
    items: [
      { name: "Cetirizine 10mg", dosage: "0-0-1", duration: "7 Days", quantity: 7 }
    ]
  }
];

export default function CitizenDashboard() {
  const [prescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [selectedPrescription, setSelectedPrescription] = useState<typeof INITIAL_PRESCRIPTIONS[0] | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Profile data mock representing Gov DigiLocker + ABHA verification fields
  const citizenProfile = {
    name: "Rohan Verma",
    abhaId: "91-2034-5891-0432",
    digilockerId: "DL-IND-883921",
    walletAddress: "0x7a2d...9b21"
  };

  const openQrModal = (prescription: typeof INITIAL_PRESCRIPTIONS[0]) => {
    setSelectedPrescription(prescription);
    setIsQrModalOpen(true);
  };

  return (
    <div className="bg-[#050505] text-[#e5e2e1] min-h-screen font-sans antialiased selection:bg-blue-500/30">
      
      {/* Fixed Dashboard Header Layout */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-[#131313]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-black font-bold" />
              </div>
              <span className="text-xl font-bold text-[#adc6ff] tracking-tight">MediChain</span>
            </Link>
            <span className="text-xs bg-white/10 text-[#c2c6d6] px-2 py-1 rounded-md font-mono">Citizen Vault</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">{citizenProfile.name}</span>
              <span className="text-[10px] text-[#c2c6d6] font-mono">ABHA: {citizenProfile.abhaId}</span>
            </div>
            <Link href="/">
              <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto pt-24 pb-16 px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Column: Verification Credentials Card */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full filter blur-xl"></div>
            
            <div className="flex flex-col items-center text-center pb-6 border-b border-white/10">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3 text-[#adc6ff]">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-white">{citizenProfile.name}</h2>
              <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> DigiLocker Verified
              </span>
            </div>

            <div className="flex flex-col gap-4 pt-6 font-mono text-xs">
              <div>
                <span className="text-[#c2c6d6] block text-[10px] uppercase font-sans tracking-wider mb-0.5">ABHA ID Number</span>
                <span className="text-white bg-white/5 px-2 py-1 rounded block border border-white/5">{citizenProfile.abhaId}</span>
              </div>
              <div>
                <span className="text-[#c2c6d6] block text-[10px] uppercase font-sans tracking-wider mb-0.5">DigiLocker Doc Anchor</span>
                <span className="text-white bg-white/5 px-2 py-1 rounded block border border-white/5">{citizenProfile.digilockerId}</span>
              </div>
              <div>
                <span className="text-[#c2c6d6] block text-[10px] uppercase font-sans tracking-wider mb-0.5">Connected Blockchain Wallet</span>
                <span className="text-[#5de6ff] bg-white/5 px-2 py-1 rounded block border border-white/5 truncate">{citizenProfile.walletAddress}</span>
              </div>
            </div>
          </div>

          {/* Quick Informational Box */}
          <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-5 text-xs text-[#c2c6d6] leading-relaxed">
            <p className="font-semibold text-white mb-1 flex items-center gap-1.5 text-[#adc6ff]">
              <QrCode className="w-4 h-4" /> Medicine Pickup Tip
            </p>
            When picking up prescriptions, click <span className="text-white font-medium">View QR</span> and allow the pharmacy node operator to scan it to instantly verify authenticity.
          </div>
        </section>

        {/* Right Side Column: Main Prescription Lifecycle Matrix Panel */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Your Digital Prescription Vault</h1>
              <p className="text-sm text-[#c2c6d6]">Real-time immutable files linked directly to your national healthcare signature.</p>
            </div>
          </div>

          {/* Grid Layout Listing Active/Dispatched Assets */}
          <div className="flex flex-col gap-4">
            {prescriptions.map((rx) => (
              <div 
                key={rx.id} 
                className="bg-[#131313] border border-white/10 rounded-2xl p-6 transition-all hover:border-white/20 relative group"
              >
                {/* Status Indicator Chip */}
                <div className="absolute top-6 right-6">
                  {rx.status === 'ACTIVE' && (
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-medium tracking-wide">
                      Active / Valid
                    </span>
                  )}
                  {rx.status === 'DISPENSED' && (
                    <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg font-medium tracking-wide">
                      Medicine Dispensed
                    </span>
                  )}
                  {rx.status === 'EXPIRED' && (
                    <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-lg font-medium tracking-wide">
                      Expired
                    </span>
                  )}
                </div>

                {/* Card Title Layer */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[#adc6ff]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{rx.doctorName}</h3>
                    <p className="text-xs text-[#c2c6d6] flex items-center gap-1 mt-0.5">
                      {rx.institution} • <Clock className="w-3 h-3" /> Valid Until: {rx.expiryDate}
                    </p>
                  </div>
                </div>

                {/* Inner Prescribed Item Block Grid */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-4">
                  <span className="text-[10px] text-[#c2c6d6] block uppercase tracking-wider mb-2 font-mono font-bold">Prescribed Regimen</span>
                  <div className="flex flex-col gap-2">
                    {rx.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-white flex items-center gap-1.5 font-medium">
                          <Pill className="w-3.5 h-3.5 text-teal-400" /> {item.name}
                        </span>
                        <span className="text-[#c2c6d6] font-mono">
                          {item.dosage} • {item.duration} ({item.quantity} Qty)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Bottom Bar */}
                <div className="flex flex-wrap justify-between items-center pt-2 border-t border-white/5 text-xs gap-3">
                  <span className="font-mono text-[#c2c6d6] text-[11px] truncate max-w-xs block">
                    IPFS HASH: <span className="text-blue-300">{rx.ipfsHash}</span>
                  </span>
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <a 
                      href={`https://amoy.polygonscan.com/`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> PolygonScan
                    </a>
                    <button 
                      onClick={() => openQrModal(rx)}
                      disabled={rx.status !== 'ACTIVE'}
                      className={`px-4 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                        rx.status === 'ACTIVE' 
                          ? 'bg-[#adc6ff] text-[#002e6a] hover:opacity-90 active:scale-95' 
                          : 'bg-white/5 border border-white/5 text-[#c2c6d6] cursor-not-allowed'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" /> View QR
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Interactive QR Presentation Frame Overlay Modal */}
      {isQrModalOpen && selectedPrescription && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131313] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 border border-white/10 text-[#c2c6d6] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center flex flex-col items-center">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-md font-mono mb-4">
                Valid Verification Key
              </span>
              <h2 className="text-lg font-bold text-white mb-1">{selectedPrescription.doctorName}</h2>
              <p className="text-xs text-[#c2c6d6] mb-6">ID Token: {selectedPrescription.prescriptionId}</p>

              {/* Vector Representation of QR Container mapping onto Stitch parameters */}
              <div className="bg-white p-4 rounded-xl shadow-inner mb-6 relative group">
                <div className="w-48 h-48 border-4 border-dashed border-slate-200 flex items-center justify-center relative">
                  <QrCode className="w-36 h-36 text-black" strokeWidth={1.5} />
                  {/* Subtle target alignment brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
                </div>
              </div>

              <p className="text-xs text-[#c2c6d6] max-w-xs leading-relaxed mb-6">
                Present this encrypted ledger token matrix block to your local approved pharmacist point-of-sale scanner device terminal.
              </p>

              <div className="w-full flex gap-3">
                <button 
                  onClick={() => setIsQrModalOpen(false)}
                  className="flex-1 py-2.5 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/5 transition-colors"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => alert("Downloading presentation pass...")}
                  className="flex-1 py-2.5 bg-blue-500 text-black rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download Pass
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}