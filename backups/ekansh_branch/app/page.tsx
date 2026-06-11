'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  QrCode, 
  User, 
  Stethoscope, 
  Briefcase, 
  Activity, 
  Database, 
  Scan, 
  TrendingUp, 
  Globe, 
  Terminal, 
  ArrowRight,
  Eye
} from 'lucide-react';

export default function LandingPage() {
  
  // Dynamic background mouse glow effect from your Stitch design
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const glow = document.querySelector('.hero-glow') as HTMLElement;
      if (glow) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(173, 198, 255, 0.15) 0%, transparent 70%)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-[#050505] text-[#e5e2e1] min-h-screen font-sans antialiased overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Navbar Section */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#131313]/65 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="h-6 w-6 text-black font-bold" />
            </div>
            <span className="text-2xl font-bold text-[#adc6ff] tracking-tight">MediChain</span>
          </div>
          
          <div className="hidden md:flex gap-8">
            <a className="text-xs uppercase font-semibold tracking-wider text-[#c2c6d6] hover:text-[#adc6ff] transition-colors" href="#features">Features</a>
            <a className="text-xs uppercase font-semibold tracking-wider text-[#c2c6d6] hover:text-[#adc6ff] transition-colors" href="#workflow">Workflow</a>
            <a className="text-xs uppercase font-semibold tracking-wider text-[#c2c6d6] hover:text-[#adc6ff] transition-colors" href="#roles">Portal Access</a>
          </div>

          <button className="bg-[#adc6ff] text-[#002e6a] text-xs uppercase font-semibold tracking-wider px-6 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all">
            Connect Wallet
          </button>
        </div>
      </nav>

      <main className="relative">
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 md:px-16 overflow-hidden">
          <div className="hero-glow absolute inset-0 -z-10 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent"></div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
                <ShieldCheck className="text-[#adc6ff] h-[18px] w-[18px]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#adc6ff]">Blockchain Verified</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_0_15px_rgba(173,198,255,0.2)]">
                Secure Prescription Tracking for India&apos;s Healthcare Ecosystem
              </h1>
              
              <p className="text-base text-[#c2c6d6] max-w-lg leading-relaxed">
                Leveraging DigiLocker, ABHA IDs, IPFS and Polygon blockchain to eliminate fake medicines and prescription fraud.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <Link href="/citizen">
                  <button className="bg-[#adc6ff] text-[#002e6a] px-8 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/20">
                    Login via DigiLocker
                  </button>
                </Link>
                <button className="border border-[#5de6ff]/50 text-[#5de6ff] bg-[#1c1b1b]/50 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold transition-all hover:bg-[#5de6ff]/10 hover:border-[#5de6ff]">
                  Connect MetaMask
                </button>
              </div>
              
              <div className="flex items-center gap-6 mt-8 opacity-60">
                <span className="text-xs font-semibold tracking-wider text-[#c2c6d6]">TRUSTED PARTNERS:</span>
                <div className="flex gap-4 text-xs font-semibold text-white tracking-widest">
                  <span>NHA</span>
                  <span>CDSCO</span>
                  <span>MEITY</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-900/65 backdrop-blur-md border border-white/10 rounded-[32px] p-2 aspect-video overflow-hidden group">
                <div className="w-full h-full bg-[#131313] rounded-[24px] border border-white/5 relative flex items-center justify-center p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-teal-900/20 opacity-40"></div>
                  
                  {/* Grid Graphic Placeholder representing your high-tech dashboard image alternative */}
                  <div className="w-full flex flex-col gap-4 relative z-10">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-[#c2c6d6] ml-2 font-mono">Prescription_Ledger.sh</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">On-Chain Live</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5"><span className="text-[10px] text-[#c2c6d6] block">Active ABHA Tokens</span><span className="text-lg font-bold text-white">14,204</span></div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5"><span className="text-[10px] text-[#c2c6d6] block">IPFS Nodes</span><span className="text-lg font-bold text-[#5de6ff]">Online</span></div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5"><span className="text-[10px] text-[#c2c6d6] block">Gas Avg</span><span className="text-lg font-bold text-[#bdc2ff]">32 Gwei</span></div>
                    </div>
                    <div className="h-16 bg-white/5 rounded-xl border border-white/5 p-3 font-mono text-[11px] text-blue-300 overflow-hidden flex flex-col justify-end">
                      <p>&gt; Fetching Tx Hash: 0x7a2d...9b21</p>
                      <p>&gt; Verification Status: SUCCESS (Prescription Valid)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Floating Badges */}
              <div className="absolute -top-6 -right-6 bg-slate-900/80 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl transition-transform hover:-translate-y-1">
                <ShieldCheck className="text-[#5de6ff] h-5 w-5" />
                <span className="text-xs font-semibold tracking-wider text-white">Tamper-Proof</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-slate-900/80 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl">
                <QrCode className="text-[#adc6ff] h-5 w-5" />
                <span className="text-xs font-semibold tracking-wider text-white">QR Verified</span>
              </div>
            </div>

          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-24 px-6 md:px-16 bg-[#0e0e0e]" id="workflow">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-white">Prescription Lifecycle</h2>
              <div className="h-1 w-24 bg-[#adc6ff] mx-auto rounded-full"></div>
            </div>
            
            <div className="relative grid grid-cols-2 md:grid-cols-6 gap-8 text-center">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full border border-white/10 bg-slate-900/60 flex items-center justify-center text-[#adc6ff] group-hover:bg-[#adc6ff] group-hover:text-[#002e6a] transition-all duration-300">
                  <User className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#adc6ff] block">01</span>
                  <h3 className="font-semibold text-sm text-white">Identity</h3>
                  <p className="text-xs text-[#c2c6d6]">ABHA ID Auth</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full border border-white/10 bg-slate-900/60 flex items-center justify-center text-[#adc6ff] group-hover:bg-[#adc6ff] group-hover:text-[#002e6a] transition-all duration-300">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#adc6ff] block">02</span>
                  <h3 className="font-semibold text-sm text-white">Doctor</h3>
                  <p className="text-xs text-[#c2c6d6]">Signed Entry</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full border border-white/10 bg-slate-900/60 flex items-center justify-center text-[#adc6ff] group-hover:bg-[#adc6ff] group-hover:text-[#002e6a] transition-all duration-300">
                  <QrCode className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#adc6ff] block">03</span>
                  <h3 className="font-semibold text-sm text-white">QR Issued</h3>
                  <p className="text-xs text-[#c2c6d6]">Encrypted Key</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full border border-white/10 bg-slate-900/60 flex items-center justify-center text-[#adc6ff] group-hover:bg-[#adc6ff] group-hover:text-[#002e6a] transition-all duration-300">
                  <Scan className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#adc6ff] block">04</span>
                  <h3 className="font-semibold text-sm text-white">Pharmacy</h3>
                  <p className="text-xs text-[#c2c6d6]">Chain Query</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full border border-white/10 bg-slate-900/60 flex items-center justify-center text-[#adc6ff] group-hover:bg-[#adc6ff] group-hover:text-[#002e6a] transition-all duration-300">
                  <Activity className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#adc6ff] block">05</span>
                  <h3 className="font-semibold text-sm text-white">Dispensing</h3>
                  <p className="text-xs text-[#c2c6d6]">Ledger Updated</p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full border border-white/10 bg-slate-900/60 flex items-center justify-center text-[#adc6ff] group-hover:bg-[#adc6ff] group-hover:text-[#002e6a] transition-all duration-300">
                  <Briefcase className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#adc6ff] block">06</span>
                  <h3 className="font-semibold text-sm text-white">Regulator</h3>
                  <p className="text-xs text-[#c2c6d6]">Real-time Audit</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* User Roles Fast Navigation Cards Section */}
        <section className="py-16 px-6 md:px-16 border-t border-white/5 bg-[#050505]" id="roles">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">Internal Role Portals</h2>
              <p className="text-sm text-[#c2c6d6]">Quick links to jump into your respective dashboard environment during hackathon demo loops.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/citizen" className="p-5 rounded-2xl border border-white/5 bg-[#131313] hover:border-blue-500/30 group transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold text-sm text-white">Citizen Vault</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/30 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              
              <Link href="/doctor" className="p-5 rounded-2xl border border-white/5 bg-[#131313] hover:border-blue-500/30 group transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-5 w-5 text-teal-400" />
                    <span className="font-semibold text-sm text-white">Doctor Console</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/30 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link href="/pharmacy" className="p-5 rounded-2xl border border-white/5 bg-[#131313] hover:border-blue-500/30 group transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Scan className="h-5 w-5 text-purple-400" />
                    <span className="font-semibold text-sm text-white">Pharmacy Desk</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/30 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link href="/regulator" className="p-5 rounded-2xl border border-white/5 bg-[#131313] hover:border-blue-500/30 group transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-[#bdc2ff]" />
                    <span className="font-semibold text-sm text-white">Regulator Panel</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/30 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section (Bento Grid Style) */}
        <section className="py-24 px-6 md:px-16" id="features">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-2 text-white">Core Architectural Features</h2>
              <p className="text-[#c2c6d6] text-sm">Engineered for absolute data integrity and regulatory compliance at scale.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 p-8 rounded-[24px] flex flex-col gap-4 col-span-1 md:col-span-2 hover:border-blue-500/20 transition-all">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <ShieldCheck className="text-[#adc6ff] h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Anti-counterfeit Protection</h3>
                <p className="text-sm text-[#c2c6d6] leading-relaxed">
                  A verification system that anchors manufacturer metrics with secure cryptographic blockchain receipts, ensuring every distributed drug package is completely genuine.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 p-8 rounded-[24px] flex flex-col gap-4 hover:border-blue-500/20 transition-all">
                <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                  <Database className="text-[#5de6ff] h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Blockchain Security</h3>
                <p className="text-sm text-[#c2c6d6] leading-relaxed">
                  Immutable lifecycle state logging records anchored securely on Polygon for low-latency, hyper-secure networks.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 p-8 rounded-[24px] flex flex-col gap-4 hover:border-blue-500/20 transition-all">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <QrCode className="text-[#bdc2ff] h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">QR Verification</h3>
                <p className="text-sm text-[#c2c6d6] leading-relaxed">
                  Instant tamper-prevention check validations performed locally at the checkout point via standardized webcams or mobile devices.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 p-8 rounded-[24px] flex flex-col gap-4 col-span-1 md:col-span-2 hover:border-blue-500/20 transition-all">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="text-[#adc6ff] h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Prescription Lifecycle Auditing</h3>
                <p className="text-sm text-[#c2c6d6] leading-relaxed">
                  A perfect historic data audit trail recording each link in the chain—stretching from primary physician entry up to dispensing records.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="w-full py-12 px-6 md:px-16 max-w-7xl mx-auto border-t border-white/5 bg-[#0e0e0e] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-black" /></div>
            <span className="text-lg font-bold text-[#adc6ff]">MediChain</span>
          </div>
          <p className="text-xs text-[#c2c6d6]">
            © 2026 MediChain Protocol. Secure. Immutable. Verified.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-xs text-[#c2c6d6] font-medium uppercase tracking-wider">
          <a className="hover:text-[#5de6ff] transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-[#5de6ff] transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-[#5de6ff] transition-colors" href="#">Security Audit</a>
        </div>

        <div className="flex gap-3">
          <a className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:text-[#adc6ff] transition-colors" href="#">
            <Globe className="w-4 h-4" />
          </a>
          <a className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:text-[#adc6ff] transition-colors" href="#">
            <Terminal className="w-4 h-4" />
          </a>
        </div>
      </footer>

    </div>
  );
}