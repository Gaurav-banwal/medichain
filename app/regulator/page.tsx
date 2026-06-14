'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/shared/AuthContext';
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
  Pill,
  BarChart3,
  Ban,
  CheckCircle,
  Plus,
  X,
  Sliders,
  Edit
} from 'lucide-react';

export default function RegulatorDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'medicines'>('prescriptions');
  
  // Data States
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);
  const [loadingMedicines, setLoadingMedicines] = useState(true);
  
  // Search States
  const [prescriptionSearch, setPrescriptionSearch] = useState("");
  const [medicineSearch, setMedicineSearch] = useState("");
  const [medicineSalesSearch, setMedicineSalesSearch] = useState("");
  
  // Register Modal / Form States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newMedName, setNewMedName] = useState("");
  const [newMedUnit, setNewMedUnit] = useState("mg");
  const [newMedMaxDose, setNewMedMaxDose] = useState("");
  const [newMedMaxDuration, setNewMedMaxDuration] = useState("");
  const [newMedScheduleClass, setNewMedScheduleClass] = useState("UNCLASSIFIED");
  const [newMedMaxDailyDosage, setNewMedMaxDailyDosage] = useState("");
  const [newMedRegulationMaxDurationDays, setNewMedRegulationMaxDurationDays] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  
  // Edit Modal / Form States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<any>(null);
  const [editMedName, setEditMedName] = useState("");
  const [editMedUnit, setEditMedUnit] = useState("mg");
  const [editMedMaxDose, setEditMedMaxDose] = useState("");
  const [editMedMaxDuration, setEditMedMaxDuration] = useState("");
  const [editMedScheduleClass, setEditMedScheduleClass] = useState("UNCLASSIFIED");
  const [editMedMaxDailyDosage, setEditMedMaxDailyDosage] = useState("");
  const [editMedRegulationMaxDurationDays, setEditMedRegulationMaxDurationDays] = useState("");
  const [editMedIsBanned, setEditMedIsBanned] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Fetch Prescriptions
  async function loadPrescriptions() {
    setLoadingPrescriptions(true);
    try {
      const res = await fetch('/api/prescriptions');
      if (res.ok) {
        const result = await res.json();
        setPrescriptions(result.data || []);
      }
    } catch (err) {
      console.error('Failed to load prescriptions', err);
    } finally {
      setLoadingPrescriptions(false);
    }
  }

  // Fetch Medicines
  async function loadMedicines() {
    setLoadingMedicines(true);
    try {
      const res = await fetch('/api/medicines?includeBanned=true');
      if (res.ok) {
        const result = await res.json();
        setMedicines(result.data || []);
      }
    } catch (err) {
      console.error('Failed to load medicines', err);
    } finally {
      setLoadingMedicines(false);
    }
  }

  useEffect(() => {
    loadPrescriptions();
    loadMedicines();
  }, []);

  // Ban or Unban a Medicine
  const handleToggleBan = async (medicineId: string, currentBannedStatus: boolean) => {
    setActionInProgress(medicineId);
    try {
      const res = await fetch(`/api/medicines/${medicineId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBanned: !currentBannedStatus })
      });
      if (res.ok) {
        // Reload data
        await loadMedicines();
        await loadPrescriptions();
      } else {
        const errData = await res.json();
        alert(`Failed to update status: ${errData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error toggling ban state:', error);
    } finally {
      setActionInProgress(null);
    }
  };

  // Open Edit Modal
  const openEditModal = (med: any) => {
    setEditingMedicine(med);
    setEditMedName(med.name || "");
    setEditMedUnit(med.unit || "mg");
    setEditMedMaxDose(med.maxDosePerDay?.toString() || "");
    setEditMedMaxDuration(med.maxDurationDays?.toString() || "");
    setEditMedScheduleClass(med.MedicineRegulation?.scheduleClass || "UNCLASSIFIED");
    setEditMedMaxDailyDosage(med.MedicineRegulation?.maxDailyDosage?.toString() || "");
    setEditMedRegulationMaxDurationDays(med.MedicineRegulation?.maxDurationDays?.toString() || "");
    setEditMedIsBanned(med.isBanned || false);
    setEditError("");
    setEditSuccess("");
    setIsEditModalOpen(true);
  };

  // Submit Edit Form
  const handleUpdateMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");

    if (!editingMedicine) return;

    try {
      const res = await fetch(`/api/medicines/${editingMedicine.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editMedName.trim(),
          unit: editMedUnit,
          maxDosePerDay: parseFloat(editMedMaxDose),
          maxDurationDays: parseInt(editMedMaxDuration, 10),
          scheduleClass: editMedScheduleClass,
          maxDailyDosage: editMedMaxDailyDosage ? parseFloat(editMedMaxDailyDosage) : null,
          regulationMaxDurationDays: editMedRegulationMaxDurationDays ? parseInt(editMedRegulationMaxDurationDays, 10) : null,
          isBanned: editMedIsBanned
        })
      });

      if (res.ok) {
        setEditSuccess("Medicine regulations updated successfully!");
        await loadMedicines();
        await loadPrescriptions();
        setTimeout(() => {
          setIsEditModalOpen(false);
          setEditSuccess("");
          setEditingMedicine(null);
        }, 1500);
      } else {
        const errData = await res.json();
        setEditError(errData.error || "Failed to update regulations.");
      }
    } catch (err) {
      setEditError("An unexpected error occurred.");
    }
  };

  // Register New Medicine
  const handleRegisterMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    
    if (!newMedName.trim() || !newMedMaxDose || !newMedMaxDuration) {
      setRegisterError("Please fill out all required fields.");
      return;
    }

    try {
      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMedName.trim(),
          unit: newMedUnit,
          maxDosePerDay: parseFloat(newMedMaxDose),
          maxDurationDays: parseInt(newMedMaxDuration, 10),
          scheduleClass: newMedScheduleClass,
          maxDailyDosage: newMedMaxDailyDosage ? parseFloat(newMedMaxDailyDosage) : null,
          regulationMaxDurationDays: newMedRegulationMaxDurationDays ? parseInt(newMedRegulationMaxDurationDays, 10) : null,
          isBanned: false
        })
      });

      if (res.ok) {
        setRegisterSuccess("Medicine registered successfully!");
        setNewMedName("");
        setNewMedMaxDose("");
        setNewMedMaxDuration("");
        setNewMedScheduleClass("UNCLASSIFIED");
        setNewMedMaxDailyDosage("");
        setNewMedRegulationMaxDurationDays("");
        await loadMedicines();
        setTimeout(() => {
          setIsRegisterModalOpen(false);
          setRegisterSuccess("");
        }, 1500);
      } else {
        const errData = await res.json();
        setRegisterError(errData.error || "Failed to register medicine.");
      }
    } catch (err) {
      setRegisterError("An unexpected error occurred.");
    }
  };

  // Filter Prescriptions
  const filteredPrescriptions = prescriptions.filter((rx: any) => {
    const query = prescriptionSearch.toLowerCase();
    const hash = rx.txHash || rx.prescriptionId || rx.id || '';
    const doctor = rx.User_Prescription_doctorIdToUser?.name || '';
    const patient = rx.User_Prescription_patientIdToUser?.name || '';
    const medicinesList = rx.PrescriptionItem?.map((item: any) => item.Medicine?.name || '').join(' ') || '';
    
    return hash.toLowerCase().includes(query) ||
           doctor.toLowerCase().includes(query) ||
           patient.toLowerCase().includes(query) ||
           medicinesList.toLowerCase().includes(query);
  });

  // Filter Medicines
  const filteredMedicinesList = medicines.filter((med: any) => {
    const query = medicineSearch.toLowerCase();
    const name = med.name || '';
    const schedule = med.MedicineRegulation?.scheduleClass || 'UNCLASSIFIED';
    return name.toLowerCase().includes(query) || schedule.toLowerCase().includes(query);
  });

  // Calculate dynamic medicine sales (prescribed/dispensed counts)
  const medicineSalesMap = new Map<string, number>();
  prescriptions.forEach((rx: any) => {
    if (rx.PrescriptionItem && Array.isArray(rx.PrescriptionItem)) {
      rx.PrescriptionItem.forEach((item: any) => {
        if (item.Medicine && item.Medicine.name) {
          const name = item.Medicine.name;
          medicineSalesMap.set(name, (medicineSalesMap.get(name) || 0) + 1);
        }
      });
    }
  });

  const medicineSales = Array.from(medicineSalesMap.entries())
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales);

  const filteredMedicineSales = medicineSales.filter(item =>
    item.name.toLowerCase().includes(medicineSalesSearch.toLowerCase())
  );

  const totalSales = medicineSales.reduce((acc, curr) => acc + curr.sales, 0);
  const activeCount = prescriptions.filter(rx => rx.status === 'CREATED' || rx.status === 'VERIFIED').length;
  const dispensedCount = prescriptions.filter(rx => rx.status === 'DISPENSED').length;

  return (
    <div className="bg-[#050505] text-[#e5e2e1] min-h-screen font-sans antialiased selection:bg-blue-500/30 flex">
      
      {/* Fixed Left Navigation Drawer SideBar */}
      <aside className="h-full w-64 fixed left-0 top-0 border-r border-white/10 flex flex-col pt-6 pb-4 z-50 bg-[#1c1b1b]/60 backdrop-blur-xl">
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
          <button 
            onClick={() => setActiveTab('prescriptions')}
            className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all text-xs font-bold uppercase tracking-wider font-mono ${
              activeTab === 'prescriptions'
                ? 'bg-[#5de6ff]/10 text-[#5de6ff] border-r-2 border-[#5de6ff]'
                : 'text-[#8c909f] hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Prescriptions</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('medicines')}
            className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all text-xs font-bold uppercase tracking-wider font-mono ${
              activeTab === 'medicines'
                ? 'bg-[#5de6ff]/10 text-[#5de6ff] border-r-2 border-[#5de6ff]'
                : 'text-[#8c909f] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Regulation Console</span>
          </button>

          <a href="#" className="flex items-center gap-3 py-2.5 px-4 text-[#8c909f] opacity-70 hover:bg-white/5 hover:text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider font-mono">
            <InsightsIcon className="w-4 h-4" />
            <span>Analytics</span>
          </a>
        </nav>

        <div className="px-3 border-t border-white/5 pt-4 text-xs font-mono uppercase tracking-wider font-semibold text-[#8c909f]">
          <button onClick={logout} className="flex items-center gap-3 py-2 px-4 w-full text-left hover:bg-white/5 hover:text-white rounded-lg transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Framework Frame Space */}
      <main className="ml-64 flex-1 flex flex-col h-screen overflow-hidden bg-[#050505]">
        
        {/* Fixed Horizontal Top Utility Control Panel Bar */}
        <header className="h-16 flex justify-between items-center px-10 bg-[#131313]/65 backdrop-blur-xl border-b border-white/10 z-40">
          <div className="flex items-center flex-1 max-w-xl">
            <span className="text-sm font-mono text-[#adc6ff] uppercase tracking-wider">
              {activeTab === 'prescriptions' ? 'Prescription Audits' : 'National Drug Formulation Registry'}
            </span>
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
                  System state: <span className="text-emerald-400 font-bold">NORMAL</span>
                </p>
              </div>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5de6ff]">Live Audit Node</span>
              </div>
            </div>

            {/* Top Row Grid: Custom Bento Analytical Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-[#131313] border border-white/10 p-5 rounded-2xl">
                <div className="flex justify-between items-start mb-2 text-[#8c909f]">
                  <span className="text-[10px] font-bold tracking-wider font-mono uppercase">Total Prescriptions</span>
                  <FileText className="text-[#adc6ff] w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">{prescriptions.length}</div>
                <div className="flex items-center gap-1 text-[#5de6ff] text-[11px] font-semibold mt-2 font-mono">
                  <TrendingUp className="w-3 h-3" /> Live Sync Active
                </div>
              </div>

              <div className="bg-[#131313] border border-white/10 p-5 rounded-2xl border-l-4 border-l-[#5de6ff]">
                <div className="flex justify-between items-start mb-2 text-[#8c909f]">
                  <span className="text-[10px] font-bold tracking-wider font-mono uppercase">Medicines Prescribed</span>
                  <Activity className="text-[#5de6ff] w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">{totalSales}</div>
                <span className="text-[10px] bg-[#5de6ff]/10 text-[#5de6ff] border border-[#5de6ff]/20 px-2.5 py-0.5 rounded font-bold uppercase font-mono tracking-wider inline-block mt-2">Active Database Records</span>
              </div>

              <div className="bg-[#131313] border border-white/10 p-5 rounded-2xl">
                <div className="flex justify-between items-start mb-2 text-[#8c909f]">
                  <span className="text-[10px] font-bold tracking-wider font-mono uppercase">Banned Formulations</span>
                  <Ban className="text-red-400 w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {medicines.filter(m => m.isBanned).length}
                </div>
                <div className="flex items-center gap-1 text-red-400 text-[11px] font-semibold mt-2 font-mono">
                  Active Banned Enforcements
                </div>
              </div>

            </div>

            {/* Tab 1: Prescriptions audits tab */}
            {activeTab === 'prescriptions' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Live Compliance Ledger */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 shadow-xl">
                    <div className="border-b border-white/10 pb-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <BarChart3 className="text-[#adc6ff] w-5 h-5" />
                          Live Cryptographic Audit Ledger
                        </h3>
                      </div>
                      
                      {/* Search Bar directly inside ledger card */}
                      <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f] w-3.5 h-3.5" />
                        <input 
                          value={prescriptionSearch}
                          onChange={(e) => setPrescriptionSearch(e.target.value)}
                          className="w-full bg-[#050505] border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder-[#8c909f] focus:outline-none focus:border-[#5de6ff] transition-all" 
                          placeholder="Search doctor, patient, medicines..." 
                          type="text"
                        />
                      </div>
                    </div>

                    {loadingPrescriptions ? (
                      <div className="py-12 flex justify-center">
                        <div className="w-8 h-8 border-4 border-t-transparent border-[#5de6ff] rounded-full animate-spin"></div>
                      </div>
                    ) : filteredPrescriptions.length === 0 ? (
                      <div className="py-12 text-center text-xs text-[#8c909f]">
                        No prescriptions matching search query found in the audit matrix.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="text-[#8c909f] font-mono uppercase text-[10px] bg-white/5 border-b border-white/10">
                              <th className="px-5 py-3">Prescription Hash ID</th>
                              <th className="px-5 py-3">Attending Doctor</th>
                              <th className="px-5 py-3">Patient Profile</th>
                              <th className="px-5 py-3">Prescribed Medicine</th>
                              <th className="px-5 py-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-mono text-[#c2c6d6]">
                            {filteredPrescriptions.map((rx: any, index: number) => {
                              const hash = rx.txHash ? `${rx.txHash.slice(0,6)}...${rx.txHash.slice(-4)}` : (rx.prescriptionId ? `${rx.prescriptionId.slice(0,6)}...${rx.prescriptionId.slice(-4)}` : rx.id.slice(0,10));
                              const doctorName = rx.User_Prescription_doctorIdToUser?.name || 'Dr. Unknown';
                              const patientName = rx.User_Prescription_patientIdToUser?.name || 'Patient';
                              const meds = rx.PrescriptionItem?.map((item: any) => `${item.Medicine?.name || 'Medicine'} (${item.dosageAmount}${item.Medicine?.unit || 'mg'})`).join(', ') || 'N/A';
                              
                              return (
                                <tr key={index} className="hover:bg-white/[0.01] transition-colors">
                                  <td className="px-5 py-3.5 text-[#5de6ff] font-bold">{hash}</td>
                                  <td className="px-5 py-3.5 font-sans font-medium text-white">{doctorName}</td>
                                  <td className="px-5 py-3.5 font-sans">{patientName}</td>
                                  <td className="px-5 py-3.5 opacity-80 font-sans">{meds}</td>
                                  <td className="px-5 py-3.5 text-right">
                                    {rx.status === 'CREATED' && <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-[9px]">Created</span>}
                                    {rx.status === 'DISPENSED' && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[9px]">Dispensed</span>}
                                    {rx.status === 'EXPIRED' && <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-[9px]">Expired</span>}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Medicine Sales Tracker Summary */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 shadow-xl">
                    <div className="border-b border-white/10 pb-4 mb-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Pill className="text-[#5de6ff] w-5 h-5" />
                        <h3 className="text-sm font-bold text-white">Aggregated Drug Sales</h3>
                      </div>
                      
                      {/* Search Bar directly inside drug sales card */}
                      <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f] w-3.5 h-3.5" />
                        <input 
                          value={medicineSalesSearch}
                          onChange={(e) => setMedicineSalesSearch(e.target.value)}
                          className="w-full bg-[#050505] border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder-[#8c909f] focus:outline-none focus:border-[#5de6ff] transition-all" 
                          placeholder="Search sales by medicine..." 
                          type="text"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                      {filteredMedicineSales.map((item, index) => {
                        const percentage = totalSales > 0 ? (item.sales / totalSales) * 100 : 0;
                        return (
                          <div key={index} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#5de6ff]/20 transition-all">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="font-bold text-white font-sans text-xs">{item.name}</span>
                              <span className="text-[#5de6ff] font-bold font-mono text-xs">{item.sales} sold</span>
                            </div>
                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                              <div className="bg-[#5de6ff] h-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: Medicine Regulation Tab */}
            {activeTab === 'medicines' && (
              <div className="space-y-6">
                <div className="bg-[#131313] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <div className="border-b border-white/10 pb-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sliders className="text-[#5de6ff] w-5 h-5" />
                        Medicine Compliance Control Panel
                      </h3>
                      <p className="text-xs text-[#8c909f] mt-1">Ban hazardous formulations or register new pharmaceutical catalog entries.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      {/* Search bar directly inside drug regulation card */}
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c909f] w-3.5 h-3.5" />
                        <input 
                          value={medicineSearch}
                          onChange={(e) => setMedicineSearch(e.target.value)}
                          className="w-full bg-[#050505] border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder-[#8c909f] focus:outline-none focus:border-[#5de6ff] transition-all" 
                          placeholder="Search medicine catalog..." 
                          type="text"
                        />
                      </div>
                      
                      <button 
                        onClick={() => setIsRegisterModalOpen(true)}
                        className="bg-[#5de6ff] text-[#00363e] hover:opacity-90 py-1.5 px-4 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-cyan-500/10"
                      >
                        <Plus className="w-4 h-4" /> Register Drug
                      </button>
                    </div>
                  </div>

                  {loadingMedicines ? (
                    <div className="py-12 flex justify-center">
                      <div className="w-8 h-8 border-4 border-t-transparent border-[#5de6ff] rounded-full animate-spin"></div>
                    </div>
                  ) : filteredMedicinesList.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#8c909f]">
                      No medicine formulations registered.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="text-[#8c909f] font-mono uppercase text-[10px] bg-white/5 border-b border-white/10">
                            <th className="px-5 py-3">Medicine Name</th>
                            <th className="px-5 py-3">Unit</th>
                            <th className="px-5 py-3">Max Dose/Day</th>
                            <th className="px-5 py-3">Max Duration</th>
                            <th className="px-5 py-3">Schedule Class</th>
                            <th className="px-5 py-3">Reg. Max Dose</th>
                            <th className="px-5 py-3">Reg. Max Duration</th>
                            <th className="px-5 py-3">Regulatory Status</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono text-[#c2c6d6]">
                          {filteredMedicinesList.map((med: any, index: number) => {
                            const regulation = med.MedicineRegulation;
                            const schedule = regulation?.scheduleClass || 'UNCLASSIFIED';
                            const regMaxDose = regulation?.maxDailyDosage ? `${regulation.maxDailyDosage} ${med.unit}` : 'None';
                            const regMaxDuration = regulation?.maxDurationDays ? `${regulation.maxDurationDays} days` : 'None';
                            const isBanned = med.isBanned;
                            
                            return (
                              <tr key={index} className="hover:bg-white/[0.01] transition-colors">
                                <td className="px-5 py-3.5 text-white font-sans font-bold">{med.name}</td>
                                <td className="px-5 py-3.5 uppercase">{med.unit}</td>
                                <td className="px-5 py-3.5">{med.maxDosePerDay} {med.unit}</td>
                                <td className="px-5 py-3.5">{med.maxDurationDays} days</td>
                                <td className="px-5 py-3.5 text-[#adc6ff]">{schedule}</td>
                                <td className="px-5 py-3.5 text-[#5de6ff]">{regMaxDose}</td>
                                <td className="px-5 py-3.5 text-[#5de6ff]">{regMaxDuration}</td>
                                <td className="px-5 py-3.5">
                                  {isBanned ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                      <Ban className="w-2.5 h-2.5" /> BANNED
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      <CheckCircle className="w-2.5 h-2.5" /> APPROVED
                                    </span>
                                  )}
                                </td>
                                <td className="px-5 py-3.5 text-right flex justify-end gap-2">
                                  <button
                                    onClick={() => openEditModal(med)}
                                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all active:scale-95 flex items-center gap-1"
                                  >
                                    <Edit className="w-3 h-3" /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleToggleBan(med.id, isBanned)}
                                    disabled={actionInProgress === med.id}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono transition-all active:scale-95 ${
                                      isBanned 
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                    } disabled:opacity-50`}
                                  >
                                    {actionInProgress === med.id ? 'Updating...' : (isBanned ? 'Lift Ban' : 'Enforce Ban')}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Register Medicine Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#131313] border border-white/10 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Pill className="text-[#5de6ff] w-5 h-5" />
                Register New Formulation
              </h3>
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-[#8c909f] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterMedicine} className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {registerError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-mono">
                  {registerError}
                </div>
              )}
              {registerSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-mono">
                  {registerSuccess}
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Medicine Name *</label>
                <input
                  type="text"
                  required
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="e.g. Ibuprofen"
                  className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                />
              </div>

              {/* Base Medicine Properties */}
              <div className="border-t border-white/5 pt-3">
                <h4 className="text-xs font-bold text-white mb-3 font-mono text-[#adc6ff] uppercase tracking-wider">Base Catalog Properties</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Catalog Unit</label>
                    <select
                      value={newMedUnit}
                      onChange={(e) => setNewMedUnit(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                    >
                      <option value="mg">mg</option>
                      <option value="ml">ml</option>
                      <option value="mcg">mcg</option>
                      <option value="tablet">tablet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Max Dose/Day *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={newMedMaxDose}
                      onChange={(e) => setNewMedMaxDose(e.target.value)}
                      placeholder="e.g. 1000"
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Max Duration *</label>
                    <input
                      type="number"
                      required
                      value={newMedMaxDuration}
                      onChange={(e) => setNewMedMaxDuration(e.target.value)}
                      placeholder="Days (e.g. 30)"
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Government Regulation Properties */}
              <div className="border-t border-white/5 pt-3">
                <h4 className="text-xs font-bold text-white mb-3 font-mono text-[#5de6ff] uppercase tracking-wider">Government Regulation Overrides</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Schedule Class</label>
                    <select
                      value={newMedScheduleClass}
                      onChange={(e) => setNewMedScheduleClass(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                    >
                      <option value="UNCLASSIFIED">UNCLASSIFIED</option>
                      <option value="Schedule H">Schedule H</option>
                      <option value="Schedule G">Schedule G</option>
                      <option value="Schedule X">Schedule X</option>
                      <option value="Schedule H1">Schedule H1</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Reg. Max Dose</label>
                    <input
                      type="number"
                      step="any"
                      value={newMedMaxDailyDosage}
                      onChange={(e) => setNewMedMaxDailyDosage(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Reg. Max Duration</label>
                    <input
                      type="number"
                      value={newMedRegulationMaxDurationDays}
                      onChange={(e) => setNewMedRegulationMaxDurationDays(e.target.value)}
                      placeholder="Days (e.g. 10)"
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="w-1/2 py-2 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg font-mono text-xs uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 px-4 bg-[#5de6ff] text-[#00363e] hover:opacity-90 font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {isEditModalOpen && editingMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#131313] border border-white/10 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="text-[#5de6ff] w-5 h-5" />
                Update Medicine & Regulations
              </h3>
              <button 
                onClick={() => { setIsEditModalOpen(false); setEditingMedicine(null); }}
                className="text-[#8c909f] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMedicine} className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {editError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-mono">
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-mono">
                  {editSuccess}
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Medicine Name *</label>
                <input
                  type="text"
                  required
                  value={editMedName}
                  onChange={(e) => setEditMedName(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                />
              </div>

              {/* Base Medicine Properties */}
              <div className="border-t border-white/5 pt-3">
                <h4 className="text-xs font-bold text-white mb-3 font-mono text-[#adc6ff] uppercase tracking-wider">Base Catalog Properties</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Catalog Unit</label>
                    <select
                      value={editMedUnit}
                      onChange={(e) => setEditMedUnit(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                    >
                      <option value="mg">mg</option>
                      <option value="ml">ml</option>
                      <option value="mcg">mcg</option>
                      <option value="tablet">tablet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Max Dose/Day *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={editMedMaxDose}
                      onChange={(e) => setEditMedMaxDose(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Max Duration *</label>
                    <input
                      type="number"
                      required
                      value={editMedMaxDuration}
                      onChange={(e) => setEditMedMaxDuration(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Government Regulation Properties */}
              <div className="border-t border-white/5 pt-3">
                <h4 className="text-xs font-bold text-white mb-3 font-mono text-[#5de6ff] uppercase tracking-wider">Government Regulation Overrides</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Schedule Class</label>
                    <select
                      value={editMedScheduleClass}
                      onChange={(e) => setEditMedScheduleClass(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                    >
                      <option value="UNCLASSIFIED">UNCLASSIFIED</option>
                      <option value="Schedule H">Schedule H</option>
                      <option value="Schedule G">Schedule G</option>
                      <option value="Schedule X">Schedule X</option>
                      <option value="Schedule H1">Schedule H1</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Reg. Max Dose</label>
                    <input
                      type="number"
                      step="any"
                      value={editMedMaxDailyDosage}
                      onChange={(e) => setEditMedMaxDailyDosage(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-[#8c909f] mb-1.5">Reg. Max Duration</label>
                    <input
                      type="number"
                      value={editMedRegulationMaxDurationDays}
                      onChange={(e) => setEditMedRegulationMaxDurationDays(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5de6ff] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <input
                  type="checkbox"
                  id="editMedIsBanned"
                  checked={editMedIsBanned}
                  onChange={(e) => setEditMedIsBanned(e.target.checked)}
                  className="rounded bg-[#050505] border-white/10 text-[#5de6ff] focus:ring-0"
                />
                <label htmlFor="editMedIsBanned" className="text-xs font-mono text-red-400 font-bold uppercase cursor-pointer select-none">
                  Enforce Ban on Formulation
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setEditingMedicine(null); }}
                  className="w-1/2 py-2 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg font-mono text-xs uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 px-4 bg-[#5de6ff] text-[#00363e] hover:opacity-90 font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}