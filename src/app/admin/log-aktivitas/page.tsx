"use client";

import { useState } from "react";
import { 
  Search,
  Filter,
  Calendar,
  Download,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle
} from "lucide-react";

// Dummy Data
const DUMMY_LOGS = [
  {
    id: "LOG-1029",
    timestamp: "2026-07-26 14:32:10",
    pengurus: "Admin Gatra (Super Admin)",
    modul: "Pengaturan",
    aktivitas: "Mengubah persentase pembagian SHU Jasa Modal menjadi 25%",
    status: "Sukses",
    ip: "192.168.1.10"
  },
  {
    id: "LOG-1028",
    timestamp: "2026-07-26 13:15:45",
    pengurus: "Budi Santoso (Bendahara)",
    modul: "Transaksi",
    aktivitas: "Menghapus data transaksi masuk SP dengan ID #TRX-9921",
    status: "Sukses",
    ip: "192.168.1.15"
  },
  {
    id: "LOG-1027",
    timestamp: "2026-07-26 11:05:22",
    pengurus: "Siti Rahma (Sekretaris)",
    modul: "Anggota",
    aktivitas: "Menambahkan anggota baru: Asep Saepudin (ID: ANG-0155)",
    status: "Sukses",
    ip: "192.168.1.22"
  },
  {
    id: "LOG-1026",
    timestamp: "2026-07-26 09:45:11",
    pengurus: "Tidak Dikenal",
    modul: "Autentikasi",
    aktivitas: "Gagal login (Password salah 3 kali) untuk user 'budi_koperasi'",
    status: "Gagal",
    ip: "114.122.45.12"
  },
  {
    id: "LOG-1025",
    timestamp: "2026-07-26 09:30:00",
    pengurus: "Admin Gatra (Super Admin)",
    modul: "Autentikasi",
    aktivitas: "Login berhasil",
    status: "Sukses",
    ip: "192.168.1.10"
  },
  {
    id: "LOG-1024",
    timestamp: "2026-07-25 16:20:15",
    pengurus: "Hendrik (Pengelola Toko)",
    modul: "Transaksi",
    aktivitas: "Mencoba mengakses halaman Pengaturan (Akses Ditolak)",
    status: "Gagal",
    ip: "192.168.1.40"
  },
  {
    id: "LOG-1023",
    timestamp: "2026-07-25 15:10:05",
    pengurus: "Budi Santoso (Bendahara)",
    modul: "Laporan",
    aktivitas: "Mengunduh Laporan Neraca PDF Tahun 2026",
    status: "Sukses",
    ip: "192.168.1.15"
  },
  {
    id: "LOG-1022",
    timestamp: "2026-07-25 10:05:00",
    pengurus: "Admin Gatra (Super Admin)",
    modul: "Pengaturan",
    aktivitas: "Menonaktifkan akun pengurus 'Siti Rahma'",
    status: "Sukses",
    ip: "192.168.1.10"
  }
];

export default function AuditTrailPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModul, setFilterModul] = useState("Semua");

  const filteredData = DUMMY_LOGS.filter(log => {
    const matchSearch = log.aktivitas.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        log.pengurus.toLowerCase().includes(searchQuery.toLowerCase());
    const matchModul = filterModul === "Semua" || log.modul === filterModul;
    return matchSearch && matchModul;
  });

  const getModulBadge = (modul: string) => {
    switch (modul) {
      case "Autentikasi": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Pengaturan": return "bg-slate-800 text-white border-slate-700";
      case "Transaksi": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Anggota": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Laporan": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-500" />
            Log Aktivitas (Audit Trail)
          </h2>
          <p className="text-gray-500 text-sm mt-1">Pusat pemantauan rekam jejak aktivitas pengurus di dalam sistem koperasi.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari aktivitas/pengurus..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>

          {/* Filter Modul */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={filterModul} 
              onChange={(e) => setFilterModul(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Modul</option>
              <option value="Autentikasi">Autentikasi</option>
              <option value="Pengaturan">Pengaturan</option>
              <option value="Transaksi">Transaksi</option>
              <option value="Anggota">Anggota</option>
              <option value="Laporan">Laporan</option>
            </select>
          </div>

          {/* Filter Tanggal */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Hari Ini</span>
          </div>

          <button className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors shadow-md shadow-slate-500/20 font-medium text-sm">
            <Download className="w-4 h-4" />
            Ekspor Log
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-red-50/50 border-b border-red-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Riwayat Keamanan Sistem</h3>
              <p className="text-xs text-gray-500">Log ini mencatat aktivitas pengurus secara transparan. Jangan bagikan riwayat ini ke pihak luar.</p>
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-700">
            {filteredData.length} Catatan Ditemukan
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Waktu</th>
                <th className="px-6 py-4 font-medium">Pengurus (Role)</th>
                <th className="px-6 py-4 font-medium">Modul</th>
                <th className="px-6 py-4 font-medium min-w-[300px]">Aktivitas</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((log) => {
                const isFail = log.status === "Gagal";
                
                return (
                  <tr key={log.id} className={`transition-colors group ${isFail ? 'bg-red-50/30 hover:bg-red-50/70' : 'hover:bg-blue-50/30'}`}>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${log.pengurus === 'Tidak Dikenal' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                        <span className={`font-semibold ${log.pengurus === 'Tidak Dikenal' ? 'text-red-600' : 'text-gray-800'}`}>
                          {log.pengurus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${getModulBadge(log.modul)}`}>
                        {log.modul}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-normal">
                      <p className={`text-sm ${log.aktivitas.includes('Menghapus') ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {log.aktivitas}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">
                      {log.ip}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-bold ${isFail ? 'text-red-600' : 'text-emerald-600'}`}>
                        {isFail ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              
              {/* Pesan Data Kosong */}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada log aktivitas yang cocok dengan pencarian Anda.
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
