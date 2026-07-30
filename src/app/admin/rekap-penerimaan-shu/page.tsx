"use client";

import { useState } from "react";
import { 
  Download,
  Filter,
  Printer,
  Search,
  Users
} from "lucide-react";

// Helper format angka ribuan
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0
  }).format(angka);
};

// Dummy Data
const DUMMY_REKAP_SHU = [
  { 
    no: 1, 
    nama: "Budi Santoso", 
    simpPokok: 1000000, 
    simpWajib: 15000000, 
    angsuran: 5000000, 
    jasa: 1500000, 
    shuPokok: 250000, 
    shuWajib: 1250000, 
    shuPinjaman: 450000 
  },
  { 
    no: 2, 
    nama: "Siti Rahmawati", 
    simpPokok: 1000000, 
    simpWajib: 12500000, 
    angsuran: 0, 
    jasa: 0, 
    shuPokok: 250000, 
    shuWajib: 1100000, 
    shuPinjaman: 0 
  },
  { 
    no: 3, 
    nama: "Agus Pratama", 
    simpPokok: 1000000, 
    simpWajib: 20000000, 
    angsuran: 10000000, 
    jasa: 3000000, 
    shuPokok: 250000, 
    shuWajib: 1800000, 
    shuPinjaman: 900000 
  },
  { 
    no: 4, 
    nama: "Dewi Lestari", 
    simpPokok: 1000000, 
    simpWajib: 8000000, 
    angsuran: 2500000, 
    jasa: 750000, 
    shuPokok: 250000, 
    shuWajib: 700000, 
    shuPinjaman: 225000 
  },
  { 
    no: 5, 
    nama: "Hendra Wijaya", 
    simpPokok: 1000000, 
    simpWajib: 5000000, 
    angsuran: 1200000, 
    jasa: 360000, 
    shuPokok: 250000, 
    shuWajib: 450000, 
    shuPinjaman: 110000 
  },
  { 
    no: 6, 
    nama: "Nina Safitri", 
    simpPokok: 1000000, 
    simpWajib: 18000000, 
    angsuran: 4000000, 
    jasa: 1200000, 
    shuPokok: 250000, 
    shuWajib: 1600000, 
    shuPinjaman: 360000 
  },
  { 
    no: 7, 
    nama: "Reza Oktavian", 
    simpPokok: 1000000, 
    simpWajib: 2500000, 
    angsuran: 0, 
    jasa: 0, 
    shuPokok: 250000, 
    shuWajib: 200000, 
    shuPinjaman: 0 
  },
];

export default function RekapPenerimaanSHUPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = DUMMY_REKAP_SHU.filter(item => 
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Rekap Penerimaan SHU Anggota</h2>
          <p className="text-gray-500 text-sm mt-1">Rincian pendapatan SHU yang diterima per anggota pada tahun buku tertentu.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari anggota..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>

          {/* Filter Tahun */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="2026">Tahun 2026</option>
              <option value="2025">Tahun 2025</option>
              <option value="2024">Tahun 2024</option>
            </select>
          </div>

          <button className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm">
            <Printer className="w-4 h-4" />
            Cetak
          </button>
          <button className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 font-medium text-sm">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-800">Daftar Penerimaan SHU per Anggota</h3>
        </div>

        {/* Table Wrapper (Horizontal Scroll) */}
        <div className="overflow-x-auto custom-scrollbar overflow-y-auto max-h-[600px] relative">
          <table className="w-full text-sm text-left whitespace-nowrap min-w-max border-collapse">
            
            <thead className="text-xs text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200 sticky top-0 z-30">
              <tr>
                <th rowSpan={2} className="px-4 py-3 sticky left-0 top-0 z-40 bg-gray-100 border-r border-gray-200 border-b-2 text-center w-12">No</th>
                <th rowSpan={2} className="px-6 py-3 sticky left-12 top-0 z-40 bg-gray-100 border-r-2 border-gray-200 border-b-2 min-w-[200px]">Nama Anggota</th>
                
                <th rowSpan={2} className="px-5 py-3 text-right border-r border-gray-200 bg-emerald-50/50 border-b-2">Total Simp. Pokok</th>
                <th rowSpan={2} className="px-5 py-3 text-right border-r-2 border-gray-200 bg-emerald-50/50 border-b-2">Total Simp. Wajib</th>
                
                <th colSpan={3} className="px-4 py-2 text-center border-r-2 border-gray-200 bg-amber-50/50 border-b border-gray-200">Pembayaran Pinjaman</th>
                
                <th colSpan={3} className="px-4 py-2 text-center border-r-2 border-gray-200 bg-blue-50/50 border-b border-gray-200">Pembagian SHU</th>
                
                <th rowSpan={2} className="px-6 py-3 text-right border-l-2 border-gray-200 bg-indigo-50 text-indigo-800 font-bold border-b-2">TOTAL DITERIMA</th>
              </tr>
              <tr>
                {/* Sub-header Pembayaran */}
                <th className="px-5 py-2 text-right border-r border-gray-200 bg-amber-50/50 border-b-2 border-b-gray-200 font-medium">Angsuran Pokok</th>
                <th className="px-5 py-2 text-right border-r border-gray-200 bg-amber-50/50 border-b-2 border-b-gray-200 font-medium">Jasa Bunga</th>
                <th className="px-5 py-2 text-right border-r-2 border-gray-200 bg-amber-100/50 border-b-2 border-b-gray-200 font-bold">Angsuran + Jasa</th>
                
                {/* Sub-header Pembagian SHU */}
                <th className="px-5 py-2 text-right border-r border-gray-200 bg-blue-50/50 border-b-2 border-b-gray-200 font-medium">SHU Pokok</th>
                <th className="px-5 py-2 text-right border-r border-gray-200 bg-blue-50/50 border-b-2 border-b-gray-200 font-medium">SHU Wajib</th>
                <th className="px-5 py-2 text-right border-r-2 border-gray-200 bg-blue-50/50 border-b-2 border-b-gray-200 font-medium">SHU Pinjaman</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item, idx) => {
                const totalPembayaran = item.angsuran + item.jasa;
                const totalSHU = item.shuPokok + item.shuWajib + item.shuPinjaman;

                return (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3 text-center text-gray-500 sticky left-0 z-10 bg-white group-hover:bg-gray-50 border-r border-gray-100 transition-colors">{item.no}</td>
                    <td className="px-6 py-3 font-semibold text-gray-800 sticky left-12 z-10 bg-white group-hover:bg-gray-50 border-r-2 border-gray-100 transition-colors">{item.nama}</td>
                    
                    {/* Simpanan */}
                    <td className="px-5 py-3 text-right text-gray-600 border-r border-gray-50">{formatRupiah(item.simpPokok)}</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-700 border-r-2 border-gray-100">{formatRupiah(item.simpWajib)}</td>
                    
                    {/* Pembayaran */}
                    <td className="px-5 py-3 text-right text-gray-500 border-r border-gray-50">{formatRupiah(item.angsuran)}</td>
                    <td className="px-5 py-3 text-right text-gray-500 border-r border-gray-50">{formatRupiah(item.jasa)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-amber-700 bg-amber-50/30 border-r-2 border-gray-100">{formatRupiah(totalPembayaran)}</td>
                    
                    {/* SHU */}
                    <td className="px-5 py-3 text-right text-blue-700 border-r border-gray-50">{formatRupiah(item.shuPokok)}</td>
                    <td className="px-5 py-3 text-right text-blue-700 border-r border-gray-50">{formatRupiah(item.shuWajib)}</td>
                    <td className="px-5 py-3 text-right text-blue-700 border-r-2 border-gray-100">{formatRupiah(item.shuPinjaman)}</td>
                    
                    {/* Final */}
                    <td className="px-6 py-3 text-right font-bold text-indigo-700 bg-indigo-50/30 border-l-2 border-gray-100 text-base">
                      {formatRupiah(totalSHU)}
                    </td>
                  </tr>
                );
              })}
              
              {/* Pesan Data Kosong */}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                    Data anggota tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
