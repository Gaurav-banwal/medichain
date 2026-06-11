'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  LayoutDashboard, 
  LineChart as InsightsIcon, 
  FileText,
  LogOut, 
  AlertTriangle, 
  Search, 
  Bell, 
  Settings, 
  TrendingUp, 
  Activity, 
  FileCheck, 
  Users, 
  ExternalLink,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

const INITIAL_LEDGER = [
  { hash: "0x7d2a...8f9c", doctor: "Dr. Sarah Chen", patient: "UID-4820-K", time: "12:04:22 PM", status: "VERIFIED" },
  { hash: "0x3f1e...4b2d", doctor: "Dr. Marcus Thorne", patient: "UID-1159-A", time: "11:58:10 AM", status: "VERIFIED" },
  { hash: "0x9c4f...0e31", doctor: "Dr. Elena Rodriguez", patient: "UID-7742-X", time: "11:52:05 AM", status: "FLAGGED" },
  { hash: "0xa8d2...6f5a", doctor: "Dr. James Wilson", patient: "UID-9031-M", time: "11:45:33 AM", status: "PENDING" }
];

export default function RegulatorDashboard() {
  const [ledger] = useState(INITIAL_LEDGER);
  const [searchQuery, setSearchQuery] = useState("");
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);

  // Simulated live chart micro-animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(Math.floor(Math.random() * 8));
      setTimeout(() => setPulseIndex(null), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen font-sans antialiased selection:bg-blue-500/30 overflow-hidden flex">
      
      {/* Fixed Left Navigation Drawer SideBar */}
      <aside className="h-full w-64 fixed left-0 top-0 border-r border-white/5 flex flex-col pt-6 pb-4 z-50 bg-[#0e0e0e]/80 backdrop-blur-md">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">MediChain</h1>
            <p className="text-[10px] font-mono text-[#8c909f] uppercase tracking-wider mt-1">Regulator Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <Link href="/regulator" className="flex items-center gap-3 py-2.5 px-4 bg-blue-500/10 text-blue-400 border-r-2 border-blue-400 rounded-lg transition-all text-xs font-bold uppercase tracking-wider font-mono">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <a href="#" className="flex items-center gap-3 py-2.5 px-4 text-[#8c909f] opacity-70 hover:bg-white/5 hover:text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider font-mono">
            <InsightsIcon className="w-4 h-4" />
            <span>Analytics</span>
          </a>
          <a href="#" className="flex items-center gap-3 py-2.5 px-4 text-[#8c909f] opacity-70 hover:bg-white/5 hover:text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider font-mono">
            <FileText className="w-4 h-4" />
            <span>Audit Logs</span>
          </a>
          <a href="#" className="flex items-center gap-3 py-2.5 px-4 text-[#8c909f] opacity-70 hover:bg-white/5 hover:text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider font-mono">
            <AlertTriangle className="w-4 h-4" />
            <span>Anomalies</span>
          </a>
        </nav>

        <div className="px-4 mb-4">
          <button 
            onClick={() => alert("Downloading formatted cryptographic compliance ledger stream file...")}
            className="w-full bg-[#5de6ff] text-[#00363e] py-2.5 px-4 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-transform active:scale-95 shadow-lg shadow-cyan-500/10"
          >
            Export Audit Report
          </button>
        </div>

        <div className="px-3 border-t border-white/5 pt-4 text-xs font-mono uppercase tracking-wider font-semibold text-[#8c909f]">
          <Link href="/" className="flex items-center gap-3 py-2 px-4 hover:bg-white/5 hover:text-white rounded-lg transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Framework Frame Space */}
      <main className="ml-64 flex-1 flex flex-col h-screen overflow-hidden bg-[#131313]">
        
        {/* Fixed Horizontal Top Utility Control Panel Bar */}
        <header className="h-16 flex justify-between items-center px-10 bg-[#131313]/65 backdrop-blur-xl border-b border-white/10 z-40">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f] w-4 h-4" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-colors" 
                placeholder="Search global transaction parameters, medical nodes, or patient certificates..." 
                type="text"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-6 text-[#8c909f]">
            <button className="hover:text-[#adc6ff] transition-colors"><Bell className="w-4 h-4" /></button>
            <button className="hover:text-[#adc6ff] transition-colors"><Settings className="w-4 h-4" /></button>
            <button className="hover:text-[#adc6ff] transition-colors"><Shield className="w-4 h-4" /></button>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/20" />
          </div>
        </header>

        {/* Dashboard Main Visual Layout Content Area */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-7xl mx-auto space-y-6 pb-6">
            
            {/* Context Header Section */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">National Healthcare Audit Console</h2>
                <p className="text-xs text-[#c2c6d6] font-mono mt-1">
                  System state: <span className="text-emerald-400 font-bold">NORMAL</span> • Block Index Height: <span className="text-[#adc6ff]">2,840,192</span>
                </p>
              </div>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5de6ff]">Live Network Mesh</span>
              </div>
            </div>

            {/* Top Row Grid: Custom Bento Analytical Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-[#131313] border border-white/10 p-5 rounded-2xl">
                <div className="flex justify-between items-start mb-2 text-[#8c909f]">
                  <span className="text-[10px] font-bold tracking-wider font-mono uppercase">Total Prescriptions</span>
                  <FileText className="text-[#adc6ff] w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">1,240,582</div>
                <div className="flex items-center gap-1 text-[#5de6ff] text-[11px] font-semibold mt-2">
                  <TrendingUp className="w-3 h-3" /> +12.4% <span className="text-[#8c909f] font-normal font-sans text-[10px] ml-0.5">vs last month</span>
                </div>
              </div>

              <div className="bg-[#131313] border border-white/10 p-5 rounded-2xl border-l-4 border-l-[#5de6ff]">
                <div className="flex justify-between items-start mb-2 text-[#8c909f]">
                  <span className="text-[10px] font-bold tracking-wider font-mono uppercase">Medicines Dispensed</span>
                  <Activity className="text-[#5de6ff] w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">892,401</div>
                <span className="text-[10px] bg-[#5de6ff]/10 text-[#5de6ff] border border-[#5de6ff]/20 px-2 py-0.5 rounded font-bold uppercase font-mono tracking-wider inline-block mt-2">Active Status</span>
              </div>

              <div className="bg-[#131313] border border-white/10 p-5 rounded-2xl">
                <div className="flex justify-between items-start mb-2 text-[#8c909f]">
                  <span className="text-[10px] font-bold tracking-wider font-mono uppercase">Fraud Intercepted</span>
                  <AlertTriangle className="text-red-400 w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">12,402</div>
                <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold mt-2">
                  <FileCheck className="w-3 h-3" /> High Integrity Ledger
                </div>
              </div>

              <div className="bg-[#131313] border border-white/10 p-5 rounded-2xl">
                <div className="flex justify-between items-start mb-2 text-[#8c909f]">
                  <span className="text-[10px] font-bold tracking-wider font-mono uppercase">Live Doctors Authorized</span>
                  <Users className="text-[#adc6ff] w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">45,210</div>
                <span className="text-[10px] bg-[#adc6ff]/10 text-[#adc6ff] border border-[#adc6ff]/20 px-2 py-0.5 rounded font-bold uppercase font-mono tracking-wider inline-block mt-2">Live Node Keys</span>
              </div>

            </div>

            {/* Split Middle Container Grid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Distribution Chart Simulator & Verification Ledger */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Mock Chart Area Panel */}
                <div className="bg-[#131313] border border-white/10 p-6 rounded-2xl h-72 flex flex-col justify-between">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="text-sm font-bold text-white">Aggregated Monthly Distribution Activity</h3>
                    <div className="flex gap-1.5 font-mono text-[10px]">
                      <button className="px-2 py-0.5 bg-[#1c1b1b] rounded border border-white/5 text-[#8c909f] hover:border-[#adc6ff]">Daily</button>
                      <button className="px-2 py-0.5 bg-[#adc6ff] text-[#00285d] rounded font-bold">Monthly</button>
                    </div>
                  </div>

                  <div className="flex-grow flex items-end gap-3 pb-2 pt-4">
                    {[40, 65, 55, 90, 75, 45, 30, 60].map((hValue, index) => (
                      <div 
                        key={index}
                        className={`w-full rounded-t relative group transition-all duration-300 ${
                          index === 3 || pulseIndex === index
                            ? 'bg-[#5de6ff]/30 border-t-2 border-[#5de6ff]' 
                            : 'bg-[#adc6ff]/10 hover:bg-[#adc6ff]/20'
                        }`}
                        style={{ height: `${hValue}%` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white px-1.5 py-0.5 rounded text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                          {hValue * 2}k Tx
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-[#8c909f] px-1 pt-2 border-t border-white/5">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                  </div>
                </div>

                {/* Live Core Verification Table Sheet */}
                <div className="bg-[#131313] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1c1b1b]/50">
                    <h3 className="text-sm font-bold text-white">Cryptographic Node Entry Records</h3>
                    <button className="text-xs text-[#adc6ff] font-semibold flex items-center gap-1 hover:underline">
                      <ExternalLink className="w-3 h-3" /> View Explorer
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="text-[#8c909f] font-mono uppercase text-[10px] bg-white/5 border-b border-white/10">
                          <th className="px-5 py-3">Block Tx Hash</th>
                          <th className="px-5 py-3">Attending Doctor</th>
                          <th className="px-5 py-3">Patient Ref Hash</th>
                          <th className="px-5 py-3">Timestamp</th>
                          <th className="px-5 py-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono text-[#c2c6d6]">
                        {ledger.map((item, index) => (
                          <tr key={index} className="hover:bg-white/[0.01] transition-colors">
                            <td className="px-5 py-3.5 text-[#5de6ff]">{item.hash}</td>
                            <td className="px-5 py-3.5 font-sans font-medium text-white">{item.doctor}</td>
                            <td className="px-5 py-3.5 opacity-60">{item.patient}</td>
                            <td className="px-5 py-3.5 opacity-40">{item.time}</td>
                            <td className="px-5 py-3.5 text-right">
                              {item.status === 'VERIFIED' && <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-[9px]">Verified</span>}
                              {item.status === 'FLAGGED' && <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-[9px]">Flagged</span>}
                              {item.status === 'PENDING' && <span className="px-2 py-0.5 rounded-full bg-white/5 text-[#8c909f] border border-white/10 font-bold text-[9px]">Pending</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Side Column: Donut Analytics Widget & Live Incident Feed */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Sector Specific Allocation Pie simulation wheel */}
                <div className="bg-[#131313] border border-white/10 p-5 rounded-2xl">
                  <h3 className="text-sm font-bold text-white mb-4">Therapy Allocation Ratios</h3>
                  
                  <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                    {/* Native light SVG Vector ring circle layout represent donut details explicitly */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1c1b1b" strokeWidth="4.5" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#adc6ff" strokeWidth="4.5" strokeDasharray="45, 100" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#5de6ff" strokeWidth="4.5" strokeDasharray="25, 100" strokeDashoffset="-45" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#bdc2ff" strokeWidth="4.5" strokeDasharray="30, 100" strokeDashoffset="-70" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-bold text-white tracking-tight">892k</span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#8c909f] block">Units Total</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#adc6ff]" /> <span className="font-sans text-[#c2c6d6]">Antibiotics</span></div><span className="font-bold text-white">45%</span></div>
                    <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#5de6ff]" /> <span className="font-sans text-[#c2c6d6]">Statins</span></div><span className="font-bold text-white">25%</span></div>
                    <div className="flex justify-between items-center"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#bdc2ff]" /> <span className="font-sans text-[#c2c6d6]">Analgesics</span></div><span className="font-bold text-white">30%</span></div>
                  </div>
                </div>

                {/* Realtime Intelligence Threat Monitor Stream Section */}
                <div className="bg-[#131313] border border-white/10 rounded-2xl flex flex-col h-[278px]">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#8c909f]">Network Surveillance Feed</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
                    
                    <div className="relative pl-5 border-l border-white/5 pb-1">
                      <div className="absolute -left-[5px] top-1 w-2 h-2 bg-red-400 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                      <div className="flex justify-between text-[10px] font-mono mb-0.5">
                        <span className="text-red-400 font-bold uppercase">Anomaly Intercepted</span>
                        <span className="text-[#8c909f]">2m ago</span>
                      </div>
                      <p className="text-xs text-[#e5e2e1] leading-relaxed">Multiple high-frequency transaction hashes caught in Zone 4 block pipeline.</p>
                    </div>

                    <div className="relative pl-5 border-l border-white/5 pb-1">
                      <div className="absolute -left-[5px] top-1 w-2 h-2 bg-[#5de6ff] rounded-full"></div>
                      <div className="flex justify-between text-[10px] font-mono mb-0.5">
                        <span className="text-[#5de6ff] font-bold uppercase">Node Verified</span>
                        <span className="text-[#8c909f]">15m ago</span>
                      </div>
                      <p className="text-xs text-[#e5e2e1] leading-relaxed">New authorized pharmacy validator node successfully bound to amoy gateway matrix.</p>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Indian Regional Demographics Metrics Block Row */}
            <div className="bg-[#131313] border border-white/10 p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8c909f] font-mono">Indian State Node Volumes</h3>
                <span className="text-[10px] text-[#8c909f]">Ranked by Block confirmation traffic index</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                {[
                  { state: "Maharashtra", count: "284,102", pct: "92%" },
                  { state: "Uttar Pradesh", count: "212,055", pct: "78%" },
                  { state: "Karnataka", count: "189,401", pct: "64%" },
                  { state: "Delhi NCR", count: "145,220", pct: "52%" }
                ].map((item, key) => (
                  <div key={key} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#adc6ff]/20 transition-all">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-white font-sans">{item.state}</span>
                      <span className="text-[#5de6ff] font-bold">#{key + 1}</span>
                    </div>
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-2">
                      <div className="bg-[#adc6ff] h-full" style={{ width: item.pct }}></div>
                    </div>
                    <span className="text-[10px] text-[#8c909f] tracking-wide block uppercase font-bold">{item.count} Txns</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}