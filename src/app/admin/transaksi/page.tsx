"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Download,
  Upload,
  ArrowUpDown,
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  ArrowRightLeft,
  Building2,
  MoreHorizontal
} from "lucide-react";

import { useAnggota } from "@/context/AnggotaContext";

// Helper untuk format tanggal hari ini DD/MM/YYYY
const getTodayStr = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Helper untuk filter tanggal YYYY-MM-DD
const getFirstDayOfMonth = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}-01`;
};

const getLastDayOfMonth = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(yyyy, today.getMonth() + 1, 0).getDate();
  return `${yyyy}-${mm}-${String(lastDay).padStart(2, '0')}`;
};

export default function TransaksiSPPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMutasiModalOpen, setIsMutasiModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  
  const { members: MEMBERS, pendidikanMembers, hariRayaMembers, transactions, setTransactions, bungaPinjaman } = useAnggota();
  
  // Custom Select State untuk Pencarian Anggota
  const [memberSearch, setMemberSearch] = useState("");
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  // Form States Transaksi
  const [dateStr, setDateStr] = useState(getTodayStr()); // Default Hari Ini
  const [nominals, setNominals] = useState<Record<string, string>>({});
  const [selectedLoanId, setSelectedLoanId] = useState(""); // Pinjaman yang dipilih untuk Angsuran & Jasa
  const [selectedPendidikanId, setSelectedPendidikanId] = useState(""); // Rekening Pendidikan yang dipilih
  const [pinjamanTenor, setPinjamanTenor] = useState("");
  const [pinjamanCaraBayar, setPinjamanCaraBayar] = useState("Gaji/TPP");

  // Form States Mutasi
  const [mutasiDateStr, setMutasiDateStr] = useState(getTodayStr());
  const [mutasiNominal, setMutasiNominal] = useState("");

  // Filter States
  const [filterStartDate, setFilterStartDate] = useState(getFirstDayOfMonth());
  const [filterEndDate, setFilterEndDate] = useState(getLastDayOfMonth());

  // Form States Bank
  const [bankDateStr, setBankDateStr] = useState(getTodayStr());
  const [bankCategory, setBankCategory] = useState("admin_bank");
  const [bankType, setBankType] = useState("pengeluaran");
  const [bankNominal, setBankNominal] = useState("");

  const handleBankCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBankCategory(val);
    if (val === "admin_bank") setBankType("pengeluaran");
    if (val === "jasa_bank") setBankType("pemasukan");
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const memberInputRef = useRef<HTMLInputElement>(null);

  // Klik di luar dropdown anggota untuk menutupnya
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

  // Reset selected loan & pendidikan if member changes
  useEffect(() => {
    setSelectedLoanId("");
    setSelectedPendidikanId("");
    setNominals(prev => {
      const newNominals = { ...prev };
      delete newNominals["Simpanan Pendidikan"];
      delete newNominals["Angsuran Pinjaman"];
      delete newNominals["Jasa / Bunga"];
      return newNominals;
    });
  }, [selectedMember]);

  // Filter list anggota berdasarkan input
  const filteredMembers = MEMBERS.filter(m => 
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
    m.id.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // Fungsi Keyboard Navigasi untuk Dropdown Anggota
  const handleMemberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isMemberDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsMemberDropdownOpen(true);
      }
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

  // Reset highlight index when search changes
  useEffect(() => {
    setHighlightedIndex(filteredMembers.length > 0 ? 0 : -1);
  }, [memberSearch]);

  // Fungsi Helper untuk format tanggal secara otomatis menjadi DD/MM/YYYY
  const processDateInput = (val: string, currentStr: string) => {
    const inputVal = val.replace(/[^0-9/]/g, ""); // Hanya izinkan angka dan slash
    const isDeleting = inputVal.length < currentStr.length;
    
    let parts = inputVal.split('/');
    
    if (parts[0]) {
      if (parseInt(parts[0], 10) > 31) parts[0] = "31";
      if (parts[0] === "00") parts[0] = "01";
      if (parts[0].length > 2) {
         parts[1] = parts[0].slice(2) + (parts[1] || "");
         parts[0] = parts[0].slice(0, 2);
      }
    }
    if (parts[1]) {
      if (parseInt(parts[1], 10) > 12) parts[1] = "12";
      if (parts[1] === "00") parts[1] = "01";
      if (parts[1].length > 2) {
         parts[2] = parts[1].slice(2) + (parts[2] || "");
         parts[1] = parts[1].slice(0, 2);
      }
    }
    if (parts[2]) {
      parts[2] = parts[2].slice(0, 4);
    }

    let finalVal = parts.join('/');
    if (!isDeleting) {
      if (parts.length === 1 && parts[0].length === 2) finalVal += '/';
      else if (parts.length === 2 && parts[1].length === 2) finalVal += '/';
    }
    return finalVal;
  };

  const processDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentStr: string, setFn: (val: string) => void) => {
    const separators = ['/', '-', ' '];
    if (separators.includes(e.key)) {
      e.preventDefault();
      let parts = currentStr.split('/');
      if (parts.length === 1 && parts[0].length > 0 && parts[0].length <= 2) {
        let day = parts[0].padStart(2, '0');
        setFn(day + '/');
      } else if (parts.length === 2 && parts[1].length > 0 && parts[1].length <= 2) {
        let month = parts[1].padStart(2, '0');
        setFn(parts[0] + '/' + month + '/');
      }
    }
  };

  const handleDateFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };
  const handleDateClick = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).select();
  };

  const formatRibuan = (value: string) => {
    let rawValue = value.replace(/\D/g, "");
    return rawValue ? rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
  };

  // Fungsi untuk memformat input angka menjadi ribuan dengan titik
  const handleNominalChange = (key: string, value: string) => {
    const isNegative = value.startsWith("-");
    let rawValue = value.replace(/\D/g, "");
    if (rawValue) {
      let formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setNominals(prev => ({ ...prev, [key]: (isNegative ? "-" : "") + formattedValue }));
    } else {
      setNominals(prev => ({ ...prev, [key]: isNegative ? "-" : "" }));
    }
  };

  // Auto-fill Simpanan Pendidikan / Hari Raya
  useEffect(() => {
    if (selectedPendidikanId && selectedMember) {
      const pdk = pendidikanMembers.find((p: any) => p.ref === selectedPendidikanId);
      if (pdk) {
        handleNominalChange("Simpanan Pendidikan", pdk.cicilan.toString());
      }
    }
  }, [selectedPendidikanId, selectedMember]);
  
  const [selectedHariRayaId, setSelectedHariRayaId] = useState("");
  useEffect(() => {
    if (selectedHariRayaId && selectedMember) {
      const p = hariRayaMembers.find((p: any) => p.ref === selectedHariRayaId);
      if (p) {
        handleNominalChange("Simpanan Hari Raya", p.cicilan.toString());
      }
    }
  }, [selectedHariRayaId, selectedMember]);

  // Dinamis berdasarkan kepemilikan anggota
  const activeLoans: any[] = [];
  if (selectedMember && transactions) {
    const memberLoans = transactions.filter(t => t.memberId === selectedMember.id && t.description === "Pinjaman (Pencairan)");
    memberLoans.forEach(loan => {
      const angsuran = transactions.filter(t => t.description === "Angsuran Pinjaman" && t.id.includes(loan.id));
      const totalBayar = angsuran.reduce((sum, a) => sum + Math.max(a.debit, a.kredit), 0);
      const plafon = Math.max(loan.debit, loan.kredit);
      if (plafon - totalBayar > 0) {
        activeLoans.push({
          id: loan.id,
          type: `Pinjaman Cair ${loan.date}`,
          plafon,
          installment: Math.round(plafon / (loan.tenor || 1)),
          interest: Math.round(plafon * (bungaPinjaman / 100))
        });
      }
    });
  }

  // Auto-fill Angsuran dan Jasa
  useEffect(() => {
    if (selectedLoanId && selectedMember) {
      const loan = activeLoans.find((l: any) => l.id === selectedLoanId);
      if (loan) {
        handleNominalChange("Angsuran Pinjaman", loan.installment.toString());
        handleNominalChange("Jasa / Bunga", loan.interest.toString());
      }
    }
  }, [selectedLoanId, selectedMember]);

  // Kalkulasi Metrics
  let totalDebitBulanIni = 0;
  let totalKreditBulanIni = 0;
  let saldoAkhir = 0;
  
  const currentMonthStr = getTodayStr().substring(3); // extracts mm/yyyy

  transactions.forEach(t => {
    saldoAkhir += t.debit - t.kredit;
    if (t.date.endsWith(currentMonthStr)) {
      totalDebitBulanIni += t.debit;
      totalKreditBulanIni += t.kredit;
    }
  });

  // Jika modal transaksi diklik
  const closeTransaksiModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    setMemberSearch("");
    setNominals({});
    setDateStr(getTodayStr());
    setSelectedLoanId("");
    setSelectedPendidikanId("");
  };

  // Jika modal mutasi ditutup
  const closeMutasiModal = () => {
    setIsMutasiModalOpen(false);
    setMutasiDateStr(getTodayStr());
    setMutasiNominal("");
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleEditTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    const isDebit = tx.debit > 0;
    const currentVal = isDebit ? tx.debit : tx.kredit;
    const newValStr = prompt(`Masukkan nominal baru untuk ${tx.description} (${tx.id}):`, currentVal.toString());
    if (newValStr !== null) {
      const isNegative = newValStr.startsWith("-");
      const nominalNum = parseInt(newValStr.replace(/\D/g, "")) || 0;
      
      let debit = 0;
      let kredit = 0;
      
      if (tx.description === "Pinjaman (Pencairan)") {
        if (isNegative) debit = nominalNum;
        else kredit = nominalNum;
      } else {
        if (isNegative) kredit = nominalNum;
        else debit = nominalNum;
      }

      setTransactions(prev => prev.map(t => {
        if (t.id === id) {
          return { ...t, debit, kredit };
        }
        return t;
      }));
    }
  };

  // Jika modal bank ditutup
  const closeBankModal = () => {
    setIsBankModalOpen(false);
    setBankDateStr(getTodayStr());
    setBankCategory("admin_bank");
    setBankType("pengeluaran");
    setBankNominal("");
  };

  const handleBankSubmit = () => {
    const nominal = parseInt(bankNominal.replace(/\D/g, "")) || 0;
    if (nominal <= 0) return alert("Nominal bank tidak valid");
    
    const ddmmyy = bankDateStr.split("/").map(s => s.padStart(2, "0")).join("").substring(0, 6);
    const index = (transactions.length + 1).toString().padStart(2, "0");
    const newTx = {
      id: `BNK-${ddmmyy}-${index}`,
      date: bankDateStr,
      memberId: "-",
      member: "Kas Umum",
      description: bankCategory === "admin_bank" ? "Beban Admin Bank" : "Jasa Bank",
      debit: bankType === "pemasukan" ? nominal : 0,
      kredit: bankType === "pengeluaran" ? nominal : 0,
      isBank: true
    };
    
    setTransactions(prev => [...prev, newTx]);
    closeBankModal();
  };

  const handleMutasiSubmit = () => {
    const nominal = parseInt(mutasiNominal.replace(/\D/g, "")) || 0;
    if (nominal <= 0) return alert("Nominal mutasi tidak valid");
    
    const ddmmyy = mutasiDateStr.split("/").map(s => s.padStart(2, "0")).join("").substring(0, 6);
    const index = (transactions.length + 1).toString().padStart(2, "0");
    const newTx = {
      id: `MTS-${ddmmyy}-${index}`,
      date: mutasiDateStr,
      memberId: "-",
      member: "Kas Umum",
      description: "Mutasi Kas Keluar",
      debit: 0,
      kredit: nominal,
      isMutasi: true
    };
    
    setTransactions(prev => [...prev, newTx]);
    closeMutasiModal();
  };

  // Dinamis berdasarkan kepemilikan anggota

  const hasActiveLoans = activeLoans.length > 0;
  
  const hasPendidikan = selectedMember && pendidikanMembers.some((p: any) => p.id === selectedMember.id);
  
  const transactionLabels = [
    "Simpanan Pokok", 
    "Simpanan Wajib", 
    "Simpanan Manasuka"
  ];
  
  if (hasPendidikan) {
    transactionLabels.push("Simpanan Pendidikan");
  }
  
  transactionLabels.push("Pinjaman (Pencairan)");
  
  if (hasActiveLoans) {
    transactionLabels.push("Angsuran Pinjaman", "Jasa / Bunga");
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transaksi SP (Buku Kas)</h2>
          <p className="text-gray-500 text-sm mt-1">Catatan arus kas harian untuk aktivitas Simpan Pinjam.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm"
          >
            <Upload className="w-4 h-4" />
            Import Data
          </button>
          <button 
            onClick={() => setIsDownloadModalOpen(true)}
            className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Download KAS
          </button>
          <button 
            onClick={() => setIsMutasiModalOpen(true)}
            className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20 font-medium text-sm"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Mutasi
          </button>
          <button 
            onClick={() => setIsBankModalOpen(true)}
            className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20 font-medium text-sm"
          >
            <Building2 className="w-4 h-4" />
            Bank
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 font-medium text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Transaksi
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard 
          title="Total Pemasukan (Debit)" 
          value={`Rp ${new Intl.NumberFormat("id-ID").format(totalDebitBulanIni)}`}
          sub="Bulan ini" 
          icon={ArrowDownLeft} 
          color="emerald" 
        />
        <MetricCard 
          title="Total Pengeluaran (Kredit)" 
          value={`Rp ${new Intl.NumberFormat("id-ID").format(totalKreditBulanIni)}`}
          sub="Bulan ini" 
          icon={ArrowUpRight} 
          color="amber" 
        />
        <MetricCard 
          title="Saldo Akhir Kas SP" 
          value={`Rp ${new Intl.NumberFormat("id-ID").format(saldoAkhir)}`}
          sub="Per Hari Ini" 
          icon={BookOpen} 
          color="blue" 
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder="Cari referensi atau keterangan..."
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input 
            type="date" 
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="block px-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
          />
          <span className="text-gray-400 text-sm">s/d</span>
          <input 
            type="date" 
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="block px-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
          />
        </div>
      </div>

      {/* Data Table Buku Kas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-medium">
                  Tanggal
                </th>
                <th className="px-6 py-4 font-medium">No. Ref</th>
                <th className="px-6 py-4 font-medium">Keterangan</th>
                <th className="px-6 py-4 font-medium text-right">
                  Pemasukan (Debit)
                </th>
                <th className="px-6 py-4 font-medium text-right">
                  Pengeluaran (Kredit)
                </th>
                <th className="px-6 py-4 font-medium text-right">Saldo</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(() => {
                let currentSaldo = 0;
                return transactions.map((t) => {
                  currentSaldo += t.debit - t.kredit;
                  return { ...t, saldo: currentSaldo };
                }).map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {t.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>
                        <span className="font-semibold text-gray-800">{t.description}</span>
                        <div className="text-xs text-gray-400 mt-0.5">{t.member}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                      {t.debit > 0 ? `Rp ${new Intl.NumberFormat("id-ID").format(t.debit)}` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 text-right">
                      {t.kredit > 0 ? `Rp ${new Intl.NumberFormat("id-ID").format(t.kredit)}` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 text-right">
                      Rp {new Intl.NumberFormat("id-ID").format(t.saldo)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEditTransaction(t.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Nominal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTransaction(t.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ));
              })()}
              <tr className="bg-blue-50/50">
                <td colSpan={3} className="px-6 py-3 font-bold text-gray-800 text-right">
                  Saldo Bawaan (Halaman Sebelumnya)
                </td>
                <td colSpan={2} className="px-6 py-3 text-right"></td>
                <td className="px-6 py-3 font-bold text-gray-800 text-right">Rp 0</td>
                <td className="px-6 py-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      {/* Modal Mutasi */}
      {isMutasiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div 
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeMutasiModal}
          ></div>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                Mutasi Kas
              </h3>
              <button onClick={closeMutasiModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input 
                    type="text" 
                    placeholder="DD/MM/YYYY" 
                    maxLength={10}
                    value={mutasiDateStr}
                    onChange={(e) => setMutasiDateStr(processDateInput(e.target.value, mutasiDateStr))}
                    onKeyDown={(e) => processDateKeyDown(e, mutasiDateStr, setMutasiDateStr)}
                    onFocus={handleDateFocus}
                    onClick={handleDateClick}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Referensi</label>
                  <input type="text" placeholder="Otomatis" disabled className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed" />
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dari Kas</label>
                  <select className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-sm">
                    <option value="kas_sp">Kas Simpan Pinjam</option>
                    <option value="kas_toko">Kas Toko</option>
                    <option value="kas_umum">Kas Umum</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>
                <div className="pt-6">
                  <ArrowRightLeft className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ke Kas</label>
                  <select className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-sm">
                    <option value="kas_toko">Kas Toko</option>
                    <option value="kas_sp">Kas Simpan Pinjam</option>
                    <option value="kas_umum">Kas Umum</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nominal Mutasi (Rp)</label>
                <input 
                  type="text" 
                  placeholder="0"
                  value={mutasiNominal}
                  onChange={(e) => setMutasiNominal(formatRibuan(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-medium text-gray-800 text-right" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Mutasi</label>
                <textarea rows={2} placeholder="Misal: Pindahan kelebihan dana SP ke Toko" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none text-sm"></textarea>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={closeMutasiModal}
                className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={closeMutasiModal}
                className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20"
              >
                Simpan Mutasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Transaksi Bank */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={closeBankModal}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Transaksi Bank
              </h3>
              <button onClick={closeBankModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input 
                    type="text" 
                    placeholder="DD/MM/YYYY" 
                    maxLength={10}
                    value={bankDateStr}
                    onChange={(e) => setBankDateStr(processDateInput(e.target.value, bankDateStr))}
                    onKeyDown={(e) => processDateKeyDown(e, bankDateStr, setBankDateStr)}
                    onFocus={handleDateFocus}
                    onClick={handleDateClick}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Referensi</label>
                  <input type="text" placeholder="Otomatis" disabled className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Bank</label>
                  <select 
                    value={bankCategory}
                    onChange={handleBankCategoryChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-sm"
                  >
                    <option value="admin_bank">Admin Bank</option>
                    <option value="jasa_bank">Jasa Bank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arus Kas</label>
                  <select 
                    value={bankType}
                    onChange={(e) => setBankType(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-sm"
                  >
                    <option value="pengeluaran">Pengeluaran (Kredit)</option>
                    <option value="pemasukan">Pemasukan (Debit)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
                <input 
                  type="text" 
                  placeholder="0"
                  value={bankNominal}
                  onChange={(e) => setBankNominal(formatRibuan(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-medium text-gray-800 text-right" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea rows={2} placeholder="Misal: Biaya bulanan admin bank" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none text-sm"></textarea>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={closeBankModal}
                className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleBankSubmit}
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20 font-bold"
              >
                Simpan Transaksi Bank
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Transaksi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeTransaksiModal}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-bold text-gray-800 text-lg">Catat Transaksi Baru</h3>
              <button 
                onClick={closeTransaksiModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div className="p-6 space-y-5 overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input 
                    type="text" 
                    placeholder="DD/MM/YYYY" 
                    maxLength={10}
                    value={dateStr}
                    onChange={(e) => setDateStr(processDateInput(e.target.value, dateStr))}
                    onKeyDown={(e) => processDateKeyDown(e, dateStr, setDateStr)}
                    onFocus={handleDateFocus}
                    onClick={handleDateClick}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Referensi</label>
                  <input type="text" placeholder="Otomatis" disabled className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed" />
                </div>
              </div>
              
              {/* Fitur Pencarian Anggota Custom */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cari Anggota</label>
                <div 
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 flex justify-between items-center cursor-text bg-white transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                  onClick={() => setIsMemberDropdownOpen(true)}
                >
                  {selectedMember && !isMemberDropdownOpen ? (
                    <div className="flex gap-2 items-center flex-1">
                      <span className="font-medium text-gray-800 text-sm">{selectedMember.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{selectedMember.id}</span>
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
                      className="w-full focus:outline-none text-gray-800 text-sm"
                      autoFocus={isMemberDropdownOpen}
                    />
                  )}
                  {selectedMember && !isMemberDropdownOpen ? (
                     <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" onClick={(e) => { e.stopPropagation(); setSelectedMember(null); setMemberSearch(""); }} />
                  ) : (
                     <Search className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {/* Dropdown Options */}
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
                        >
                          <span className="font-medium text-gray-800 text-sm">{m.name}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{m.id}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">Anggota tidak ditemukan.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Daftar Rincian Transaksi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rincian Transaksi</label>
                <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  
                  {transactionLabels.map((label, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5 border-b border-gray-100/60 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-gray-700 w-1/2">{label}</span>
                        <div className="relative w-1/2">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                          <input 
                            type="text" 
                            placeholder="0" 
                            value={nominals[label] || ""}
                            onChange={(e) => handleNominalChange(label, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium text-gray-800" 
                          />
                        </div>
                      </div>

                      {/* Input Tambahan untuk Pinjaman */}
                      {label === "Pinjaman (Pencairan)" && nominals[label] && nominals[label] !== "0" && nominals[label] !== "-" && (
                        <div className="flex justify-end mt-1 gap-2 w-full">
                          <div className="w-[24%]">
                            <input
                              type="number"
                              placeholder="Tenor (Bln)"
                              value={pinjamanTenor}
                              onChange={(e) => setPinjamanTenor(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                          </div>
                          <div className="w-[24%]">
                            <select
                              value={pinjamanCaraBayar}
                              onChange={(e) => setPinjamanCaraBayar(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                              <option value="Gaji">Gaji</option>
                              <option value="TPP">TPP</option>
                              <option value="Lainnya">Lainnya</option>
                            </select>
                          </div>
                        </div>
                      )}
                      
                      {/* Pilihan Khusus Untuk Angsuran Pinjaman */}
                      {label === "Angsuran Pinjaman" && hasActiveLoans && (
                        <div className="flex justify-end mt-0.5">
                          <div className="w-1/2 flex flex-col">
                            <select 
                              value={selectedLoanId}
                              onChange={(e) => setSelectedLoanId(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                              <option value="">-- Pilih Pinjaman --</option>
                              {activeLoans.map((loan: any) => (
                                <option key={loan.id} value={loan.id}>
                                  {loan.id} - {formatRibuan(loan.plafon.toString())}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Pilihan Khusus Untuk Simpanan Pendidikan */}
                      {label === "Simpanan Pendidikan" && hasPendidikan && (
                        <div className="flex justify-end mt-0.5">
                          <div className="w-1/2 flex flex-col">
                            <select 
                              value={selectedPendidikanId}
                              onChange={(e) => setSelectedPendidikanId(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                              <option value="">-- Pilih Rek. Pendidikan --</option>
                              {pendidikanMembers.filter((p: any) => p.id === selectedMember.id).map((p: any) => (
                                <option key={p.ref} value={p.ref}>
                                  {p.ref} - Rp {new Intl.NumberFormat("id-ID").format(p.cicilan)}/bln
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Pilihan Khusus Untuk Simpanan Hari Raya */}
                      {label === "Simpanan Hari Raya" && hasHariRaya && (
                        <div className="flex justify-end mt-0.5">
                          <div className="w-1/2 flex flex-col">
                            <select 
                              value={selectedHariRayaId}
                              onChange={(e) => setSelectedHariRayaId(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                              <option value="">-- Pilih Rek. Hari Raya --</option>
                              {hariRayaMembers.filter((p: any) => p.id === selectedMember.id).map((p: any) => (
                                <option key={p.ref} value={p.ref}>
                                  {p.ref} - Rp {new Intl.NumberFormat("id-ID").format(p.cicilan)}/bln
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Penanda Relasi Jasa ke Pinjaman */}
                      {label === "Jasa / Bunga" && hasActiveLoans && selectedLoanId && (
                        <div className="flex justify-end mt-0.5">
                          <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded w-1/2 text-right overflow-hidden text-ellipsis whitespace-nowrap">
                            Untuk Pinjaman: {selectedLoanId}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                </div>
              </div>

              <div className="hidden">
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Umum</label>
                <textarea rows={2} placeholder="Keterangan tambahan jika diperlukan..." className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-sm"></textarea>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={closeTransaksiModal}
                className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  const newTxs: any[] = [];
                  const ddmmyy = dateStr.split('/').join('');
                  
                  let pkCount = transactions.filter(t => t.id.startsWith(`PK-${ddmmyy}`)).length + 1;
                  let wjbCount = transactions.filter(t => t.id.startsWith(`WJB-${ddmmyy}`)).length + 1;
                  let mnkCount = transactions.filter(t => t.id.startsWith(`MNK-${ddmmyy}`)).length + 1;
                  let pnjCount = transactions.filter(t => t.id.startsWith(`PNJ-${ddmmyy}`)).length + 1;

                  Object.keys(nominals).forEach(key => {
                    const val = nominals[key];
                    if (val && val !== "0" && val !== "-" && val !== "") {
                      const isNegative = val.startsWith("-");
                      const nominalNum = parseInt(val.replace(/\D/g, ""));
                      const isPinjaman = key === "Pinjaman (Pencairan)";
                      
                      let debit = 0;
                      let kredit = 0;
                      
                      if (isPinjaman) {
                        if (isNegative) debit = nominalNum;
                        else kredit = nominalNum;
                      } else {
                        if (isNegative) kredit = nominalNum;
                        else debit = nominalNum;
                      }

                      let refId = `TRX-${Math.floor(Math.random() * 1000000)}`;
                      if (key === "Simpanan Pokok") {
                        refId = `PK-${ddmmyy}-${pkCount.toString().padStart(2, '0')}`;
                        pkCount++;
                      } else if (key === "Simpanan Wajib") {
                        refId = `WJB-${ddmmyy}-${wjbCount.toString().padStart(2, '0')}`;
                        wjbCount++;
                      } else if (key === "Simpanan Manasuka") {
                        refId = `MNK-${ddmmyy}-${mnkCount.toString().padStart(2, '0')}`;
                        mnkCount++;
                      } else if (key === "Simpanan Pendidikan") {
                        const count = transactions.filter(t => t.id.startsWith(`${selectedPendidikanId}-`)).length + 1;
                        refId = `${selectedPendidikanId}-${count.toString().padStart(2, '0')}`;
                      } else if (key === "Pinjaman (Pencairan)") {
                        refId = `PNJ-${ddmmyy}-${pnjCount.toString().padStart(2, '0')}`;
                        pnjCount++;
                      } else if (key === "Angsuran Pinjaman") {
                        const count = transactions.filter(t => t.id.startsWith(`AN-${selectedLoanId}-`)).length + 1;
                        refId = `AN-${selectedLoanId}-${count.toString().padStart(2, '0')}`;
                      } else if (key === "Jasa / Bunga") {
                        const count = transactions.filter(t => t.id.startsWith(`JS-${selectedLoanId}-`)).length + 1;
                        refId = `JS-${selectedLoanId}-${count.toString().padStart(2, '0')}`;
                      }

                      const txObj: any = {
                        id: refId,
                        date: dateStr,
                        member: selectedMember ? `${selectedMember.id} - ${selectedMember.name}` : "Umum",
                        memberId: selectedMember ? selectedMember.id : null,
                        description: key,
                        debit,
                        kredit,
                      };
                      
                      if (isPinjaman) {
                         txObj.tenor = parseInt(pinjamanTenor) || 0;
                         txObj.caraPembayaran = pinjamanCaraBayar;
                      }

                      newTxs.push(txObj);
                    }
                  });
                  setTransactions(prev => [...prev, ...newTxs]);
                  closeTransaksiModal();
                }}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
              >
                Simpan Transaksi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Download KAS */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDownloadModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                Download Laporan
              </h3>
              <button onClick={() => setIsDownloadModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Jenis KAS</label>
                <select className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-white outline-none">
                  <option value="kas_sp">Buku Kas Simpan Pinjam</option>
                  <option value="kas_toko">Buku Kas Toko</option>
                  <option value="kas_umum">Buku Kas Umum</option>
                  <option value="all">Semua Kas (Gabungan)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
                  <input type="date" defaultValue={filterStartDate} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sampai</label>
                  <input type="date" defaultValue={filterEndDate} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white outline-none" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsDownloadModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={() => setIsDownloadModalOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-md shadow-green-500/20">Download Excel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Import Excel */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsImportModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Import Data Excel
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-xs leading-relaxed border border-blue-100">
                <strong>Informasi:</strong> Import ini bersifat kumulatif. Data dari Excel hanya akan <strong>menambahkan transaksi baru</strong> dan tidak akan menimpa atau menghapus data transaksi yang sudah ada di sistem.
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unggah File (.xlsx, .xls)</label>
                <input type="file" accept=".xlsx,.xls" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-xl p-2 cursor-pointer bg-gray-50" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">Batal</button>
              <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20">Mulai Import</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function MetricCard({ title, value, sub, icon: Icon, color }: any) {
  const colorStyles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group">
      <div className={`p-4 rounded-xl ${colorStyles[color]} group-hover:scale-105 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-0.5">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
    </div>
  );
}

function KasRow({ date, refNo, desc, debit, kredit, saldo }: any) {
  const isDebit = debit !== "-";
  const isKredit = kredit !== "-";
  
  return (
    <tr className="hover:bg-blue-50/30 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
        {date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
          {refNo}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
        {desc}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${isDebit ? 'text-emerald-600' : 'text-gray-400'}`}>
        {debit}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${isKredit ? 'text-red-600' : 'text-gray-400'}`}>
        {kredit}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-800">
        {saldo}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors tooltip-trigger" title="Edit Transaksi">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors tooltip-trigger" title="Hapus Transaksi">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
