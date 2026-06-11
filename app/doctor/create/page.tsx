'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Wallet, 
  Shield, 
  Search, 
  Bell, 
  RefreshCw, 
  Settings, 
  QrCode, 
  Plus, 
  Trash2, 
  CloudLightning, 
  CheckCircle2, 
  User as UserIcon
} from 'lucide-react';

interface MedicineItem {
  id: string;
  name: string;
  category: string;
  dosage: [number, number, number];
  duration: string;
  daysLabel: string;
  quantity: string;
}

const INITIAL_MEDICINES: MedicineItem[] = [
  {
    id: "med_1",
    name: "Amoxicillin 500mg",
    category: "Antibiotic - Take after meals",
    dosage: [1, 0, 1],
    duration: "5 Days",
    daysLabel: "M - T - W - T - F",
    quantity: "15 Tabs"
  }
];

export default function PrescriptionWizard() {
  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [abhaQuery, setAbhaQuery] = useState("91-2234-5678-9012");
  const [isFetched, setIsFetched] = useState(true);
  
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("10 Tabs");

  const addMedicine = () => {
    if (!newName) return;
    const newItem: MedicineItem = {
      id: `med_${Date.now()}`,
      name: newName,
      category: "Prescribed Therapy Dosage",
      dosage: [1, 1, 1],
      duration: "7 Days",
      daysLabel: "Daily Regimen",
      quantity: newQty
    };
    setMedicines([...medicines, newItem]);
    setNewName("");
  };

  const deleteMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  return (
    <div className="bg-[#050505] text-[#e5e2e1] min-h-screen font-sans antialiased overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Left Navigation Aside bar */}
      <aside className="h-full w-64 fixed left-0 top-0 border-r border-white/5 flex flex-col py-4 z-50 bg-[#050505]">
        <div className="px-6 mb-10">
          <span className="text-xl font-bold text-[#adc6ff] tracking-tight block">MediChain</span>
          <span className="text-[10px] text-[#8c909f] uppercase font-mono tracking-widest block mt-0.5">Verified Node 042</span>
        </div>
        
        <nav className="flex-1 space-y-2 px-4">
          <Link href="/doctor" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8c909f] hover:bg-white/5 transition-colors text-sm font-medium">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link href="/doctor/create" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#adc6ff] font-bold border-r-2 border-[#adc6ff] bg-white/5 transition-colors text-sm">
            <FileText className="h-4 w-4" />
            <span>Prescriptions</span>
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8c909f] hover:bg-white/5 transition-colors text-sm font-medium">
            <Users className="h-4 w-4" />
            <span>Patient Records</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8c909f] hover:bg-white/5 transition-colors text-sm font-medium">
            <Wallet className="h-4 w-4" />
            <span>Blockchain Registry</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8c909f] hover:bg-white/5 transition-colors text-sm font-medium">
            <Shield className="h-4 w-4" />
            <span>Security Settings</span>
          </a>
        </nav>
        
        <div className="px-4 mt-auto">
          <div className="bg-slate-950/60 border border-white/5 p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 opacity-80" />
            <div>
              <p className="text-xs font-bold text-white">Dr. Sarah Chen</p>
              <p className="text-[10px] text-[#8c909f]">Cardiology Unit</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Top Application Header Control Bar */}
      <header className="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-6 bg-[#131313]/65 backdrop-blur-xl border-b border-white/10 z-40">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f] h-3.5 w-3.5" />
            <input 
              className="w-full bg-[#1c1b1b] border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-xs text-white focus:border-[#5de6ff] transition-all outline-none" 
              placeholder="Quick Navigation Search..." 
              type="text" 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <h2 className="text-base font-semibold text-[#adc6ff] hidden md:block">Prescription Wizard</h2>
          <div className="flex items-center gap-3">
            <button className="text-[#8c909f] hover:text-[#5de6ff] transition-colors"><Bell className="w-4 h-4" /></button>
            <button className="text-[#8c909f] hover:text-[#5de6ff] transition-colors"><RefreshCw className="w-4 h-4" /></button>
            <button className="text-[#8c909f] hover:text-[#5de6ff] transition-colors"><Settings className="w-4 h-4" /></button>
            <button 
              onClick={() => alert("Broadcasting raw transaction verification onto Amoy chain state...")}
              className="bg-[#adc6ff] text-[#00285d] px-4 py-1.5 rounded-full font-bold text-xs hover:opacity-90 transition-all"
            >
              Execute Transaction
            </button>
          </div>
        </div>
      </header>

      {/* Right Side Fixed Drawer Live Preview Panel */}
      <aside className="fixed right-0 top-16 bottom-0 w-80 bg-[#1c1b1b]/40 backdrop-blur-md border-l border-white/10 flex flex-col p-6 z-40">
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#5de6ff] font-mono">Live Node Preview</h3>
          <p className="text-[10px] text-[#8c909f] mt-1">IPFS Storage Hash: <span className="font-mono text-[#5de6ff]">Pending Signing...</span></p>
        </div>
        
        <div className="bg-slate-950/60 border border-white/5 aspect-square w-full rounded-2xl flex flex-col items-center justify-center p-6 mb-6 relative overflow-hidden group">
          <div className="w-44 h-44 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center p-4">
            <QrCode className="w-20 h-20 text-[#5de6ff] opacity-40 group-hover:opacity-80 transition-opacity mb-2" strokeWidth={1} />
            <span className="text-[9px] font-mono text-[#8c909f] uppercase tracking-widest">Locked Until Signed</span>
          </div>
          <div className="flex items-center gap-2 bg-[#5de6ff]/10 border border-[#5de6ff]/30 px-3 py-1 rounded-full mt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5de6ff] animate-pulse"></span>
            <span className="text-[9px] font-bold text-[#5de6ff] uppercase tracking-wider">Awaiting Verification</span>
          </div>
        </div>

        <div className="space-y-3 font-mono text-[11px]">
          <div className="p-3 rounded-xl bg-[#201f1f] border border-white/5">
            <p className="text-[9px] text-[#8c909f] font-sans font-bold uppercase tracking-wider mb-1">Contract Address</p>
            <p className="text-[#e5e2e1] break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
          </div>
          <div className="p-3 rounded-xl bg-[#201f1f] border border-white/5">
            <p className="text-[9px] text-[#8c909f] font-sans font-bold uppercase tracking-wider mb-1">Network Base Gas</p>
            <p className="text-[#e5e2e1]">21,000 GWEI</p>
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <button 
            onClick={() => alert("Please attach transaction validation signatures via MetaMask first.")}
            className="w-full bg-[#5de6ff] text-[#00363e] py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition-transform active:scale-95"
          >
            <QrCode className="w-4 h-4" /> Generate QR Code
          </button>
          <button 
            onClick={() => alert("Connecting target address pipeline loops...")}
            className="w-full border border-[#5de6ff]/30 text-[#5de6ff] bg-[#5de6ff]/5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition-colors hover:bg-[#5de6ff]/10"
          >
            <Wallet className="w-4 h-4" /> Sign with MetaMask
          </button>
        </div>
      </aside>

      {/* Main Core Form Wizard Canvas */}
      <main className="ml-64 mr-80 pt-24 pb-12 px-6 min-h-screen">
        <div className="max-w-3xl mx-auto">
          
          {/* Progress Flow Horizontal Stepper Indicator */}
          <div className="flex justify-between items-center mb-10 relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#adc6ff] text-[#00285d] font-bold text-xs ring-4 ring-[#adc6ff]/20">1</div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#adc6ff]">Lookup</span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#201f1f] border border-white/10 text-[#c2c6d6] font-bold text-xs">2</div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8c909f]">Profile</span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#201f1f] border border-white/10 text-[#c2c6d6] font-bold text-xs">3</div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8c909f]">Regimen</span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#201f1f] border border-white/10 text-[#c2c6d6] font-bold text-xs">4</div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8c909f]">Anchors</span>
            </div>
          </div>

          {/* Form Action Blocks Layout */}
          <div className="space-y-6">
            
            {/* Step 1: Patient Search Input Section */}
            <div className="bg-[#131313] border border-white/10 p-6 rounded-2xl">
              <h4 className="text-base font-bold mb-4 flex items-center gap-2 text-white">
                <Search className="text-[#5de6ff] w-4 h-4" /> Patient National Health Registry Lookup
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-[#8c909f]">ABHA ID / National Identifier</label>
                  <input 
                    value={abhaQuery}
                    onChange={(e) => setAbhaQuery(e.target.value)}
                    className="w-full bg-[#0e0e0e] border border-[#5de6ff]/30 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-[#5de6ff]/30 outline-none transition-all font-mono" 
                    type="text" 
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => setIsFetched(true)}
                    className="bg-[#201f1f] text-white border border-white/10 px-4 py-2.5 rounded-xl font-bold text-xs w-full hover:bg-white/5 transition-colors"
                  >
                    Fetch ABHA Record
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Patient Profile Info Verification Row */}
            {isFetched && (
              <div className="bg-[#131313] border border-white/10 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-base font-bold flex items-center gap-2 text-white">
                    <UserIcon className="text-[#5de6ff] w-4 h-4" /> Active Patient Matrix Identification
                  </h4>
                  <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ABHA Verified
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-base text-[#5de6ff] font-mono">
                    AS
                  </div>
                  <div className="grid grid-cols-3 gap-6 flex-1 text-xs">
                    <div>
                      <span className="text-[#8c909f] block text-[9px] uppercase tracking-wider mb-0.5">Full Name</span>
                      <p className="font-bold text-white text-sm">Aarav Sharma</p>
                    </div>
                    <div>
                      <span className="text-[#8c909f] block text-[9px] uppercase tracking-wider mb-0.5">Metrics</span>
                      <p className="font-bold text-white text-sm">34 Yrs / Male</p>
                    </div>
                    <div>
                      <span className="text-[#8c909f] block text-[9px] uppercase tracking-wider mb-0.5">Blood Type</span>
                      <p className="mt-0.5"><span className="bg-[#5de6ff]/10 text-[#5de6ff] px-2 py-0.5 rounded text-[10px] font-bold font-mono">O+ Positive</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Interactive Medicine Entry Form Table */}
            <div className="bg-[#131313] border border-white/10 p-6 rounded-2xl">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <h4 className="text-base font-bold flex items-center gap-2 text-white">
                  <FileText className="text-[#5de6ff] w-4 h-4" /> Itemized Prescription Matrix Builder
                </h4>
                
                <div className="flex items-center gap-2 ml-auto">
                  <input 
                    placeholder="Quick Add Drug name..." 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-[#0e0e0e] border border-white/10 px-3 py-1.5 rounded-lg text-xs w-44 focus:outline-none focus:border-[#5de6ff] text-white"
                  />
                  <button 
                    onClick={addMedicine}
                    className="text-[#5de6ff] text-xs font-bold flex items-center gap-1 bg-[#5de6ff]/10 px-3 py-1.5 rounded-lg border border-[#5de6ff]/20 hover:bg-[#5de6ff]/20"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>

              <div className="overflow-hidden border border-white/5 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/10 text-[9px] font-bold tracking-widest text-[#8c909f] uppercase">
                      <th className="px-4 py-3">Medicine Formulation</th>
                      <th className="px-4 py-3">Dose Index</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Quantity</th>
                      <th className="px-4 py-3 text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-[#e5e2e1]">
                    {medicines.map((med) => (
                      <tr key={med.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-white">{med.name}</p>
                          <p className="text-[11px] text-[#8c909f]">{med.category}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex gap-1 font-mono text-[11px]">
                            {med.dosage.map((dose, i) => (
                              <span key={i} className={`w-6 h-6 rounded border flex items-center justify-center font-bold ${dose > 0 ? 'bg-[#5de6ff]/10 text-[#5de6ff] border-[#5de6ff]/20' : 'bg-[#0e0e0e] text-[#8c909f] border-white/5'}`}>
                                {dose}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium">{med.duration}</p>
                          <p className="text-[9px] text-[#8c909f] font-mono uppercase">{med.daysLabel}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-[#5de6ff]">{med.quantity}</span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button 
                            onClick={() => deleteMedicine(med.id)}
                            className="text-[#ffb4ab] hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step 4: Blockchain Storage Summary Row metadata fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#131313] border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
                <h5 className="text-[10px] font-bold tracking-wider uppercase text-[#adc6ff] font-mono mb-2">Storage Metadata</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#8c909f]">IPFS State Anchor</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CloudLightning className="w-3 h-3" /> Auto-Staged
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8c909f]">Gas Ceiling Estimator</span>
                    <span className="font-mono text-[#e5e2e1]">0.0034 MATIC</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#131313] border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
                <h5 className="text-[10px] font-bold tracking-wider uppercase text-[#5de6ff] font-mono mb-2">Compliance Metrics</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#8c909f]">Prescription Lifecycle</span>
                    <span className="font-medium text-white">6 Months Term</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8c909f]">Anti-Reuse Rules</span>
                    <span className="text-[#5de6ff] font-semibold">Strict Single Dispensation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Confirmation Strip Bar */}
            <div className="flex justify-between items-center pt-6 border-t border-white/10 text-xs">
              <button className="text-[#8c909f] font-bold hover:text-white transition-all">Save Local Draft</button>
              <div className="flex gap-3">
                <Link href="/doctor">
                  <button className="px-5 py-2.5 rounded-xl font-bold border border-white/10 text-[#c2c6d6] hover:bg-white/5 transition-all">
                    Discard
                  </button>
                </Link>
                <button 
                  onClick={() => alert("Success: Encryption verified. Document metadata hashes pushed to Polygon Amoy pipeline registry bundle.")}
                  className="px-6 py-2.5 bg-[#adc6ff] text-[#00285d] font-bold rounded-xl shadow-lg shadow-blue-500/15 hover:opacity-90 active:scale-95 transition-all"
                >
                  Finalize & Lock Registry
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Decorative Blur Background Shaders */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-10 overflow-hidden h-screen w-screen">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-blue-500 rounded-full blur-[100px]"></div>
      </div>

    </div>
  );
}