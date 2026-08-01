"use client";

import { use, useState, useEffect, useRef } from "react";
import { Wallet, Search, Filter, Download, Landmark, PiggyBank, Briefcase, GraduationCap, PartyPopper, Plus, X, ArrowUpDown } from "lucide-react";
import { useAnggota } from "@/context/AnggotaContext";

export default function LaporanSimpananPage({ params }: { params: Promise<{ jenis: string }> }) {
  const resolvedParams = use(params);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showHasBalanceOnly, setShowHasBalanceOnly] = useState(false);
  
  // Convert slug to Title Case
  const jenisTitle = resolvedParams.jenis
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Dummy Data for matrix 12 months
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  
  const isPokok = resolvedParams.jenis === 'pokok';

  const getTheme = (jenis: string) => {
    switch (jenis) {
      case 'wajib':
        return {
          pageGradient: 'from-emerald-100/70',
          iconBg: 'bg-emerald-100 text-emerald-600',
          tableHeaderTotal: 'bg-emerald-50/50 text-emerald-700 border-emerald-100',
          tableRowHover: 'hover:bg-emerald-50/30 group-hover:bg-emerald-50/30',
          totalColBg: 'bg-emerald-50/30 border-emerald-100 text-emerald-700',
          footerTotalColBg: 'bg-emerald-100/80 border-emerald-200 text-emerald-900',
          Icon: PiggyBank
        };
      case 'manasuka':
        return {
          pageGradient: 'from-purple-100/70',
          iconBg: 'bg-purple-100 text-purple-600',
          tableHeaderTotal: 'bg-purple-50/50 text-purple-700 border-purple-100',
          tableRowHover: 'hover:bg-purple-50/30 group-hover:bg-purple-50/30',
          totalColBg: 'bg-purple-50/30 border-purple-100 text-purple-700',
          footerTotalColBg: 'bg-purple-100/80 border-purple-200 text-purple-900',
          Icon: Briefcase
        };
      case 'pendidikan':
        return {
          pageGradient: 'from-amber-100/70',
          iconBg: 'bg-amber-100 text-amber-600',
          tableHeaderTotal: 'bg-amber-50/50 text-amber-700 border-amber-100',
          tableRowHover: 'hover:bg-amber-50/30 group-hover:bg-amber-50/30',
          totalColBg: 'bg-amber-50/30 border-amber-100 text-amber-700',
          footerTotalColBg: 'bg-amber-100/80 border-amber-200 text-amber-900',
          Icon: GraduationCap
        };
      case 'hari-raya':
        return {
          pageGradient: 'from-rose-100/70',
          iconBg: 'bg-rose-100 text-rose-600',
          tableHeaderTotal: 'bg-rose-50/50 text-rose-700 border-rose-100',
          tableRowHover: 'hover:bg-rose-50/30 group-hover:bg-rose-50/30',
          totalColBg: 'bg-rose-50/30 border-rose-100 text-rose-700',
          footerTotalColBg: 'bg-rose-100/80 border-rose-200 text-rose-900',
          Icon: PartyPopper
        };
      case 'pokok':
      default:
        return {
          pageGradient: 'from-blue-100/70',
          iconBg: 'bg-blue-100 text-blue-600',
          tableHeaderTotal: 'bg-blue-50/50 text-blue-700 border-blue-100',
          tableRowHover: 'hover:bg-blue-50/30 group-hover:bg-blue-50/30',
          totalColBg: 'bg-blue-50/30 border-blue-100 text-blue-700',
          footerTotalColBg: 'bg-blue-100/80 border-blue-200 text-blue-900',
          Icon: Landmark
        };
    }
  };

  const theme = getTheme(resolvedParams.jenis);

  const { members, pendidikanMembers, hariRayaMembers, setPendidikanMembers, setHariRayaMembers, transactions } = useAnggota();
  const dummyData: any[] = members.filter(m => {
    if (resolvedParams.jenis === 'pendidikan') return pendidikanMembers.some((p: any) => p.id === m.id);
    if (resolvedParams.jenis === 'hari-raya') return hariRayaMembers.some((p: any) => p.id === m.id);
    return true; // pokok, wajib, manasuka shows everyone
  }).flatMap(m => {
    
    // Helper function to extract array of 12 months for this member & type
    const getTransactionData = (descMatch: string, refPrefix?: string) => {
      const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let totalPokok = 0; // Or Total All Months for this specific query
      if (!transactions) return { data, totalPokok };
      
      transactions.forEach(t => {
        if (t.memberId === m.id && t.description === descMatch) {
          if (refPrefix && !t.id.startsWith(refPrefix)) return;
          
          const net = t.debit - t.kredit; // debit is positive change, kredit is negative
          const parts = t.date.split('/');
          if (parts.length >= 2) {
             const monthIdx = parseInt(parts[1], 10) - 1;
             if (monthIdx >= 0 && monthIdx < 12) {
               data[monthIdx] += net;
             }
          }
          totalPokok += net;
        }
      });
      return { data, totalPokok };
    };

    if (resolvedParams.jenis === 'pendidikan') {
      const pdks = pendidikanMembers.filter((p: any) => p.id === m.id);
      return pdks.map((p: any) => {
        const { data, totalPokok } = getTransactionData("Simpanan Pendidikan", p.ref);
        return {
          id: m.id,
          nama: m.name,
          dept: m.pekerjaan || '-',
          data,
          tahunLalu: 0,
          totalPokok,
          ref: p.ref,
          target: p.target,
          lamaBulan: p.lamaBulan,
          cicilan: p.cicilan
        };
      });
    }
    if (resolvedParams.jenis === 'hari-raya') {
      const thrs = hariRayaMembers.filter((p: any) => p.id === m.id);
      return thrs.map((p: any) => {
        const { data, totalPokok } = getTransactionData("Simpanan Hari Raya", p.ref);
        return {
          id: m.id,
          nama: m.name,
          dept: m.pekerjaan || '-',
          data,
          tahunLalu: 0,
          totalPokok,
          ref: p.ref,
          target: p.nominalPaket * p.jumlahPaket,
          lamaBulan: 12,
          cicilan: p.cicilan
        };
      });
    }
    
    let desc = "Simpanan Pokok";
    if (resolvedParams.jenis === "wajib") desc = "Simpanan Wajib";
    else if (resolvedParams.jenis === "manasuka") desc = "Simpanan Manasuka";
    
    const { data, totalPokok } = getTransactionData(desc);
    
    return [{
      id: m.id,
      nama: m.name,
      dept: m.pekerjaan || '-',
      data,
      tahunLalu: 0,
      totalPokok,
    }];
  });

  const formatCurrency = (val: number) => {
    if (val === 0) return "-";
    return new Intl.NumberFormat("id-ID").format(val);
  };

  const [memberSearch, setMemberSearch] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc'|'desc'}>({ key: 'id', direction: 'asc' });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [targetSaldo, setTargetSaldo] = useState("1000000");
  const [lamaBulan, setLamaBulan] = useState("12");
  const [nominalPaket, setNominalPaket] = useState("25000");
  const [jumlahPaket, setJumlahPaket] = useState(1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const memberInputRef = useRef<HTMLInputElement>(null);

  const pendidikanTargets = [
    1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 
    8000000, 9000000, 10000000, 15000000, 20000000, 25000000, 
    30000000, 40000000, 50000000
  ];
  const paketHariRaya = [25000, 50000, 100000, 200000];
  
  const calculateInstallment = (target: number, months: number) => {
    let discountRate = 0.034;
    if(months === 24) discountRate = 0.069;
    if(months === 36) discountRate = 0.1048;
    if(months === 48) discountRate = 0.1396;
    if(months === 60) discountRate = 0.172;
    if(months === 72) discountRate = 0.208;
    return Math.round((target * (1 - discountRate)) / months / 100) * 100;
  };

  const today = new Date();
  const ddmmyy = String(today.getDate()).padStart(2, '0') + String(today.getMonth() + 1).padStart(2, '0') + String(today.getFullYear()).slice(-2);
  const autoRefPrefix = resolvedParams.jenis === 'hari-raya' ? "THR-" : "EDU-";
  const currentCount = resolvedParams.jenis === 'hari-raya' ? hariRayaMembers.length : pendidikanMembers.length;
  const sequenceStr = String(currentCount + 1).padStart(2, '0');
  const autoRef = autoRefPrefix + ddmmyy + "-" + sequenceStr;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMemberDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMembersForModal = members.map(m => ({
    id: m.id,
    nama: m.name,
    dept: m.pekerjaan || '-',
  })).filter(m => m.nama.toLowerCase().includes(memberSearch.toLowerCase()) || m.id.toLowerCase().includes(memberSearch.toLowerCase()));

  const handleMemberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isMemberDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setIsMemberDropdownOpen(true);
      return;
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < filteredMembersForModal.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredMembersForModal.length) {
        setSelectedMember(filteredMembersForModal[highlightedIndex]);
        setIsMemberDropdownOpen(false);
        setMemberSearch("");
        setHighlightedIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setIsMemberDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500 pb-10 max-w-[100vw]">
      
      {/* Background Decorator */}
      <div className={`absolute top-0 left-0 right-0 h-[60vh] -z-10 bg-gradient-to-b ${theme.pageGradient} to-transparent -mx-8 -mt-8 pointer-events-none rounded-t-3xl`} />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
             <div className={`p-2 rounded-lg ${theme.iconBg}`}>
                <theme.Icon className="w-6 h-6" />
             </div>
             Laporan Simpanan {jenisTitle}
          </h2>
          <p className="text-gray-500 text-sm mt-1">Rekapitulasi transaksi bulanan simpanan {jenisTitle.toLowerCase()} per anggota.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm">
            <Filter className="w-4 h-4" />
            Tahun 2026
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20 font-medium text-sm">
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          {(resolvedParams.jenis === 'pendidikan' || resolvedParams.jenis === 'hari-raya') && (
            <button 
              onClick={() => {
                setSelectedMember(null);
                setMemberSearch("");
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Simpanan
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full ${isPokok ? 'max-w-3xl' : 'max-w-full'}`}>
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
           <div className="relative w-full sm:w-72">
             <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Cari nama atau ID anggota..." 
               value={tableSearch}
               onChange={(e) => setTableSearch(e.target.value)}
               className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
             />
           </div>
           <div className="text-sm text-gray-500 flex items-center gap-2">
             {resolvedParams.jenis === 'manasuka' && (
               <label className="flex items-center gap-2 mr-4 cursor-pointer">
                 <input 
                   type="checkbox" 
                   className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                   checked={showHasBalanceOnly}
                   onChange={(e) => setShowHasBalanceOnly(e.target.checked)}
                 />
                 <span className="text-gray-700 font-medium">Hanya tampilkan bersaldo</span>
               </label>
             )}
             Menampilkan <span className="font-bold text-gray-800">
               {dummyData.filter(row => {
                 if (tableSearch && !row.nama.toLowerCase().includes(tableSearch.toLowerCase()) && !row.id.toLowerCase().includes(tableSearch.toLowerCase()) && !row.dept.toLowerCase().includes(tableSearch.toLowerCase()) && !(row.ref && row.ref.toLowerCase().includes(tableSearch.toLowerCase()))) return false;
                 if (!showHasBalanceOnly || resolvedParams.jenis !== 'manasuka') return true;
                 const totalTahunIni = row.data.reduce((a, b) => a + b, 0);
                 const totalSemuanya = isPokok ? row.totalPokok : totalTahunIni + row.tahunLalu;
                 return totalSemuanya > 0;
               }).length}
             </span> anggota
           </div>
        </div>

        {/* The Matrix Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] relative w-full pb-2 custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-100 uppercase tracking-wider sticky top-0 z-50 shadow-sm">
              <tr>
                {resolvedParams.jenis === 'pendidikan' || resolvedParams.jenis === 'hari-raya' ? (
                  <>
                    <th onClick={() => handleSort('ref')} className="px-2 py-3 font-bold whitespace-nowrap border-r border-gray-200 sticky left-0 z-50 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors">
                      <div className="flex items-center gap-1">No Referensi <ArrowUpDown className="w-3 h-3"/></div>
                    </th>
                    <th onClick={() => handleSort('nama')} className="px-2 py-3 font-bold whitespace-nowrap border-r border-gray-200 sticky left-[110px] sm:left-[120px] z-30 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors">
                      <div className="flex items-center gap-1">Nama Anggota <ArrowUpDown className="w-3 h-3"/></div>
                    </th>
                    <th className="px-2 py-3 font-bold whitespace-nowrap border-r border-gray-200 sticky left-[230px] sm:left-[270px] z-20 bg-gray-100 shadow-[1px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      Info Simpanan
                    </th>
                  </>
                ) : (
                  <>
                    <th onClick={() => handleSort('id')} className="px-2 py-3 font-bold whitespace-nowrap border-r border-gray-200 sticky left-0 z-50 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors">
                      <div className="flex items-center gap-1">ID <ArrowUpDown className="w-3 h-3"/></div>
                    </th>
                    <th onClick={() => handleSort('nama')} className="px-2 py-3 font-bold whitespace-nowrap border-r border-gray-200 sticky left-[60px] sm:left-[80px] z-30 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors">
                      <div className="flex items-center gap-1">Nama Anggota <ArrowUpDown className="w-3 h-3"/></div>
                    </th>
                    <th onClick={() => handleSort('dept')} className="px-2 py-3 font-bold whitespace-nowrap border-r border-gray-200 sticky left-[150px] sm:left-[220px] z-20 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors shadow-[1px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex items-center gap-1">Pekerjaan <ArrowUpDown className="w-3 h-3"/></div>
                    </th>
                  </>
                )}
                
                {!isPokok && months.map(m => (
                  <th key={m} className="px-0.5 py-2 font-bold text-right text-xs whitespace-nowrap">{m}</th>
                ))}
                
                {!isPokok && (
                  <th className="px-0.5 py-2 font-bold text-gray-600 text-right text-xs bg-gray-100/50 border-l border-gray-200 leading-tight">Total<br/>Thn Ini</th>
                )}
                {!isPokok && (
                  <th className="px-0.5 py-2 font-bold text-gray-600 text-right text-xs bg-gray-100/50 leading-tight">Tahun<br/>Lalu</th>
                )}

                <th className={`px-0.5 py-2 font-black text-right text-xs border-l sticky right-0 z-10 shadow-[-1px_0_5px_-2px_rgba(0,0,0,0.1)] leading-tight ${theme.tableHeaderTotal}`}>
                  {isPokok ? 'Total (Rp)' : <span dangerouslySetInnerHTML={{ __html: 'Total<br/>Semua' }} />}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...dummyData].filter(row => {
                 if (tableSearch && !row.nama.toLowerCase().includes(tableSearch.toLowerCase()) && !row.id.toLowerCase().includes(tableSearch.toLowerCase()) && !row.dept.toLowerCase().includes(tableSearch.toLowerCase()) && !(row.ref && row.ref.toLowerCase().includes(tableSearch.toLowerCase()))) return false;
                 if (!showHasBalanceOnly || resolvedParams.jenis !== 'manasuka') return true;
                 const totalTahunIni = row.data.reduce((a, b) => a + b, 0);
                 const totalSemuanya = isPokok ? row.totalPokok : totalTahunIni + row.tahunLalu;
                 return totalSemuanya > 0;
              }).sort((a, b) => {
                 if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                 if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                 return 0;
              }).map((row) => {
                const totalTahunIni = row.data.reduce((a, b) => a + b, 0);
                const totalSemuanya = isPokok ? row.totalPokok : totalTahunIni + row.tahunLalu;
                
                return (
                  <tr key={row.ref || row.id} className={`transition-colors group ${theme.tableRowHover}`}>
                    {resolvedParams.jenis === 'pendidikan' || resolvedParams.jenis === 'hari-raya' ? (
                      <>
                        <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 sticky left-0 z-40 bg-white ${theme.tableRowHover}`}>
                          <span className="font-bold text-gray-600 text-[11px]">{row.ref}</span>
                        </td>
                        <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 sticky left-[110px] sm:left-[120px] z-30 bg-white ${theme.tableRowHover}`}>
                          <span className="font-bold text-gray-800 text-xs">{row.nama}</span>
                        </td>
                        <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 sticky left-[230px] sm:left-[270px] z-20 bg-white shadow-[1px_0_5px_-2px_rgba(0,0,0,0.1)] ${theme.tableRowHover}`}>
                          <div className="text-[10px] text-gray-500 flex flex-col gap-0.5">
                            {resolvedParams.jenis === 'pendidikan' ? (
                              <>
                                <span>T: Rp {formatCurrency(row.target)} | {row.lamaBulan}bln</span>
                                <span className="text-blue-600 font-medium">Rp {formatCurrency(row.cicilan)}/bln</span>
                              </>
                            ) : (
                              <span className="text-blue-600 font-medium">Rp {formatCurrency(row.cicilan)}/bln</span>
                            )}
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 sticky left-0 z-40 bg-white ${theme.tableRowHover}`}>
                          <span className="font-bold text-gray-600 text-[11px]">{row.id}</span>
                        </td>
                        <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 sticky left-[60px] sm:left-[80px] z-30 bg-white ${theme.tableRowHover}`}>
                          <span className="font-bold text-gray-800 text-xs">{row.nama}</span>
                        </td>
                        <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 sticky left-[150px] sm:left-[220px] z-20 bg-white shadow-[1px_0_5px_-2px_rgba(0,0,0,0.1)] ${theme.tableRowHover}`}>
                          <span className="text-[11px] text-gray-500">{row.dept}</span>
                        </td>
                      </>
                    )}
                    
                    {!isPokok && row.data.map((val: any, idx: number) => (
                      <td key={idx} className={`px-0.5 py-2 text-right font-mono text-xs whitespace-nowrap ${val === 0 ? 'text-gray-300' : 'text-gray-600'}`}>
                        {formatCurrency(val)}
                      </td>
                    ))}

                    {!isPokok && (
                      <td className="px-0.5 py-2 text-right font-mono text-xs whitespace-nowrap text-gray-700 bg-gray-50/50 border-l border-gray-100">
                        {formatCurrency(totalTahunIni)}
                      </td>
                    )}
                    {!isPokok && (
                      <td className="px-0.5 py-2 text-right font-mono text-xs whitespace-nowrap text-gray-700 bg-gray-50/50">
                        {formatCurrency(row.tahunLalu)}
                      </td>
                    )}

                    <td className={`px-0.5 py-2 text-right font-mono font-bold text-xs whitespace-nowrap border-l sticky right-0 z-10 shadow-[-1px_0_5px_-2px_rgba(0,0,0,0.1)] ${theme.totalColBg}`}>
                      {formatCurrency(totalSemuanya)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Table Footer / Summary */}
            <tfoot className="bg-gray-50 border-t-2 border-gray-200">
              <tr>
                <td colSpan={3} className="px-2 py-3 font-bold text-right border-r border-gray-200 sticky left-0 z-20 bg-gray-100 shadow-[1px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  Total Keseluruhan
                </td>
                
                {!isPokok && months.map((_, idx) => {
                  const colTotal = dummyData.reduce((acc, row) => acc + row.data[idx], 0);
                  return (
                    <td key={idx} className="px-0.5 py-2 font-mono font-bold text-gray-800 text-xs whitespace-nowrap text-right">
                      {formatCurrency(colTotal)}
                    </td>
                  );
                })}

                {!isPokok && (
                  <td className="px-0.5 py-2 font-mono font-bold text-gray-800 text-xs whitespace-nowrap text-right bg-gray-200/50 border-l border-gray-300">
                    {formatCurrency(dummyData.reduce((acc, row) => acc + row.data.reduce((a,b) => a+b, 0), 0))}
                  </td>
                )}
                {!isPokok && (
                  <td className="px-0.5 py-2 font-mono font-bold text-gray-800 text-xs whitespace-nowrap text-right bg-gray-200/50">
                    {formatCurrency(dummyData.reduce((acc, row) => acc + row.tahunLalu, 0))}
                  </td>
                )}

                <td className={`px-0.5 py-2 font-mono font-black text-xs whitespace-nowrap text-right border-l sticky right-0 z-10 shadow-[-1px_0_5px_-2px_rgba(0,0,0,0.1)] ${theme.footerTotalColBg}`}>
                  {formatCurrency(dummyData.reduce((acc, row) => {
                    const totalTahunIni = row.data.reduce((a,b) => a+b, 0);
                    const totalSemuanya = isPokok ? row.totalPokok : totalTahunIni + row.tahunLalu;
                    return acc + totalSemuanya;
                  }, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal Tambah Simpanan */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Tambah Simpanan {jenisTitle} Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl mb-4 border border-blue-100">
                Pendaftaran rekening simpanan baru untuk anggota. Pembayaran perdana dan rutin dilakukan melalui menu Transaksi.
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">No. Referensi</label>
                <input 
                  type="text" 
                  value={autoRef}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 font-medium cursor-not-allowed"
                />
              </div>

              <div className="relative space-y-1.5" ref={dropdownRef}>
                <label className="text-sm font-medium text-gray-700">Cari Anggota</label>
                <div 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 flex justify-between items-center cursor-text bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                  onClick={() => setIsMemberDropdownOpen(true)}
                >
                  {selectedMember && !isMemberDropdownOpen ? (
                    <div className="flex gap-2 items-center flex-1">
                      <span className="font-medium text-gray-800 text-sm">{selectedMember.nama}</span>
                      <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">{selectedMember.id}</span>
                    </div>
                  ) : (
                    <input 
                      ref={memberInputRef}
                      type="text" 
                      placeholder="Ketik nama atau ID anggota..."
                      value={memberSearch}
                      onChange={(e) => {
                        setMemberSearch(e.target.value);
                        setIsMemberDropdownOpen(true);
                      }}
                      onKeyDown={handleMemberKeyDown}
                      className="w-full bg-transparent focus:outline-none text-gray-800 text-sm"
                      autoFocus={isMemberDropdownOpen}
                    />
                  )}
                  {selectedMember && !isMemberDropdownOpen ? (
                     <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" onClick={(e) => { e.stopPropagation(); setSelectedMember(null); setMemberSearch(""); }} />
                  ) : (
                     <Search className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {isMemberDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredMembersForModal.length > 0 ? (
                      filteredMembersForModal.map((m, index) => (
                        <div 
                          key={m.id}
                          className={`px-4 py-2.5 cursor-pointer flex items-center gap-2 border-b border-gray-50 last:border-0 ${highlightedIndex === index ? 'bg-blue-50' : 'hover:bg-blue-50'}`}
                          onClick={() => {
                            setSelectedMember(m);
                            setIsMemberDropdownOpen(false);
                            setMemberSearch("");
                            setHighlightedIndex(-1);
                          }}
                          onMouseEnter={() => setHighlightedIndex(index)}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {m.nama.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{m.nama}</div>
                            <div className="text-xs text-gray-500">{m.id} • {m.dept}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">Anggota tidak ditemukan</div>
                    )}
                  </div>
                )}
              </div>
              
              {resolvedParams.jenis === 'pendidikan' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Target Saldo</label>
                    <select 
                      value={targetSaldo}
                      onChange={(e) => setTargetSaldo(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      {pendidikanTargets.map(t => (
                        <option key={t} value={t}>Rp {new Intl.NumberFormat('id-ID').format(t)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Lama Simpanan</label>
                    <select 
                      value={lamaBulan}
                      onChange={(e) => setLamaBulan(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="12">1 Tahun (12 bln)</option>
                      <option value="24">2 Tahun (24 bln)</option>
                      <option value="36">3 Tahun (36 bln)</option>
                      <option value="48">4 Tahun (48 bln)</option>
                      <option value="60">5 Tahun (60 bln)</option>
                      <option value="72">6 Tahun (72 bln)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Nominal 1 Paket</label>
                    <select 
                      value={nominalPaket}
                      onChange={(e) => setNominalPaket(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      {paketHariRaya.map(p => (
                        <option key={p} value={p}>Rp {new Intl.NumberFormat('id-ID').format(p)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Jumlah Paket</label>
                    <input 
                      type="number" 
                      min="1"
                      value={jumlahPaket}
                      onChange={(e) => setJumlahPaket(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className={`${resolvedParams.jenis === 'hari-raya' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'} p-4 rounded-xl border flex items-center justify-between mt-2`}>
                <div>
                  <div className={`text-xs ${resolvedParams.jenis === 'hari-raya' ? 'text-rose-700' : 'text-amber-700'} mb-1`}>Besar Simpanan Perbulan</div>
                  <div className={`text-xl font-black ${resolvedParams.jenis === 'hari-raya' ? 'text-rose-600' : 'text-amber-600'}`}>
                    Rp {new Intl.NumberFormat('id-ID').format(resolvedParams.jenis === 'pendidikan' ? calculateInstallment(parseInt(targetSaldo), parseInt(lamaBulan)) : parseInt(nominalPaket) * jumlahPaket)}
                  </div>
                </div>
                {resolvedParams.jenis === 'pendidikan' ? (
                  <GraduationCap className="w-8 h-8 text-amber-300 opacity-50" />
                ) : (
                  <PartyPopper className="w-8 h-8 text-rose-300 opacity-50" />
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  if (selectedMember) {
                    if (resolvedParams.jenis === 'pendidikan') {
                      setPendidikanMembers(prev => [...prev, {
                        id: selectedMember.id,
                        ref: autoRef,
                        target: parseInt(targetSaldo),
                        lamaBulan: parseInt(lamaBulan),
                        cicilan: calculateInstallment(parseInt(targetSaldo), parseInt(lamaBulan))
                      }]);
                    } else if (resolvedParams.jenis === 'hari-raya') {
                      setHariRayaMembers(prev => [...prev, {
                        id: selectedMember.id,
                        ref: autoRef,
                        nominalPaket: parseInt(nominalPaket),
                        jumlahPaket: jumlahPaket,
                        cicilan: parseInt(nominalPaket) * jumlahPaket
                      }]);
                    }
                  }
                  setIsAddModalOpen(false);
                }}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
              >
                Daftarkan Simpanan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
