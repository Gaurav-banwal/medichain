'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  History, 
  Search, 
  Activity, 
  UserCog, 
  FilePlus2, 
  Users, 
  QrCode, 
  ClipboardCheck, 
  Package, 
  FileWarning, 
  Building2, 
  BookOpen, 
  HeartPulse 
} from 'lucide-react';

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const roleLinks: Record<string, SidebarLink[]> = {
    CITIZEN: [
      { label: 'Overview', href: '/citizen/dashboard', icon: LayoutDashboard },
      { label: 'My Prescriptions', href: '/citizen/prescriptions', icon: FileSpreadsheet },
      { label: 'Medicine History', href: '/citizen/medicine-history', icon: History },
      { label: 'Verify Medicine', href: '/citizen/verify-medicine', icon: ClipboardCheck },
      { label: 'Blockchain Ledger', href: '/citizen/blockchain-records', icon: Activity },
      { label: 'Profile Options', href: '/citizen/profile', icon: UserCog },
    ],
    DOCTOR: [
      { label: 'Overview', href: '/doctor/dashboard', icon: LayoutDashboard },
      { label: 'Issue Prescription', href: '/doctor/create-prescription', icon: FilePlus2 },
      { label: 'Sent Prescriptions', href: '/doctor/prescriptions', icon: FileSpreadsheet },
      { label: 'My Patients', href: '/doctor/patients', icon: Users },
      { label: 'Profile Options', href: '/doctor/profile', icon: UserCog },
    ],
    PHARMACY: [
      { label: 'Overview', href: '/pharmacy/dashboard', icon: LayoutDashboard },
      { label: 'Scan QR Code', href: '/pharmacy/verify', icon: QrCode },
      { label: 'Dispense Medicine', href: '/pharmacy/dispense', icon: ClipboardCheck },
      { label: 'Drug Inventory', href: '/pharmacy/inventory', icon: Package },
      { label: 'Profile Options', href: '/pharmacy/profile', icon: UserCog },
    ],
    REGULATOR: [
      { label: 'Overview', href: '/regulator/dashboard', icon: LayoutDashboard },
      { label: 'Audit Logs', href: '/regulator/audit-logs', icon: BookOpen },
      { label: 'System Reports', href: '/regulator/reports', icon: FileSpreadsheet },
      { label: 'Blockchain Scan', href: '/regulator/blockchain-explorer', icon: Search },
      { label: 'Investigations', href: '/regulator/investigations', icon: FileWarning },
    ],
  };

  const links = roleLinks[user.role] || [];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-border/40 bg-slate-900 text-slate-300 dark:bg-slate-950 dark:border-border/10">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-slate-800 dark:border-slate-900 bg-slate-950/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 shadow-md">
          <HeartPulse className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white tracking-wide leading-none">MEDICHAIN</span>
          <span className="text-[9px] text-slate-400 font-medium tracking-widest mt-1">SECURE LEDGER</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
        <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">
          Navigator Nodes
        </span>
        {links.map((link) => {
          const isActive = pathname === link.href;
          const IconComponent = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500/10 to-emerald-500/5 text-sky-400 border-l-4 border-sky-500 pl-2.5 font-semibold'
                  : 'hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'
              }`}
            >
              <IconComponent className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-white'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Credentials */}
      <div className="border-t border-slate-800 dark:border-slate-900 p-4 bg-slate-950/40">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 uppercase">
            {user.role.substring(0, 2)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">{user.name}</span>
            <span className="text-[10px] text-slate-400 truncate capitalize">{user.role.toLowerCase()} node</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
