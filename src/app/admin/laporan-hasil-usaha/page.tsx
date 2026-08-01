"use client";

import { useState } from "react";
import { 
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  LineChart,
  Printer
} from "lucide-react";
import { useAnggota } from "@/context/AnggotaContext";

// Struktur COA Laba Rugi dari Pengaturan
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

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

// Helper angka ribuan
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0
  }).format(angka);
};

// Generate Dummy Data 12 Bulan
const generateMonthlyData = (baseNominal: number, variance: number) => {
  return BULAN.map(() => {
    // Memberikan variasi random sekitar +- variance% dari baseNominal
    const rand = 1 + (Math.random() * variance * 2 - variance);
    return Math.round(baseNominal * rand / 1000) * 1000; 
  });
};

export default function LaporanHasilUsahaPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const { transactions } = useAnggota();

  const DUMMY_PENDAPATAN: Record<string, number[]> = {};
  const DUMMY_PENGELUARAN: Record<string, number[]> = {};

  // Inisialisasi semua COA dengan array 12 bulan (0)
  PENDAPATAN_COA.forEach(coa => DUMMY_PENDAPATAN[coa] = new Array(12).fill(0));
  PENGELUARAN_COA.forEach(coa => DUMMY_PENGELUARAN[coa] = new Array(12).fill(0));

  if (transactions) {
    transactions.forEach(t => {
      // Pastikan format date adalah DD/MM/YYYY
      if (!t.date || !t.date.includes("/")) return;
      
      const parts = t.date.split("/");
      if (parts.length < 3) return;
      
      const monthIndex = parseInt(parts[1], 10) - 1; // 0-based
      const year = parts[2];

      if (year !== selectedYear) return;

      const nominal = Math.max(t.debit, t.kredit);

      // Mapping rules
      if (t.description === "Jasa / Bunga") {
        DUMMY_PENDAPATAN["Pendapatan Bunga Pinjaman"][monthIndex] += nominal;
      }
      else if (t.description === "Jasa Bank") {
        if (t.debit > 0) {
          DUMMY_PENDAPATAN["Pendapatan Bunga Bank"][monthIndex] += nominal;
        } else {
          DUMMY_PENGELUARAN["Jasa Bank"][monthIndex] += nominal;
        }
      }
      else if (t.description === "Beban Admin Bank") {
        DUMMY_PENGELUARAN["Jasa Bank"][monthIndex] += nominal;
      }
    });
  }

  // Kalkulasi Total Tahunan (Semua Bulan) untuk keperluan metrik di atas
  let totalPendapatanSetahun = 0;
  PENDAPATAN_COA.forEach(coa => {
    if (DUMMY_PENDAPATAN[coa]) {
      totalPendapatanSetahun += DUMMY_PENDAPATAN[coa].reduce((a, b) => a + b, 0);
    }
  });

  let totalPengeluaranSetahun = 0;
  PENGELUARAN_COA.forEach(coa => {
    if (DUMMY_PENGELUARAN[coa]) {
      totalPengeluaranSetahun += DUMMY_PENGELUARAN[coa].reduce((a, b) => a + b, 0);
    }
  });

  const labaBersihSetahun = totalPendapatanSetahun - totalPengeluaranSetahun;

  // Fungsi utilitas untuk menghitung total baris (satu COA, 12 bulan)
  const getRowTotal = (data: number[]) => data.reduce((a, b) => a + b, 0);

  // Fungsi utilitas untuk menghitung total per bulan (Kolom)
  const getColumnTotal = (dataSource: Record<string, number[]>, colIndex: number) => {
    let total = 0;
    Object.values(dataSource).forEach(monthlyData => {
      total += monthlyData[colIndex] || 0;
    });
    return total;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Laporan Hasil Usaha</h2>
          <p className="text-gray-500 text-sm mt-1">Laporan Laba Rugi (SHU) per bulan selama setahun.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
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
          <button className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 font-medium text-sm">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Metric Cards (Total Tahunan) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-24 h-24 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-gray-500 mb-1">Total Pendapatan (Setahun)</p>
            <h3 className="text-2xl font-bold text-gray-800">Rp {formatRupiah(totalPendapatanSetahun)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-red-200 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <TrendingDown className="w-24 h-24 text-red-600" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-gray-500 mb-1">Total Beban (Setahun)</p>
            <h3 className="text-2xl font-bold text-gray-800">Rp {formatRupiah(totalPengeluaranSetahun)}</h3>
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-6 border border-blue-500 shadow-lg shadow-blue-500/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <LineChart className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-blue-100 mb-1">Sisa Hasil Usaha (SHU) Tahunan</p>
            <h3 className="text-2xl font-bold text-white">Rp {formatRupiah(labaBersihSetahun)}</h3>
          </div>
        </div>
      </div>

      {/* Main Report Table (Horizontal Scrollable) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar relative">
          <table className="w-full text-sm text-left whitespace-nowrap min-w-max">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/90 backdrop-blur border-b border-gray-100 font-semibold sticky top-0 z-30 shadow-sm">
              <tr>
                <th className="px-6 py-4 sticky left-0 top-0 z-40 bg-gray-50 border-r border-gray-100 min-w-[280px]">
                  Keterangan Akun
                </th>
                {BULAN.map((bulan, i) => (
                  <th key={i} className="px-4 py-4 text-right min-w-[100px]">{bulan}</th>
                ))}
                <th className="px-6 py-4 text-right bg-blue-50/50 text-blue-800 font-bold border-l border-gray-100">
                  Total
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              
              {/* --- BAGIAN PENDAPATAN --- */}
              <tr>
                <td colSpan={14} className="bg-emerald-50/30 px-6 py-3 font-bold text-emerald-800 text-sm sticky left-0 z-10">
                  PENDAPATAN
                </td>
              </tr>
              
              {PENDAPATAN_COA.map((coa, index) => {
                const monthlyData = DUMMY_PENDAPATAN[coa] || new Array(12).fill(0);
                const rowTotal = getRowTotal(monthlyData);
                
                if (rowTotal === 0) return null;
                
                return (
                  <tr key={`pendapatan-${index}`} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-3 text-gray-700 font-medium sticky left-0 z-10 bg-white group-hover:bg-gray-50 border-r border-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        {coa}
                      </div>
                    </td>
                    {monthlyData.map((val, i) => (
                      <td key={i} className="px-4 py-3 text-right text-gray-600">
                        {formatRupiah(val)}
                      </td>
                    ))}
                    <td className="px-6 py-3 text-right font-bold text-emerald-700 bg-emerald-50/20 border-l border-gray-100">
                      {formatRupiah(rowTotal)}
                    </td>
                  </tr>
                );
              })}

              {/* Subtotal Pendapatan */}
              <tr className="bg-emerald-50/50 font-bold border-y border-emerald-100">
                <td className="px-6 py-4 text-emerald-900 sticky left-0 z-10 bg-emerald-50 border-r border-emerald-100">
                  Total Pendapatan
                </td>
                {BULAN.map((_, i) => (
                  <td key={i} className="px-4 py-4 text-right text-emerald-700">
                    {formatRupiah(getColumnTotal(DUMMY_PENDAPATAN, i))}
                  </td>
                ))}
                <td className="px-6 py-4 text-right text-emerald-800 border-l border-emerald-100 text-base">
                  {formatRupiah(totalPendapatanSetahun)}
                </td>
              </tr>


              {/* --- BAGIAN BEBAN --- */}
              <tr>
                <td colSpan={14} className="bg-red-50/30 px-6 py-4 font-bold text-red-800 text-sm sticky left-0 z-10 border-t border-gray-100">
                  BEBAN & PENGELUARAN
                </td>
              </tr>

              {PENGELUARAN_COA.map((coa, index) => {
                const monthlyData = DUMMY_PENGELUARAN[coa] || new Array(12).fill(0);
                const rowTotal = getRowTotal(monthlyData);
                
                if (rowTotal === 0) return null;
                
                return (
                  <tr key={`pengeluaran-${index}`} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-3 text-gray-700 font-medium sticky left-0 z-10 bg-white group-hover:bg-gray-50 border-r border-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                        {coa}
                      </div>
                    </td>
                    {monthlyData.map((val, i) => (
                      <td key={i} className="px-4 py-3 text-right text-gray-600">
                        {formatRupiah(val)}
                      </td>
                    ))}
                    <td className="px-6 py-3 text-right font-bold text-red-700 bg-red-50/20 border-l border-gray-100">
                      {formatRupiah(rowTotal)}
                    </td>
                  </tr>
                );
              })}

              {/* Subtotal Beban */}
              <tr className="bg-red-50/50 font-bold border-y border-red-100">
                <td className="px-6 py-4 text-red-900 sticky left-0 z-10 bg-red-50 border-r border-red-100">
                  Total Beban & Pengeluaran
                </td>
                {BULAN.map((_, i) => (
                  <td key={i} className="px-4 py-4 text-right text-red-700">
                    {formatRupiah(getColumnTotal(DUMMY_PENGELUARAN, i))}
                  </td>
                ))}
                <td className="px-6 py-4 text-right text-red-800 border-l border-red-100 text-base">
                  {formatRupiah(totalPengeluaranSetahun)}
                </td>
              </tr>

              {/* --- LABA BERSIH (SHU) --- */}
              <tr className="bg-blue-600 font-bold text-white">
                <td className="px-6 py-5 sticky left-0 z-10 bg-blue-700 border-r border-blue-500 shadow-xl">
                  <div className="flex flex-col">
                    <span className="text-base">SISA HASIL USAHA (SHU)</span>
                    <span className="text-xs text-blue-200 font-normal">Laba Bersih Sebelum Pajak</span>
                  </div>
                </td>
                {BULAN.map((_, i) => {
                  const netMonth = getColumnTotal(DUMMY_PENDAPATAN, i) - getColumnTotal(DUMMY_PENGELUARAN, i);
                  return (
                    <td key={i} className="px-4 py-5 text-right font-bold tracking-wide">
                      {formatRupiah(netMonth)}
                    </td>
                  );
                })}
                <td className="px-6 py-5 text-right text-lg border-l border-blue-500 shadow-xl bg-blue-700">
                  {formatRupiah(labaBersihSetahun)}
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
