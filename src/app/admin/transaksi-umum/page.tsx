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
  Building2
} from "lucide-react";
// Dummy data dihapus karena tidak ada transaksi anggota

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

export default function TransaksiUmumPage() {
  const [isMutasiModalOpen, setIsMutasiModalOpen] = useState(false);
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

  // Form States Transaksi Umum
  const [transaksiDateStr, setTransaksiDateStr] = useState(getTodayStr());
  const [transaksiType, setTransaksiType] = useState("pengeluaran"); // pemasukan / pengeluaran
  const [transaksiCategory, setTransaksiCategory] = useState("");
  const [transaksiNominal, setTransaksiNominal] = useState("");
  const [transaksiDesc, setTransaksiDesc] = useState("");

  const closeTransaksiModal = () => {
    setIsTransaksiModalOpen(false);
    setTransaksiDateStr(getTodayStr());
    setTransaksiType("pengeluaran");
    setTransaksiCategory("");
    setTransaksiNominal("");
    setTransaksiDesc("");
  };

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

  // Jika modal mutasi ditutup
  const closeMutasiModal = () => {
    setIsMutasiModalOpen(false);
    setMutasiDateStr(getTodayStr());
    setMutasiNominal("");
  };

  // Jika modal bank ditutup
  const closeBankModal = () => {
    setIsBankModalOpen(false);
    setBankDateStr(getTodayStr());
    setBankCategory("admin_bank");
    setBankType("pengeluaran");
    setBankNominal("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transaksi Umum</h2>
          <p className="text-gray-500 text-sm mt-1">Catatan arus kas harian untuk aktivitas Kas dan Bank (Non-Anggota).</p>
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
          title="Total Pemasukan" 
          value="Rp 0" 
          sub="Bulan ini" 
          icon={ArrowDownLeft} 
          color="emerald" 
        />
        <MetricCard 
          title="Total Pengeluaran" 
          value="Rp 0" 
          sub="Bulan ini" 
          icon={ArrowUpRight} 
          color="amber" 
        />
        <MetricCard 
          title="Saldo Kas Umum" 
          value="Rp 0" 
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

          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select className="block w-full pl-10 pr-8 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-600 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors appearance-none cursor-pointer">
              <option value="">Semua Transaksi</option>
              <option value="pemasukan">Pemasukan (Debit)</option>
              <option value="pengeluaran">Pengeluaran (Kredit)</option>
            </select>
          </div>
          
          <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
            Reset
          </button>
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
            </tbody>
          </table>
        </div>
        
        {/* Pagination & Items Per Page */}
        <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <span>Tampilkan</span>
            <select className="border border-gray-200 rounded-lg py-1 px-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>baris</span>
          </div>
          
          <div>Menampilkan 0 hingga 0 dari 0 transaksi</div>
          
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors" disabled>Seb</button>
            <button className="px-3 py-1 border border-blue-500 bg-blue-50 text-blue-700 rounded font-medium transition-colors">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors" disabled>Lanjut</button>
          </div>
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
                onClick={closeBankModal}
                className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20"
              >
                Simpan Transaksi Bank
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Modal Tambah Transaksi Umum */}
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
                Tambah Transaksi Umum
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Arus Kas</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="transaksiType" 
                      value="pemasukan"
                      checked={transaksiType === "pemasukan"}
                      onChange={(e) => {
                        setTransaksiType(e.target.value);
                        setTransaksiCategory(""); // reset category on type change
                      }}
                      className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Pemasukan</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="transaksiType" 
                      value="pengeluaran"
                      checked={transaksiType === "pengeluaran"}
                      onChange={(e) => {
                        setTransaksiType(e.target.value);
                        setTransaksiCategory(""); // reset category on type change
                      }}
                      className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Pengeluaran</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori (Berdasarkan Struktur Keuangan)</label>
                <select 
                  value={transaksiCategory}
                  onChange={(e) => setTransaksiCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white outline-none"
                >
                  <option value="">Pilih Kategori...</option>
                  {transaksiType === "pemasukan" ? PENDAPATAN_COA.map((coa, idx) => (
                    <option key={idx} value={coa}>{coa}</option>
                  )) : PENGELUARAN_COA.map((coa, idx) => (
                    <option key={idx} value={coa}>{coa}</option>
                  ))}
                </select>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Tambahan</label>
                <textarea 
                  rows={2} 
                  placeholder="Deskripsi atau catatan khusus..." 
                  value={transaksiDesc}
                  onChange={(e) => setTransaksiDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-sm"
                ></textarea>
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
                onClick={closeTransaksiModal}
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
