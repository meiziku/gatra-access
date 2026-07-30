"use client";

import { use, useState, useEffect, useRef } from "react";
import { Wallet, Search, Filter, Download, Landmark, PiggyBank, Briefcase, GraduationCap, PartyPopper, Plus, X } from "lucide-react";

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

  const dummyData = [
    { id: "A001", nama: "Budi Santoso", dept: "IT", data: [150000, 150000, 150000, 150000, 150000, 150000, 150000, 150000, 150000, 150000, 150000, 150000], totalPokok: 100000, tahunLalu: 1500000 },
    { id: "A002", nama: "Siti Rahma", dept: "HR", data: [200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000, 200000], totalPokok: 100000, tahunLalu: 2000000 },
    { id: "A003", nama: "Agus Pratama", dept: "Finance", data: [100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000], totalPokok: 100000, tahunLalu: 1000000 },
    { id: "A004", nama: "Dewi Lestari", dept: "Marketing", data: [250000, 250000, 0, 250000, 250000, 250000, 250000, 0, 250000, 250000, 250000, 250000], totalPokok: 100000, tahunLalu: 2500000 },
    { id: "A005", nama: "Eko Prasetyo", dept: "Operations", data: [50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000], totalPokok: 100000, tahunLalu: 500000 },
    { id: "A006", nama: "Nina Safitri", dept: "Legal", data: [300000, 300000, 300000, 300000, 300000, 300000, 300000, 300000, 300000, 300000, 300000, 300000], totalPokok: 100000, tahunLalu: 3000000 },
    { id: "A007", nama: "Rizky Firmansyah", dept: "Sales", data: [0, 0, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000], totalPokok: 100000, tahunLalu: 0 },
  ];

  const formatCurrency = (val: number) => {
    if (val === 0) return "-";
    return new Intl.NumberFormat("id-ID").format(val);
  };

  const [memberSearch, setMemberSearch] = useState("");
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

  const autoRefPrefix = resolvedParams.jenis === 'hari-raya' ? "SP-RAYA-" : "SP-EDU-";
  const [autoRef] = useState(autoRefPrefix + new Date().toISOString().replace(/\D/g, "").slice(0, 8) + "-" + Math.floor(Math.random() * 1000).toString().padStart(3, '0'));

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

  const filteredMembers = dummyData.filter(m => m.nama.toLowerCase().includes(memberSearch.toLowerCase()) || m.id.toLowerCase().includes(memberSearch.toLowerCase()));

  const handleMemberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isMemberDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setIsMemberDropdownOpen(true);
      return;
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < filteredMembers.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredMembers.length) {
        setSelectedMember(filteredMembers[highlightedIndex]);
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
              onClick={() => setIsAddModalOpen(true)}
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
                 if (!showHasBalanceOnly || resolvedParams.jenis !== 'manasuka') return true;
                 const totalTahunIni = row.data.reduce((a, b) => a + b, 0);
                 const totalSemuanya = totalTahunIni + row.tahunLalu;
                 return totalSemuanya > 0;
               }).length}
             </span> anggota
           </div>
        </div>

        {/* The Matrix Table */}
        <div className="overflow-x-auto relative w-full pb-2">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
              <tr>
                <th className="px-2 py-3 font-bold whitespace-nowrap border-r border-gray-200 sticky left-0 z-20 bg-gray-100 shadow-[1px_0_5px_-2px_rgba(0,0,0,0.1)]">Nama Anggota</th>
                
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
              {dummyData.filter(row => {
                 if (!showHasBalanceOnly || resolvedParams.jenis !== 'manasuka') return true;
                 const totalTahunIni = row.data.reduce((a, b) => a + b, 0);
                 const totalSemuanya = isPokok ? row.totalPokok : totalTahunIni + row.tahunLalu;
                 return totalSemuanya > 0;
              }).map((row) => {
                const totalTahunIni = row.data.reduce((a, b) => a + b, 0);
                const totalSemuanya = isPokok ? row.totalPokok : totalTahunIni + row.tahunLalu;
                
                return (
                  <tr key={row.id} className={`transition-colors group ${theme.tableRowHover}`}>
                    <td className={`px-2 py-2 whitespace-nowrap border-r border-gray-200 sticky left-0 z-20 bg-white shadow-[1px_0_5px_-2px_rgba(0,0,0,0.1)] ${theme.tableRowHover}`}>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-xs">{row.nama}</span>
                        <span className="text-[10px] text-gray-500">{row.id} &bull; {row.dept}</span>
                      </div>
                    </td>
                    
                    {!isPokok && row.data.map((val, idx) => (
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
                <td className="px-2 py-3 font-black text-gray-800 sticky left-0 z-20 bg-gray-100 border-r border-gray-300 text-right shadow-[1px_0_5px_-2px_rgba(0,0,0,0.1)] uppercase text-xs">
                  Total
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
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((m, index) => (
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
                onClick={() => setIsAddModalOpen(false)}
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
