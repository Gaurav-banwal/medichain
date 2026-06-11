'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  LayoutDashboard, 
  FilePlus, 
  Users, 
  History, 
  Settings, 
  LogOut, 
  PlusCircle, 
  Radio, 
  Rss, 
  Pill, 
  Database,
  Menu
} from 'lucide-react';

const INITIAL_PATIENTS = [
  { name: "Aarav Sharma", abhaId: "91-2234-5678-9012", age: 34, lastVisit: "Oct 22, 2024", initials: "AS", color: "bg-blue-500/20 text-blue-400" },
  { name: "Priya Patel", abhaId: "91-8876-5432-1098", age: 29, lastVisit: "Oct 21, 2024", initials: "PP", color: "bg-teal-500/20 text-teal-400" },
  { name: "Vikram Singh", abhaId: "91-5543-2210-9876", age: 45, lastVisit: "Oct 20, 2024", initials: "VS", color: "bg-slate-500/20 text-slate-400" }
];

export default function DoctorDashboard() {
  const [patients] = useState(INITIAL_PATIENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.abhaId.includes(searchQuery)
  );

  return (
    <div className="bg-[#050505] text-[#e5e2e1] min-h-screen font-sans antialiased selection:bg-blue-500/30">
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-16 h-16 bg-[#131313]/65 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-[#adc6ff] focus:outline-none">
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-xl font-bold text-[#adc6ff] tracking-tight">MediChain</span>
        </div>
        
        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f] h-4 w-4" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1b1b] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-[#e5e2e1] placeholder-[#8c909f] focus:outline-none focus:border-[#adc6ff] transition-colors" 
              placeholder="Search Patient ABHA ID or Name..." 
              type="text" 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer group">
            <Bell className="text-[#c2c6d6] group-hover:text-[#adc6ff] transition-colors h-5 w-5" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#5de6ff] rounded-full border-2 border-[#131313]"></div>
          </div>
          
          <div className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-all">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-none text-white">Dr. Sarah Chen</p>
              <p className="text-xs text-[#8c909f] leading-tight mt-1">Chief Oncologist</p>
            </div>
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#adc6ff]/20 bg-slate-800">
              <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-teal-500 opacity-80" />
            </div>
          </div>
        </div>
      </nav>

      {/* Persistent / Responsive Left Sidebar Navigation */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-[#0e0e0e]/60 backdrop-blur-xl border-r border-white/10 flex flex-col z-40 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-8 flex flex-col gap-1 flex-1">
          <p className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest mb-3 font-mono">Medical Hub</p>
          
          <Link href="/doctor" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#adc6ff]/10 text-[#adc6ff] border-r-4 border-[#adc6ff] transition-all">
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          
          <Link href="/doctor/create" className="flex items-center gap-3 text-[#c2c6d6] hover:bg-white/5 hover:text-white px-4 py-3 rounded-lg transition-all">
            <FilePlus className="h-4 w-4" />
            <span className="text-sm font-medium">Create Prescription</span>
          </Link>
          
          <a href="#" className="flex items-center gap-3 text-[#c2c6d6] hover:bg-white/5 hover:text-white px-4 py-3 rounded-lg transition-all">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Patients</span>
          </a>
          
          <a href="#" className="flex items-center gap-3 text-[#c2c6d6] hover:bg-white/5 hover:text-white px-4 py-3 rounded-lg transition-all">
            <History className="h-4 w-4" />
            <span className="text-sm font-medium">History</span>
          </a>
          
          <div className="mt-8">
            <p className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest mb-3 font-mono">System</p>
            <a href="#" className="flex items-center gap-3 text-[#c2c6d6] hover:bg-white/5 hover:text-white px-4 py-3 rounded-lg transition-all">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Settings</span>
            </a>
          </div>
        </div>
        
        <div className="p-6 border-t border-white/5">
          <Link href="/">
            <button className="w-full flex items-center gap-3 text-[#ffb4ab] hover:bg-[#ffb4ab]/10 px-4 py-3 rounded-lg transition-all">
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Workspace Frame Panel */}
      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          
          {/* Main Action Banner */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Doctor Workspace</h1>
              <p className="text-sm text-[#c2c6d6] mt-0.5">Welcome back, Dr. Chen. Your network validator is synced.</p>
            </div>
            <Link href="/doctor/create">
              <button className="inline-flex items-center justify-center gap-2 bg-[#adc6ff] text-[#002e6a] font-bold px-6 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-blue-500/10">
                <PlusCircle className="w-4 h-4" /> New Consultation
              </button>
            </Link>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            
            {/* Core Operational Analytics Widget Metrics */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-[#131313] border border-white/10 p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden">
                <span className="text-[#c2c6d6] text-xs font-medium">Patients Treated</span>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-white tracking-tight">1,284</span>
                  <span className="text-[#5de6ff] font-mono text-xs mb-1 font-semibold">+12%</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full mt-3">
                  <div className="bg-[#adc6ff] h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="bg-[#131313] border border-white/10 p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden">
                <span className="text-[#c2c6d6] text-xs font-medium">Active Prescriptions</span>
                <span className="text-3xl font-bold text-white tracking-tight">456</span>
                <div className="w-full bg-white/5 h-1 rounded-full mt-3">
                  <div className="bg-[#5de6ff] h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className="bg-[#131313] border border-white/10 p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden">
                <span className="text-[#c2c6d6] text-xs font-medium">Network Sync Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 font-bold text-sm tracking-wide">Online</span>
                </div>
                <span className="text-[11px] font-mono text-[#8c909f] mt-2 block">Polygon Amoy Testnet</span>
              </div>

            </div>

            {/* Live Activity Feed Stream Block */}
            <aside className="hidden lg:block bg-[#131313] border border-white/10 rounded-xl p-6 h-full">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                <Rss className="text-[#adc6ff] h-4 w-4" /> Activity Feed
              </h3>
              <div className="space-y-4 relative border-l border-white/10 pl-4 ml-1">
                
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-[#adc6ff] rounded-full border border-[#131313]"></div>
                  <p className="text-xs font-medium text-white">Amoxicillin token issued</p>
                  <p className="text-[11px] text-[#c2c6d6]">to Aarav Sharma</p>
                  <span className="text-[9px] font-mono text-[#8c909f] uppercase tracking-wider block mt-0.5">2 mins ago</span>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-[#5de6ff] rounded-full border border-[#131313]"></div>
                  <p className="text-xs font-medium text-white">Metformin payload stored</p>
                  <p className="text-[11px] text-[#c2c6d6]">to Priya Patel</p>
                  <span className="text-[9px] font-mono text-[#8c909f] uppercase tracking-wider block mt-0.5">1 hour ago</span>
                </div>

              </div>
            </aside>

          </div>

          {/* Interactive Ledger Patient Queue List */}
          <div className="bg-[#131313] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-bold text-lg text-white">Recent Patients</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-xs font-semibold bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">Export Ledger</button>
                <button className="px-4 py-2 text-xs font-semibold bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">Filters</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase font-bold tracking-widest text-[#8c909f] bg-white/[0.02] border-b border-white/10">
                    <th className="px-6 py-4">Patient Name</th>
                    <th className="px-6 py-4">ABHA ID Matrix</th>
                    <th className="px-6 py-4">Age</th>
                    <th className="px-6 py-4">Last Sync Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient, index) => (
                      <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${patient.color} flex items-center justify-center font-bold text-xs font-mono`}>
                              {patient.initials}
                            </div>
                            <span className="font-medium text-white">{patient.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-[#c2c6d6]">{patient.abhaId}</td>
                        <td className="px-6 py-4 text-[#c2c6d6]">{patient.age}</td>
                        <td className="px-6 py-4 text-[#c2c6d6]">{patient.lastVisit}</td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button className="text-[#adc6ff] hover:text-[#5de6ff] font-semibold text-xs transition-colors">View</button>
                          <Link href="/doctor/create">
                            <button className="bg-[#5de6ff]/10 text-[#5de6ff] hover:bg-[#5de6ff]/20 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold">
                              Issue Token
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-xs text-[#8c909f]">
                        No electronic patient hashes matching that inquiry criteria found on this cluster node.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fallback Mobile Activity Stream Info Block */}
          <div className="lg:hidden bg-[#131313] border border-white/10 rounded-xl p-6 mt-6">
            <h3 className="font-bold text-sm text-white mb-4">Recent Activity Logs</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start text-xs">
                <Pill className="text-[#adc6ff] h-4 w-4 mt-0.5" />
                <div>
                  <p className="text-white">Amoxicillin batch matrix issued to Aarav Sharma</p>
                  <span className="text-[10px] font-mono text-[#8c909f] block mt-0.5">2 mins ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Futuristic Background Blur Core Assets */}
      <div className="fixed top-0 right-0 -z-10 opacity-10 pointer-events-none overflow-hidden h-screen w-screen">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-teal-500 rounded-full blur-[120px]"></div>
      </div>

    </div>
  );
}