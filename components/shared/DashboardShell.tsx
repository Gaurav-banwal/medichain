'use client';

import Sidebar from '@/components/shared/Sidebar';
import Navbar from '@/components/shared/Navbar';
import { AuthProvider } from '@/components/shared/AuthContext';

export default function DashboardShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden ml-64">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
