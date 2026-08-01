"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Upload,
  PlusCircle,
  Calendar,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  ArrowRightLeft,
  Building2,
  BookOpen
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

export default function TransaksiBankPage() {
  const [isMutasiModalOpen, setIsMutasiModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, txId: string}>({isOpen: false, txId: ""});
  const [editModal, setEditModal] = useState<{isOpen: boolean, tx: any, newVal: string}>({isOpen: false, tx: null, newVal: ""});
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isTransaksiModalOpen, setIsTransaksiModalOpen] = useState(false);

  const PENDAPATAN_COA = [
    "Pendapatan Bunga Pinjaman",
    "Pendapatan Penjualan Produk",
    "Pendapatan Penjualan Jasa",
    "Pendapatan Bunga Bank",
    "Pendapatan Lain-Lain"
  ];
  const PENGELUARAN_COA = [
    "Jasa Simpanan Sukarela",
    "Jasa Bank",
    "Beban Asuransi",
    "Beban Audit",
    "Beban Pajak",
    "Beban Rapat",
    "Beban Perjalanan Dinas",
    "Beban Pelatihan",
    "Beban Honor Pengurus",
    "Beban Organisasi",
    "Beban Gaji Karyawan",
    "Beban Konsumsi",
    "Beban ATK",
    "Beban Listrik, Telepon dan Air",
    "Beban Internet",
    "Beban Ongkos Kirim",
    "Beban Perbaikan dan Pemeliharaan",
    "Beban Operasional",
    "Beban Sewa",
    "Beban Pembelian Aset",
    "Beban Penyusutan Inventaris"
  ];

  // Form States Transaksi Bank
  const [transaksiDateStr, setTransaksiDateStr] = useState(getTodayStr());
  const [transaksiType, setTransaksiType] = useState("pengeluaran"); // pemasukan / pengeluaran
  const [transaksiCategory, setTransaksiCategory] = useState("");
  const [transaksiCategorySearch, setTransaksiCategorySearch] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [highlightedCategoryIndex, setHighlightedCategoryIndex] = useState(-1);
  const [transaksiNominal, setTransaksiNominal] = useState("");

  const ALL_COA = [
    ...PENDAPATAN_COA.map(c => ({ name: c, type: "pemasukan" })),
    ...PENGELUARAN_COA.map(c => ({ name: c, type: "pengeluaran" }))
  ];
  const filteredCOA = ALL_COA.filter(c => c.name.toLowerCase().includes(transaksiCategorySearch.toLowerCase()));

  const { transactions, setTransactions } = useAnggota();
  const [searchQuery, setSearchQuery] = useState("");

  const closeTransaksiModal = () => {
    setIsTransaksiModalOpen(false);
    setTransaksiDateStr(getTodayStr());
    setTransaksiType("pengeluaran");
    setTransaksiCategory("");
    setTransaksiCategorySearch("");
    setIsCategoryDropdownOpen(false);
    setHighlightedCategoryIndex(-1);
    setTransaksiNominal("");
  };

  // Form States Mutasi
  const [mutasiDateStr, setMutasiDateStr] = useState(getTodayStr());
  const [mutasiNominal, setMutasiNominal] = useState("");
  const [mutasiDariKas, setMutasiDariKas] = useState("bank");
  const [mutasiKeKas, setMutasiKeKas] = useState("kas_toko");

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

  const handleDeleteTransaction = (id: string) => {
    setDeleteConfirm({isOpen: true, txId: id});
  };

  const handleEditTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    const isDebit = tx.debit > 0;
    const currentVal = isDebit ? tx.debit : tx.kredit;
    setEditModal({isOpen: true, tx, newVal: currentVal.toString()});
  };

  const saveEditTransaction = () => {
    const { tx, newVal } = editModal;
    const id = tx.id;
    const isDebit = tx.debit > 0;
    const isNegative = newVal.startsWith("-");
    const nominalNum = parseInt(newVal.replace(/\D/g, "")) || 0;
    
    let debit = 0;
    let kredit = 0;
    
    if (isNegative) {
      if (isDebit) kredit = nominalNum;
      else debit = nominalNum;
    } else {
      if (isDebit) debit = nominalNum;
      else kredit = nominalNum;
    }

    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, debit, kredit, nominalMutasi: t.isMutasi ? nominalNum : t.nominalMutasi };
      }
      return t;
    }));
    setEditModal({isOpen: false, tx: null, newVal: ""});
  };

  // Jika modal mutasi ditutup
  const closeMutasiModal = () => {
    setIsMutasiModalOpen(false);
    setMutasiDateStr(getTodayStr());
    setMutasiNominal("");
    setMutasiDariKas("bank");
    setMutasiKeKas("kas_toko");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMutasiModalOpen) closeMutasiModal();
        if (isBankModalOpen) closeBankModal();
        if (isTransaksiModalOpen) closeTransaksiModal();
      } else if (e.key === "Enter") {
        if (isMutasiModalOpen) {
          e.preventDefault();
          handleMutasiSubmit();
        } else if (isBankModalOpen) {
          // not used here, handled in page if it was
        } else if (isTransaksiModalOpen) {
          e.preventDefault();
          handleTransaksiBankSubmit();
        }
      }
    };

    if (isMutasiModalOpen || isBankModalOpen || isTransaksiModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isMutasiModalOpen, isBankModalOpen, isTransaksiModalOpen,
    mutasiDateStr, mutasiNominal, mutasiDariKas, mutasiKeKas,
    bankDateStr, bankNominal, bankCategory, bankType,
    transaksiDateStr, transaksiNominal, transaksiType, transaksiCategory, transactions
  ]);

  const handleMutasiSubmit = () => {
    const nominal = parseInt(mutasiNominal.replace(/\D/g, "")) || 0;
    if (nominal <= 0) return alert("Nominal mutasi tidak valid");
    if (mutasiDariKas === mutasiKeKas) return alert("Kas asal dan tujuan tidak boleh sama");
    
    const mutasiParts = mutasiDateStr.split("/");
    const ddmmyy = mutasiParts.length === 3 ? `${mutasiParts[0].padStart(2, "0")}${mutasiParts[1].padStart(2, "0")}${mutasiParts[2].slice(-2)}` : "";
    const index = (transactions.length + 1).toString().padStart(2, "0");
    
    let description = "Mutasi Kas";
    let debit = 0;
    let kredit = 0;

    const labels: Record<string, string> = {
      "kas_sp": "Kas SP",
      "kas_toko": "Kas Toko",
      "bank": "Bank",
      "kas_umum": "Kas Umum"
    };

    if (mutasiDariKas === "bank") {
      description = `Mutasi Keluar ke ${labels[mutasiKeKas]}`;
      kredit = nominal;
    } else if (mutasiKeKas === "bank") {
      description = `Mutasi Masuk dari ${labels[mutasiDariKas]}`;
      debit = nominal;
    } else {
      description = `Mutasi dari ${labels[mutasiDariKas]} ke ${labels[mutasiKeKas]}`;
    }

    const newTx = {
      id: `MTS-${ddmmyy}-${index}`,
      date: mutasiDateStr,
      memberId: "-",
      member: "Bank",
      description,
      debit,
      kredit,
      isMutasi: true,
      mutasiDari: mutasiDariKas,
      mutasiKe: mutasiKeKas,
      nominalMutasi: nominal
    };
    
    setTransactions(prev => [...prev, newTx]);
    closeMutasiModal();
  };

  const handleTransaksiBankSubmit = () => {
    const nominal = parseInt(transaksiNominal.replace(/\D/g, "")) || 0;
    if (nominal <= 0) return alert("Nominal transaksi tidak valid");

    const txParts = transaksiDateStr.split("/");
    const ddmmyy = txParts.length === 3 ? `${txParts[0].padStart(2, "0")}${txParts[1].padStart(2, "0")}${txParts[2].slice(-2)}` : "";
    const count = transactions.filter(t => t.id.startsWith(`BNK-${ddmmyy}`)).length + 1;
    const refId = `BNK-${ddmmyy}-${count.toString().padStart(2, '0')}`;

    const newTx = {
      id: refId,
      date: transaksiDateStr,
      description: transaksiCategory || "Tanpa Keterangan",
      keteranganTambahan: "",
      debit: transaksiType === "pemasukan" ? nominal : 0,
      kredit: transaksiType === "pengeluaran" ? nominal : 0,
      isMutasi: false
    };

    setTransactions(prev => [...prev, newTx]);
    closeTransaksiModal();
  };

  // Jika modal bank ditutup
  const closeBankModal = () => {
    setIsBankModalOpen(false);
    setBankDateStr(getTodayStr());
    setBankCategory("admin_bank");
    setBankType("pengeluaran");
    setBankNominal("");
  };

  let totalDebitBulanIni = 0;
  let totalKreditBulanIni = 0;
  let saldoAkhir = 0;
  
  const currentMonthStr = getTodayStr().substring(3);

  let bankTransactions = transactions.filter(t => {
    if (t.id.startsWith("BNK-")) return true;
    if (t.id.startsWith("MTS-") && (t.mutasiDari === "bank" || t.mutasiKe === "bank")) return true;
    return false;
  });

  bankTransactions.forEach(t => {
    let net = t.debit - t.kredit;
    saldoAkhir += net;
    
    if (t.date.endsWith(currentMonthStr)) {
      if (net > 0) totalDebitBulanIni += net;
      if (net < 0) totalKreditBulanIni += Math.abs(net);
    }
  });

  // Generate filtered transactions with saldo
  let currentSaldo = 0;
  let txsWithSaldo = bankTransactions.map((t) => {
    let net = t.debit - t.kredit;
    currentSaldo += net;
    return { ...t, saldo: currentSaldo };
  });
  
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    txsWithSaldo = txsWithSaldo.filter(t => 
      t.id.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q) || 
      (t.member && t.member.toLowerCase().includes(q))
    );
  }

  if (filterStartDate && filterEndDate) {
    txsWithSaldo = txsWithSaldo.filter(t => {
      const parts = t.date.split("/");
      if (parts.length === 3) {
        const tDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        return tDate >= filterStartDate && tDate <= filterEndDate;
      }
      return true;
    });
  }

  const handleDownloadExcel = () => {
    const headers = ["Tanggal", "No. Referensi", "Keterangan", "Pemasukan (Debit)", "Pengeluaran (Kredit)", "Saldo"];
    const rows = txsWithSaldo.map(t => [
      t.date,
      t.id,
      t.member && t.member !== "Kas Umum" ? `${t.description} - ${t.member}` : t.description,
      t.debit,
      t.kredit,
      t.saldo
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map((v: any) => `"${v}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Laporan_Kas_Bank_${getTodayStr().replace(/\//g, "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDownloadModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transaksi Bank</h2>
          <p className="text-gray-500 text-sm mt-1">Catatan arus kas harian khusus untuk aktivitas perbankan.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
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
            onClick={() => setIsTransaksiModalOpen(true)}
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
          title="Saldo Akhir Bank" 
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder="Cari referensi atau keterangan..."
          />
        </div>

        {/* Date Filters */}
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
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
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
              <tr className="bg-blue-50/50">
                <td colSpan={3} className="px-6 py-3 font-bold text-gray-800 text-right">
                  Saldo Halaman Sebelumnya
                </td>
                <td colSpan={2} className="px-6 py-3 text-right"></td>
                <td className="px-6 py-3 font-bold text-gray-800 text-right">Rp 0</td>
                <td className="px-6 py-3"></td>
              </tr>
              {txsWithSaldo.map((t) => (
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
                        {t.member && t.member !== "Bank" && (
                          <div className="text-xs text-gray-400 mt-0.5">{t.member}</div>
                        )}
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
                ))}
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
                  <select 
                    value={mutasiDariKas}
                    onChange={(e) => setMutasiDariKas(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-sm"
                  >
                    <option value="bank">Bank</option>
                    <option value="kas_sp">Kas Simpan Pinjam</option>
                    <option value="kas_toko">Kas Toko</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>
                <div className="pt-6">
                  <button 
                    type="button"
                    onClick={() => {
                      const temp = mutasiDariKas;
                      setMutasiDariKas(mutasiKeKas);
                      setMutasiKeKas(temp);
                    }}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="Tukar Posisi"
                  >
                    <ArrowRightLeft className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ke Kas</label>
                  <select 
                    value={mutasiKeKas}
                    onChange={(e) => setMutasiKeKas(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-sm"
                  >
                    <option value="kas_toko">Kas Toko</option>
                    <option value="kas_sp">Kas Simpan Pinjam</option>
                    <option value="bank">Bank</option>
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
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={closeMutasiModal}
                className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleMutasiSubmit}
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
                onClick={closeBankModal}
                className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20"
              >
                Simpan Transaksi Bank
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Modal Tambah Transaksi Bank */}
      {isTransaksiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div 
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeTransaksiModal}
          ></div>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                Tambah Transaksi Bank
              </h3>
              <button onClick={closeTransaksiModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Transaksi</label>
                  <input 
                    type="text" 
                    placeholder="DD/MM/YYYY" 
                    maxLength={10}
                    value={transaksiDateStr}
                    onChange={(e) => setTransaksiDateStr(processDateInput(e.target.value, transaksiDateStr))}
                    onKeyDown={(e) => processDateKeyDown(e, transaksiDateStr, setTransaksiDateStr)}
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

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori (Berdasarkan Struktur Keuangan)</label>
                <input 
                  type="text"
                  placeholder="Cari atau ketik kategori..."
                  value={transaksiCategorySearch}
                  onChange={(e) => {
                    setTransaksiCategorySearch(e.target.value);
                    setTransaksiCategory(e.target.value); // Allow arbitrary text
                    setIsCategoryDropdownOpen(true);
                    setHighlightedCategoryIndex(-1);
                  }}
                  onKeyDown={(e) => {
                    if (!isCategoryDropdownOpen) return;
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      e.stopPropagation();
                      setHighlightedCategoryIndex(prev => Math.min(prev + 1, filteredCOA.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      e.stopPropagation();
                      setHighlightedCategoryIndex(prev => Math.max(prev - 1, 0));
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      if (highlightedCategoryIndex >= 0 && highlightedCategoryIndex < filteredCOA.length) {
                        const coa = filteredCOA[highlightedCategoryIndex];
                        setTransaksiCategory(coa.name);
                        setTransaksiCategorySearch(coa.name);
                        setTransaksiType(coa.type);
                        setIsCategoryDropdownOpen(false);
                      }
                    }
                  }}
                  onFocus={() => setIsCategoryDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white outline-none"
                />
                
                {/* Auto-detected indicator */}
                {transaksiCategory && ALL_COA.find(c => c.name === transaksiCategory) && (
                  <div className={`absolute right-3 top-[34px] px-2 py-1 text-xs font-medium rounded ${
                    transaksiType === 'pemasukan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {transaksiType === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                  </div>
                )}

                {isCategoryDropdownOpen && filteredCOA.length > 0 && (
                  <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredCOA.map((coa, idx) => (
                      <li 
                        key={idx}
                        onMouseDown={() => {
                          setTransaksiCategory(coa.name);
                          setTransaksiCategorySearch(coa.name);
                          setTransaksiType(coa.type);
                          setIsCategoryDropdownOpen(false);
                        }}
                        onMouseEnter={() => setHighlightedCategoryIndex(idx)}
                        className={`px-4 py-2.5 text-sm cursor-pointer flex justify-between items-center transition-colors border-b border-gray-50 last:border-0 ${
                          highlightedCategoryIndex === idx ? 'bg-blue-50' : 'hover:bg-blue-50'
                        }`}
                      >
                        <span className="text-gray-700">{coa.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          coa.type === 'pemasukan' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {coa.type.toUpperCase()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">Rp</span>
                  <input 
                    type="text" 
                    placeholder="0" 
                    value={transaksiNominal}
                    onChange={(e) => setTransaksiNominal(formatRibuan(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium text-gray-800" 
                  />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={closeTransaksiModal}
                className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleTransaksiBankSubmit}
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
                  <option value="bank">Buku Bank</option>
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
              <button onClick={handleDownloadExcel} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-md shadow-green-500/20">Download CSV</button>
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

      {/* Delete Confirm Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setDeleteConfirm({isOpen: false, txId: ""})}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-2">Hapus Transaksi</h3>
              <p className="text-gray-500 text-sm">Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm({isOpen: false, txId: ""})} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={() => { setTransactions(prev => prev.filter(t => t.id !== deleteConfirm.txId)); setDeleteConfirm({isOpen: false, txId: ""}); }} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-500/20">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setEditModal({isOpen: false, tx: null, newVal: ""})}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-600" />
                Edit Nominal Transaksi
              </h3>
              <p className="text-gray-600 text-sm mb-4">Ubah nominal untuk <span className="font-semibold text-gray-800">{editModal.tx?.description}</span> ({editModal.tx?.id}):</p>
              <div>
                <input 
                  type="text" 
                  value={editModal.newVal} 
                  onChange={(e) => setEditModal({...editModal, newVal: formatRibuan(e.target.value)})} 
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-medium text-gray-800 text-right text-lg" 
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setEditModal({isOpen: false, tx: null, newVal: ""})} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={saveEditTransaction} className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20">Simpan Perubahan</button>
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
