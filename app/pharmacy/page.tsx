'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/shared/AuthContext';
import {
    LayoutDashboard,
    QrCode,
    Package,
    History,
    Settings,
    Pill,
    Search,
    Bell,
    RefreshCw,
    Copy,
    CheckCircle2,
    AlertTriangle,
    FileText,
    Activity,
    Terminal,
    Store
} from 'lucide-react';

export default function PharmacyDashboard() {
    const { user } = useAuth();
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        async function loadPharmacyData() {
            try {
                const res = await fetch('/api/prescriptions');
                if (res.ok) {
                    const result = await res.json();
                    const rxList = result.data || [];
                    const mappedQueue = rxList.map((rx: any) => ({
                        id: rx.prescriptionId,
                        name: rx.User_Prescription_patientIdToUser?.name || 'Unknown Patient',
                        status: rx.status,
                        time: new Date(rx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        medicines: rx.PrescriptionItem?.map((item: any) => item.Medicine?.name || '').join(', ') || ''
                    }));
                    setQueue(mappedQueue);
                }
            } catch (err) {
                console.error('Failed to load pharmacy data', err);
            } finally {
                setLoading(false);
            }
        }
        loadPharmacyData();
    }, []);

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredQueue = queue.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.medicines.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-[#050505] text-[#e5e2e1] min-h-screen font-sans antialiased selection:bg-blue-500/30">

            {/* Side Navigation panel container */}
            <nav className="fixed left-0 top-0 h-full w-64 z-50 bg-[#1c1b1b]/60 backdrop-blur-xl border-r border-white/10 flex flex-col py-6 px-4">
                <div className="mb-10 px-4">
                    <h1 className="text-xl font-bold text-[#adc6ff] tracking-tight">MediChain</h1>
                    <p className="text-[#8c909f] font-mono text-[10px] uppercase tracking-widest mt-1">Secure Blockchain Pharmacy</p>
                </div>

                <div className="space-y-2 flex-grow">
                    <Link href="/pharmacy" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#5de6ff] border-r-2 border-[#5de6ff] bg-[#5de6ff]/10 transition-all text-xs uppercase font-semibold tracking-wider font-mono">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/pharmacy/verify" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8c909f] hover:text-white hover:bg-white/5 transition-all text-xs uppercase font-semibold tracking-wider font-mono">
                        <QrCode className="w-4 h-4" />
                        <span>Verify QR</span>
                    </Link>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8c909f] hover:text-white hover:bg-white/5 transition-all text-xs uppercase font-semibold tracking-wider font-mono">
                        <Package className="w-4 h-4" />
                        <span>Inventory</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8c909f] hover:text-white hover:bg-white/5 transition-all text-xs uppercase font-semibold tracking-wider font-mono">
                        <History className="w-4 h-4" />
                        <span>History</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8c909f] hover:text-white hover:bg-white/5 transition-all text-xs uppercase font-semibold tracking-wider font-mono">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </a>
                </div>

                <div className="mt-auto px-4 py-6 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#5de6ff]/10 flex items-center justify-center border border-[#5de6ff]/20">
                            <Store className="w-5 h-5 text-[#5de6ff]" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white leading-tight">Central Pharma</p>
                            <p className="font-mono text-[#8c909f] text-[10px] mt-0.5">Node #8821</p>
                        </div>
                    </div>
                    <Link href="/pharmacy/verify">
                        <button className="w-full py-2.5 px-4 bg-[#adc6ff] text-[#002e6a] font-bold rounded-xl text-xs uppercase tracking-wider transition-all hover:opacity-90 active:scale-95">
                            Scan Counter Pass
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Main Content View Frame */}
            <main className="ml-64 min-h-screen flex flex-col">

                {/* Top Control Header Bar */}
                <header className="fixed top-0 right-0 left-64 h-16 z-40 bg-[#131313]/65 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-10 shadow-sm">
                    <div className="flex items-center flex-1 max-w-xl transition-all duration-300">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f] w-4 h-4" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0e0e0e] border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder-[#8c909f] focus:outline-none focus:ring-1 focus:ring-[#adc6ff] focus:border-[#adc6ff] transition-all"
                                placeholder="Search Verification Log Name or Hash ID..."
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 text-[#8c909f]">
                            <button className="hover:text-[#adc6ff] transition-colors"><Bell className="w-4 h-4" /></button>
                            <button className="hover:text-[#adc6ff] transition-colors animate-spin" style={{ animationDuration: '12s' }}><RefreshCw className="w-4 h-4" /></button>
                        </div>
                        <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-bold text-white">Dr. Sarah Chen</p>
                                <p className="text-[10px] font-mono text-[#8c909f] uppercase tracking-wider">Pharmacy Node Op</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#adc6ff] to-[#5de6ff] opacity-80 border border-white/10" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid Modules */}
                <div className="mt-16 p-8 flex-grow grid grid-cols-12 gap-6 overflow-y-auto">

                    {/* Key Metric Cards Bar */}
                    <section className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        <div className="bg-[#131313] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-[#adc6ff]/10 rounded-xl text-[#adc6ff]"><Pill className="w-5 h-5" /></div>
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-mono">+12%</span>
                            </div>
                            <h3 className="text-[#8c909f] font-mono text-[10px] uppercase tracking-wider">Medicines Dispensed</h3>
                            <p className="text-2xl font-bold text-white tracking-tight mt-1">4,129</p>
                            <p className="text-[11px] text-[#8c909f] mt-1.5">Weekly aggregate volume</p>
                        </div>

                        <div className="bg-[#131313] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-[#5de6ff]/10 rounded-xl text-[#5de6ff]"><Activity className="w-5 h-5" /></div>
                                <span className="flex items-center text-[10px] font-bold text-[#5de6ff] font-mono animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#5de6ff] mr-1.5 shadow-[0_0_8px_#5de6ff]"></span> Live
                                </span>
                            </div>
                            <h3 className="text-[#8c909f] font-mono text-[10px] uppercase tracking-wider">Pending Verification</h3>
                            <p className="text-2xl font-bold text-white tracking-tight mt-1">24</p>
                            <p className="text-[11px] text-[#8c909f] mt-1.5">Avg queue response: ~2m</p>
                        </div>

                        <div className="bg-[#131313] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-[#bdc2ff]/10 rounded-xl text-[#bdc2ff]"><CheckCircle2 className="w-5 h-5" /></div>
                                <span className="text-[10px] font-bold text-[#adc6ff] bg-[#adc6ff]/10 px-2 py-0.5 rounded font-mono">High Sync</span>
                            </div>
                            <h3 className="text-[#8c909f] font-mono text-[10px] uppercase tracking-wider">Successful Scans</h3>
                            <p className="text-2xl font-bold text-white tracking-tight mt-1">98.4%</p>
                            <p className="text-[11px] text-[#8c909f] mt-1.5">Validation integrity score</p>
                        </div>

                        <div className="bg-[#131313] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-white/5 rounded-xl text-white"><FileText className="w-5 h-5" /></div>
                                <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-0.5 rounded font-mono">Syncing</span>
                            </div>
                            <h3 className="text-[#8c909f] font-mono text-[10px] uppercase tracking-wider">Today&apos;s Transcripts</h3>
                            <p className="text-2xl font-bold text-white tracking-tight mt-1">142</p>
                            <p className="text-[11px] text-[#8c909f] mt-1.5">Real-time block updates</p>
                        </div>

                    </section>

                    {/* Verification Log Queue Table Section */}
                    <section className="col-span-12 lg:col-span-8">
                        <div className="bg-[#131313] border border-white/10 rounded-2xl flex flex-col h-full shadow-xl">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <div>
                                    <h2 className="text-base font-bold text-white">Verification Queue Matrix</h2>
                                    <p className="text-xs text-[#8c909f] mt-0.5">Live cryptographic network verification processing states</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider font-mono bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">Filter</button>
                                    <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider font-mono bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">Export CSV</button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-[#8c909f] border-b border-white/10">
                                            <th className="px-6 py-4">Prescription ID HASH</th>
                                            <th className="px-6 py-4">Patient Profile</th>
                                            <th className="px-6 py-4">Status Token</th>
                                            <th className="px-6 py-4 text-right">Block Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-mono text-xs text-[#c2c6d6]">
                                        {filteredQueue.map((item, index) => (
                                            <tr key={index} className="hover:bg-white/[0.01] transition-all cursor-pointer">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[#5de6ff]">{item.id}</span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleCopy(item.id); }}
                                                            className="text-[#8c909f] hover:text-white transition-colors"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                        </button>
                                                        {copiedId === item.id && <span className="text-[9px] text-emerald-400 font-sans">Copied!</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-white font-sans font-medium">{item.name}</td>
                                                <td className="px-6 py-4">
                                                    {(item.status === 'VERIFIED' || item.status === 'CREATED') && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            Active / Valid
                                                        </span>
                                                    )}
                                                    {item.status === 'DISPENSED' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#adc6ff]/10 text-[#adc6ff] border border-[#adc6ff]/20">
                                                            Dispensed
                                                        </span>
                                                    )}
                                                    {item.status === 'EXPIRED' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                                            Expired
                                                        </span>
                                                    )}
                                                    {item.status === 'FLAGGED' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                            Flagged
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right text-[#8c909f]">{item.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-auto p-4 border-t border-white/5 text-center">
                                <button className="text-xs text-[#adc6ff] font-semibold hover:underline">View Historical Blocks Ledger</button>
                            </div>
                        </div>
                    </section>

                    {/* Interactive Dynamic Verification Timeline Logs Side stream */}
                    <section className="col-span-12 lg:col-span-4">
                        <div className="bg-[#131313] border border-white/10 rounded-2xl flex flex-col h-full shadow-xl">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-white">Live Verification Pipeline</h2>
                                <History className="text-[#8c909f] w-4 h-4" />
                            </div>

                            <div className="p-6 flex-grow space-y-5 overflow-y-auto max-h-[400px]">

                                <div className="relative pl-6 border-l border-white/10 pb-1">
                                    <div className="absolute -left-[4px] top-1 w-2 h-2 rounded-full bg-[#5de6ff] shadow-[0_0_8px_#2fd9f4]"></div>
                                    <p className="text-[10px] font-mono text-[#5de6ff] uppercase">just now</p>
                                    <p className="text-xs font-semibold text-white mt-0.5">Prescription token 0x42f... committed</p>
                                    <p className="text-[11px] text-[#8c909f] mt-0.5">Patient: Aarav Sharma. Form state flagged active.</p>
                                </div>

                                <div className="relative pl-6 border-l border-white/10 pb-1">
                                    <div className="absolute -left-[4px] top-1 w-2 h-2 rounded-full bg-[#adc6ff] shadow-[0_0_8px_#adc6ff]"></div>
                                    <p className="text-[10px] font-mono text-[#adc6ff] uppercase">4 mins ago</p>
                                    <p className="text-xs font-semibold text-white mt-0.5">IPFS Metadata sync broadcast</p>
                                    <p className="text-[11px] text-[#8c909f] mt-0.5">Cluster peer node achieved local receipt checkpoint consensus.</p>
                                </div>

                                <div className="relative pl-6 border-l border-white/10 pb-1">
                                    <div className="absolute -left-[4px] top-1 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_#ffb4ab]"></div>
                                    <p className="text-[10px] font-mono text-red-400 uppercase">17 mins ago</p>
                                    <p className="text-xs font-semibold text-white mt-0.5">Integrity Mismatch Mapped</p>
                                    <p className="text-[11px] text-[#8c909f] mt-0.5">Hash disparity caught for pass token #0x7a3... Operator flagged.</p>
                                </div>

                            </div>

                            <div className="p-6 mt-auto border-t border-white/5">
                                <div className="p-4 bg-slate-950 border border-white/5 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Terminal className="text-[#adc6ff] w-4 h-4" />
                                        <span className="text-[10px] font-bold text-[#adc6ff] uppercase tracking-wider font-mono">Consensus Velocity</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#adc6ff] w-[92%]"></div>
                                    </div>
                                    <p className="text-[9px] font-mono text-[#8c909f] mt-1.5 text-right">92% Cluster Sync Completion</p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

        </div>
    );
}