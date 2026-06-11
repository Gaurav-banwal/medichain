'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ShieldCheck,
    Search,
    Bell,
    RefreshCw,
    LayoutDashboard,
    QrCode,
    Package,
    History,
    Settings,
    PlusCircle,
    User,
    FileText,
    Pill,
    CheckCircle2,
    ExternalLink,
    Fingerprint,
    Activity,
    CloudCheck
} from 'lucide-react';

export default function QrVerificationControl() {
    const [dispenseStatus, setDispenseStatus] = useState<'idle' | 'validating' | 'success'>('idle');
    const [prescriptionId, setPrescriptionId] = useState("");

    const executeDispenseWorkflow = () => {
        setDispenseStatus('validating');
        setTimeout(() => {
            setDispenseStatus('success');
        }, 2000);
    };

    return (
        <div className="bg-[#131313] text-[#e5e2e1] min-h-screen font-sans antialiased selection:bg-cyan-500/30 overflow-x-hidden">

            {/* Top Application Header Control Bar */}
            <nav className="fixed top-0 w-full z-40 bg-[#131313]/65 backdrop-blur-xl border-b border-white/10 shadow-sm flex justify-between items-center px-16 py-4">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-[#adc6ff] h-7 w-7" />
                    <h1 className="text-xl font-bold text-[#adc6ff] tracking-tight">MediChain Pharmacy</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex gap-4 items-center text-[#c2c6d6]">
                        <button className="hover:text-[#5de6ff] transition-colors"><Bell className="w-5 h-5" /></button>
                        <button className="hover:text-[#5de6ff] transition-colors animate-spin" style={{ animationDuration: '10s' }}><RefreshCw className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                        <div className="text-right">
                            <p className="text-xs uppercase font-bold text-white tracking-wider font-mono">Pharmacist Profile</p>
                            <p className="text-xs text-[#c2c6d6] opacity-70">Dr. Sarah Vance</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-[#adc6ff]/20" />
                    </div>
                </div>
            </nav>

            {/* Persistent Left Sidebar Navigation */}
            <aside className="fixed left-0 top-0 h-full w-64 z-50 bg-[#1c1b1b]/60 backdrop-blur-xl border-r border-white/10 flex flex-col py-6 px-4 hidden md:flex">
                <div className="mb-10 px-4">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-[#adc6ff]/10 flex items-center justify-center text-[#adc6ff]">
                            <Activity className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-[#adc6ff]">Central Pharma</h2>
                    </div>
                    <p className="font-mono text-[10px] text-[#8c909f] ml-11 uppercase tracking-widest">Node #8821</p>
                </div>

                <div className="flex-1 space-y-2">
                    <Link href="/pharmacy" className="flex items-center gap-3 px-4 py-3 text-[#8c909f] hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider font-mono">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link href="/pharmacy/verify" className="flex items-center gap-3 px-4 py-3 text-[#5de6ff] border-r-2 border-[#5de6ff] bg-[#5de6ff]/10 rounded-lg transition-all text-xs font-bold uppercase tracking-wider font-mono">
                        <QrCode className="w-4 h-4" /> Verify QR
                    </Link>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#8c909f] hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider font-mono">
                        <Package className="w-4 h-4" /> Inventory
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#8c909f] hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider font-mono">
                        <History className="w-4 h-4" /> History
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#8c909f] hover:text-white hover:bg-white/5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider font-mono">
                        <Settings className="w-4 h-4" /> Settings
                    </a>
                </div>

                <button className="mt-auto mx-4 bg-[#adc6ff] text-[#002e6a] py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all hover:opacity-90 active:scale-95">
                    <PlusCircle className="w-4 h-4" />
                    <span>New Prescription</span>
                </button>
            </aside>

            {/* Main Core View Area Layout */}
            <main className="md:ml-64 pt-24 pb-12 px-6 md:px-16 min-h-screen">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column Container Panel: Scanner Controls */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Live Frame Camera Simulator Interface */}
                        <div className="bg-slate-900/65 backdrop-blur-md border border-white/10 rounded-3xl p-6 overflow-hidden relative group">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">QR Verification Scanner</h3>
                                    <p className="text-[#c2c6d6] text-xs mt-0.5">Align the patient Health Pass item framework inside the alignment indicators.</p>
                                </div>
                                <div className="bg-[#5de6ff]/10 border border-[#5de6ff]/20 px-3 py-1 rounded-full text-[10px] font-bold text-[#5de6ff] uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#5de6ff] animate-pulse"></span> Live Camera VOD
                                </div>
                            </div>

                            {/* Viewport Frame with scanning animation lines */}
                            <div className="relative w-full aspect-video rounded-2xl bg-black/50 border border-white/5 overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/20 to-slate-900/40 opacity-40"></div>

                                <div className="relative w-64 h-64 border border-dashed border-[#adc6ff]/40 rounded-3xl flex items-center justify-center group-hover:border-[#5de6ff]/60 transition-colors">
                                    <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-[#5de6ff] rounded-tl-xl"></div>
                                    <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-[#5de6ff] rounded-tr-xl"></div>
                                    <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-[#5de6ff] rounded-bl-xl"></div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-[#5de6ff] rounded-br-xl"></div>

                                    {/* Sliding Scan Bar Animation line */}
                                    <div className="absolute h-[2px] w-full left-0 bg-gradient-to-r from-transparent via-[#5de6ff] to-transparent shadow-[0_0_15px_#5de6ff] animate-bounce top-0"></div>
                                    <QrCode className="w-24 h-24 text-white/10" strokeWidth={1} />
                                </div>

                                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end pointer-events-none text-[10px] font-mono text-[#8c909f]">
                                    <div>
                                        <p className="text-white/40 font-sans font-bold uppercase tracking-wider">Sensor Tracking</p>
                                        <p className="text-[#5de6ff]">OPTIMAL COLD OPTICS ALIGNED</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/40 font-sans font-bold uppercase tracking-wider">Validator Ping</p>
                                        <p className="text-[#adc6ff]">12ms • LOCAL HOST NODE</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Manual Identification Input Box */}
                        <div className="bg-slate-900/65 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                            <h4 className="text-xs uppercase font-bold font-mono text-[#8c909f] tracking-wider mb-3">Manual Registry ID Query Overrides</h4>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c909f] w-4 h-4" />
                                    <input
                                        value={prescriptionId}
                                        onChange={(e) => setPrescriptionId(e.target.value)}
                                        className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white placeholder:text-[#8c909f] focus:outline-none focus:ring-1 focus:ring-[#5de6ff]/50 font-mono"
                                        placeholder="Enter explicit hexadecimal token hash... (0x...)"
                                        type="text"
                                    />
                                </div>
                                <button className="bg-[#201f1f] text-white border border-white/10 px-6 py-3 rounded-xl text-xs font-bold hover:bg-white/5 transition-colors whitespace-nowrap">
                                    Verify Record ID
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Right Column Container Panel: Active Decryption Verification Results */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-slate-900/65 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-white tracking-tight">On-Chain Profile Payload</h3>
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Valid Status
                                    </span>
                                </div>

                                <div className="space-y-4 text-xs">
                                    {/* Patient Row Profile */}
                                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#adc6ff]/10 rounded-lg flex items-center justify-center text-[#adc6ff] border border-[#adc6ff]/20">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Alexander J. Sterling</h4>
                                            <p className="font-mono text-[10px] text-[#8c909f] mt-0.5">ABHA ID: MED-992-001X</p>
                                        </div>
                                    </div>

                                    {/* Physician Authority Box */}
                                    <div className="p-1">
                                        <span className="text-[10px] font-bold tracking-wider text-[#8c909f] uppercase block font-mono mb-2">Prescribing Practitioner</span>
                                        <div className="flex items-start gap-2 text-xs">
                                            <FileText className="text-[#5de6ff] w-4 h-4 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-white">Dr. Elena Rodriguez</p>
                                                <p className="text-[#c2c6d6] text-[11px] mt-0.5">Neurology Specialists of San Francisco</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decrypted Item Loops list */}
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold tracking-wider text-[#8c909f] uppercase block font-mono mb-1">Medication Payload (2 Items)</span>

                                        <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-black/20">
                                            <div className="flex items-center gap-2">
                                                <Pill className="text-[#5de6ff] w-3.5 h-3.5" />
                                                <div>
                                                    <p className="font-semibold text-white text-xs">Sumatriptan</p>
                                                    <p className="text-[10px] text-[#8c909f]">50mg • Once Daily Regimen</p>
                                                </div>
                                            </div>
                                            <span className="font-mono text-white text-xs">Qty: 30</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-black/20">
                                            <div className="flex items-center gap-2">
                                                <Pill className="text-[#5de6ff] w-3.5 h-3.5" />
                                                <div>
                                                    <p className="font-semibold text-white text-xs">Magnesium Glycinate</p>
                                                    <p className="text-[10px] text-[#8c909f]">400mg • Nightly</p>
                                                </div>
                                            </div>
                                            <span className="font-mono text-white text-xs">Qty: 60</span>
                                        </div>
                                    </div>

                                    {/* Blockchain metadata highlights summary link */}
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs font-sans">
                                        <div>
                                            <span className="text-[9px] uppercase tracking-wider text-[#8c909f] block font-mono mb-0.5">Expiry Boundary</span>
                                            <p className="font-bold text-white">Oct 24, 2026</p>
                                        </div>
                                        <div>
                                            <span className="text-[9px] uppercase tracking-wider text-[#8c909f] block font-mono mb-0.5">Token Receipt</span>
                                            <p className="font-mono text-[#5de6ff] truncate">0x9f8e...331a</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Action Submission State Trigger Button */}
                            <button
                                onClick={executeDispenseWorkflow}
                                disabled={dispenseStatus !== 'idle'}
                                className={`mt-6 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all shadow-xl ${dispenseStatus === 'idle' ? 'bg-[#5de6ff] text-[#00363e] hover:opacity-90 active:scale-95 shadow-cyan-500/5' :
                                        dispenseStatus === 'validating' ? 'bg-[#201f1f] text-[#8c909f] border border-white/5 cursor-wait' :
                                            'bg-emerald-500 text-white font-bold'
                                    }`}
                            >
                                {dispenseStatus === 'idle' && (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" /> Confirm &amp; Dispense Prescription
                                    </>
                                )}
                                {dispenseStatus === 'validating' && (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" /> Committing Transaction State to Block...
                                    </>
                                )}
                                {dispenseStatus === 'success' && (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" /> Ledger Updated (Dispensed Successfully)
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row Layout Panel: Protocol Infrastructure Metrics & Auditing Trails */}
                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="bg-slate-900/65 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="text-[#adc6ff] w-4 h-4" />
                                <h4 className="font-bold text-white text-sm">Cluster Consensus Status</h4>
                            </div>
                            <div className="space-y-2 font-mono text-xs text-[#c2c6d6]">
                                <div className="flex justify-between"><span>Active Node Tx</span><span className="text-[#adc6ff]">0x...e482</span></div>
                                <div className="flex justify-between"><span>IPFS Store Cluster</span><span className="text-emerald-400 flex items-center gap-1"><CloudCheck className="w-3.5 h-3.5" /> 100% Synced</span></div>
                                <div className="flex justify-between"><span>Confirmed Index</span><span className="text-white">#18,229,012</span></div>
                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
                                    <div className="h-full bg-gradient-to-r from-[#adc6ff] to-[#5de6ff] w-[85%]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/65 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <History className="text-[#5de6ff] w-4 h-4" />
                                    <h4 className="font-bold text-white text-sm">Recent Counter Dispatch History</h4>
                                </div>
                                <button className="text-xs text-[#5de6ff] hover:underline">View Ledger</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 text-[10px] uppercase font-bold text-[#8c909f] tracking-wider">
                                            <th className="pb-2">Timestamp</th>
                                            <th className="pb-2">Target Patient ID</th>
                                            <th className="pb-2">Classification</th>
                                            <th className="pb-2 text-right">Ledger Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-[#c2c6d6]">
                                        <tr className="hover:bg-white/5">
                                            <td className="py-2.5 font-mono">14:22:10</td>
                                            <td className="py-2.5 font-mono text-white">MED-119-09A</td>
                                            <td className="py-2.5"><span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10">Antibiotics</span></td>
                                            <td className="py-2.5 text-right font-semibold text-emerald-400">DISPENSED</td>
                                        </tr>
                                        <tr className="hover:bg-white/5">
                                            <td className="py-2.5 font-mono">13:58:45</td>
                                            <td className="py-2.5 font-mono text-white">MED-442-12L</td>
                                            <td className="py-2.5"><span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10">Insulin Matrix</span></td>
                                            <td className="py-2.5 text-right font-semibold text-yellow-400">PENDING</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </div>
            </main>

        </div>
    );
}