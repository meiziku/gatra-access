"use client";

import { useState } from "react";
import { 
  UserCog, 
  Key, 
  PlusCircle, 
  Edit3, 
  Trash2,
  Phone,
  Mail,
  Save,
  Users,
  UserCheck,
  Building,
  MapPin,
  PieChart,
  Percent,
  Calculator,
  LayoutList,
  Wallet,
  Scale,
  Folder,
  TrendingUp,
  TrendingDown,
  Database,
  DownloadCloud,
  UploadCloud,
  PiggyBank,
  GraduationCap,
  PartyPopper,
  ShieldCheck
} from "lucide-react";
import { useAnggota } from "@/context/AnggotaContext";

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState("koperasi");
  const { bungaPinjaman, setBungaPinjaman } = useAnggota();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Pengaturan Sistem Keuangan</h2>
        <p className="text-gray-500 text-sm mt-1">Konfigurasi lengkap profil koperasi, pengurus, dan struktur akun keuangan (COA).</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 p-1 bg-gray-100 rounded-xl w-full border border-gray-200/60">
        <button 
          onClick={() => setActiveTab("koperasi")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeTab === "koperasi" ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          <Building className="w-4 h-4" /> Profil Koperasi
        </button>
        <button 
          onClick={() => setActiveTab("pengurus")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeTab === "pengurus" ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          <UserCog className="w-4 h-4" /> Role System
        </button>
        <button 
          onClick={() => setActiveTab("shu")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeTab === "shu" ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          <PieChart className="w-4 h-4" /> Pembagian SHU
        </button>
        <button 
          onClick={() => setActiveTab("coa")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeTab === "coa" ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          <LayoutList className="w-4 h-4" /> Struktur Keuangan
        </button>
        <button 
          onClick={() => setActiveTab("simpanan")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeTab === "simpanan" ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          <PiggyBank className="w-4 h-4" /> Paket Simpanan
        </button>
        <button 
          onClick={() => setActiveTab("asuransi")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeTab === "asuransi" ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          <ShieldCheck className="w-4 h-4" /> Asuransi Pinjaman
        </button>
        <button 
          onClick={() => setActiveTab("database")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeTab === "database" ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
        >
          <Database className="w-4 h-4" /> Backup & Restore
        </button>
      </div>

      {/* Section 1: Manajemen Pengurus */}
      {activeTab === "pengurus" && (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <UserCog className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Manajemen Pengurus (Admin)</h3>
              <p className="text-xs text-gray-500">Atur username, password, dan hak akses admin lain.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 font-medium text-sm">
            <PlusCircle className="w-4 h-4" />
            Tambah Pengurus
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Pengurus</th>
                <th className="px-6 py-4 font-medium">Username</th>
                <th className="px-6 py-4 font-medium">Peran (Role)</th>
                <th className="px-6 py-4 font-medium">Status Akses</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AdminRow 
                name="Admin Utama" username="admin_super" 
                role="Super Admin" isSuper={true}
                status="Aktif" 
              />
              <AdminRow 
                name="Budi Santoso" username="budi_koperasi" 
                role="Bendahara" isSuper={false}
                status="Aktif" 
              />
              <AdminRow 
                name="Siti Rahma" username="siti_admin" 
                role="Sekretaris" isSuper={false}
                status="Nonaktif" 
              />
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Section 2: Profil & Data Koperasi */}
      {activeTab === "koperasi" && (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Profil Koperasi</h3>
            <p className="text-xs text-gray-500">Informasi dasar, alamat, dan kontak resmi Koperasi.</p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Informasi Umum */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-500" />
              Informasi Umum
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  Nama Koperasi
                </label>
                <input type="text" defaultValue="Koperasi Gatra" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email Resmi
                </label>
                <input type="email" defaultValue="admin@gatra-access.com" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  No. Telepon / WhatsApp
                </label>
                <input type="text" defaultValue="0812-3456-7890" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Alamat Lengkap
                </label>
                <textarea rows={1} defaultValue="Jl. Pusat Kota No. 1, Indonesia" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm text-gray-800 resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
            {/* Kiri: Susunan Pengurus */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Susunan Pengurus
              </h4>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ketua</label>
                  <input type="text" placeholder="Nama Ketua" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sekretaris</label>
                  <input type="text" placeholder="Nama Sekretaris" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bendahara</label>
                  <input type="text" placeholder="Nama Bendahara" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pengelola Simpan Pinjam</label>
                  <input type="text" placeholder="Nama Pengelola SP" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pengelola Toko</label>
                  <input type="text" placeholder="Nama Pengelola Toko" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm" />
                </div>
              </div>
            </div>

            {/* Kanan: Badan Pengawas */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-500" />
                Badan Pengawas
              </h4>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ketua Pengawas</label>
                  <input type="text" placeholder="Nama Ketua Pengawas" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Anggota Pengawas 1</label>
                  <input type="text" placeholder="Nama Anggota 1" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Anggota Pengawas 2</label>
                  <input type="text" placeholder="Nama Anggota 2" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20 font-medium text-sm">
              <Save className="w-4 h-4" />
              Simpan Data Koperasi
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Section 3: Pengaturan SHU */}
      {activeTab === "shu" && (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Pengaturan SHU (Sisa Hasil Usaha)</h3>
            <p className="text-xs text-gray-500">Atur persentase pembagian SHU dan metode perhitungannya.</p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kiri: Pembagian SHU */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-500" />
                Persentase Pembagian SHU
              </h4>
              <div className="flex flex-col gap-3">
                <InputSHU label="Jasa Simpanan Anggota" value="25" />
                <InputSHU label="Jasa Simpan Pinjam Anggota" value="50" />
                <InputSHU label="Dana Pemdaker" value="2.5" />
                <InputSHU label="Dana Pengurus" value="5" />
                <InputSHU label="Dana Kesejahteraan Pegawai" value="2.5" />
                <InputSHU label="Dana Pendidikan" value="2.5" />
                <InputSHU label="Dana Sosial" value="2.5" />
                <InputSHU label="Dana Cadangan" value="10" />
              </div>
              <div className="mt-4 p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <span className="font-bold shrink-0">Total Pembagian: 100%</span>
                <span className="text-amber-600/60 shrink-0">|</span>
                <span>Pastikan total persentase tepat 100%.</span>
              </div>
            </div>

            {/* Kanan: Metode Rumus */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-500" />
                Metode Rumus Perhitungan SHU Anggota
              </h4>
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" name="rumus_shu" className="mt-1 w-4 h-4 text-amber-600 focus:ring-amber-500" defaultChecked />
                  <div>
                    <div className="text-sm font-bold text-gray-800">Berdasarkan Total Angsuran Pinjaman</div>
                    <div className="text-xs text-gray-500 mt-1.5 font-mono bg-gray-100 px-2 py-1.5 rounded leading-relaxed border border-gray-200 block">Total Angsuran Pinjaman Anggota<br/>÷ Total Angsuran Pinjaman Semua Anggota</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" name="rumus_shu" className="mt-1 w-4 h-4 text-amber-600 focus:ring-amber-500" />
                  <div>
                    <div className="text-sm font-bold text-gray-800">Berdasarkan Total Angsuran Bunga</div>
                    <div className="text-xs text-gray-500 mt-1.5 font-mono bg-gray-100 px-2 py-1.5 rounded leading-relaxed border border-gray-200 block">Total Angsuran Bunga Pinjaman Anggota<br/>÷ Total Angsuran Bunga Pinjaman Semua Anggota</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" name="rumus_shu" className="mt-1 w-4 h-4 text-amber-600 focus:ring-amber-500" />
                  <div>
                    <div className="text-sm font-bold text-gray-800">Berdasarkan Total Angsuran Pokok</div>
                    <div className="text-xs text-gray-500 mt-1.5 font-mono bg-gray-100 px-2 py-1.5 rounded leading-relaxed border border-gray-200 block">Total Angsuran Pokok Pinjaman Anggota<br/>÷ Total Angsuran Pokok Pinjaman Semua Anggota</div>
                  </div>
                </label>
              </div>
              
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 mt-8 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-500" />
                Bunga / Jasa Simpanan Tambahan
              </h4>
              <div className="flex flex-col gap-3">
                <InputSHU label="Besar Jasa Manasuka per Tahun" value="10" />
                <InputSHU 
                  label="Besar Jasa Pinjaman per Bulan" 
                  value={bungaPinjaman} 
                  onChange={(val) => setBungaPinjaman(Number(val))} 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-md shadow-amber-500/20 font-medium text-sm">
              <Save className="w-4 h-4" />
              Simpan Pengaturan SHU
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Section 4: Chart of Accounts */}
      {activeTab === "coa" && (
        <div className="space-y-6">
          <NeracaSettings />
          <LabaRugiSettings />
        </div>
      )}

      {/* Section 5: Pengaturan Paket Simpanan */}
      {activeTab === "simpanan" && (
        <PaketSimpananSettings />
      )}

      {/* Section 6: Database */}
      {activeTab === "database" && (
        <DatabaseSettings />
      )}

      {/* Section 7: Asuransi Pinjaman */}
      {activeTab === "asuransi" && (
        <AsuransiSettings />
      )}

    </div>
  );
}

function InputSHU({ label, value, onChange }: { label: string, value: string | number, onChange?: (val: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-gray-50/50 border border-gray-100 rounded-xl">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative w-28 shrink-0">
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange ? onChange(e.target.value) : undefined}
          step="0.1" 
          className="w-full border border-gray-300 rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-sm font-bold text-gray-800 text-right" 
        />
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
          <span className="text-gray-500 text-sm font-medium">%</span>
        </div>
      </div>
    </div>
  );
}

function NeracaSettings() {
  const [coa, setCoa] = useState({
    asetLancar: [
      { id: 1, name: "Kas Simpan Pinjam" },
      { id: 2, name: "Kas Pusat" },
      { id: 3, name: "Bank" },
      { id: 4, name: "Toko" },
      { id: 5, name: "Piutang Pinjaman Anggota" },
    ],
    asetTetap: [
      { id: 6, name: "Inventaris" },
      { id: 7, name: "Akumulasi Penyusutan Inventaris" },
    ],
    kewajibanLancar: [
      { id: 8, name: "Beban yang akan dibayar" },
      { id: 9, name: "Manasuka" },
      { id: 10, name: "Tabungan Pendidikan" },
    ],
    dana: [
      { id: 11, name: "Pendidikan" },
      { id: 12, name: "Pengurus" },
      { id: 13, name: "Kesejahteraan Pegawai" },
      { id: 14, name: "Sosial" },
      { id: 15, name: "Pemdaker" },
    ],
    ekuitas: [
      { id: 16, name: "Simpanan Pokok" },
      { id: 17, name: "Simpanan Wajib" },
      { id: 18, name: "Toko" },
      { id: 19, name: "Dana Cadangan" },
      { id: 20, name: "Seragam" },
      { id: 21, name: "SHU Tahun Berjalan" },
    ]
  });

  const handleAdd = (category: keyof typeof coa, name: string) => {
    setCoa(prev => ({
      ...prev,
      [category]: [...prev[category], { id: Date.now(), name }]
    }));
  };

  const handleRemove = (category: keyof typeof coa, id: number) => {
    setCoa(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
  };

  const handleEdit = (category: keyof typeof coa, id: number, newName: string) => {
    setCoa(prev => ({
      ...prev,
      [category]: prev[category].map(item => item.id === id ? { ...item, name: newName } : item)
    }));
  };

  return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <LayoutList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Struktur Neraca Keuangan</h3>
            <p className="text-xs text-gray-500">Kelola daftar akun (Chart of Accounts) untuk laporan Neraca.</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kiri: ASET */}
            <div className="border border-emerald-100 rounded-xl overflow-hidden bg-emerald-50/10">
              <div className="bg-emerald-500 text-white font-bold px-4 py-3 flex items-center gap-2">
                 <Wallet className="w-5 h-5" /> ASET
              </div>
              <div className="p-4 space-y-6">
                 <CoaCategory title="Aset Lancar" items={coa.asetLancar} onAdd={(name) => handleAdd('asetLancar', name)} onRemove={(id) => handleRemove('asetLancar', id)} onEdit={(id, name) => handleEdit('asetLancar', id, name)} />
                 <CoaCategory title="Aset Tetap" items={coa.asetTetap} onAdd={(name) => handleAdd('asetTetap', name)} onRemove={(id) => handleRemove('asetTetap', id)} onEdit={(id, name) => handleEdit('asetTetap', id, name)} />
                 
                 <div className="pt-4 border-t-2 border-emerald-200 flex justify-between font-black text-emerald-800 text-lg">
                   <span>TOTAL ASET</span>
                   <span className="text-sm font-normal self-center">(Otomatis)</span>
                 </div>
              </div>
            </div>

            {/* Kanan: KEWAJIBAN & EKUITAS */}
            <div className="border border-blue-100 rounded-xl overflow-hidden bg-blue-50/10">
               <div className="bg-blue-500 text-white font-bold px-4 py-3 flex items-center gap-2">
                 <Scale className="w-5 h-5" /> KEWAJIBAN DAN EKUITAS
              </div>
              <div className="p-4 space-y-6">
                 
                 <CoaCategory title="Kewajiban Lancar" items={coa.kewajibanLancar} onAdd={(name) => handleAdd('kewajibanLancar', name)} onRemove={(id) => handleRemove('kewajibanLancar', id)} onEdit={(id, name) => handleEdit('kewajibanLancar', id, name)} />
                 <CoaCategory title="Dana" items={coa.dana} onAdd={(name) => handleAdd('dana', name)} onRemove={(id) => handleRemove('dana', id)} onEdit={(id, name) => handleEdit('dana', id, name)} />
                 
                 <div className="py-2 border-t border-b border-blue-100 flex justify-between font-bold text-blue-800 bg-blue-50/50 px-3 rounded">
                   <span>Total Kewajiban</span>
                   <span className="text-sm font-normal">(Otomatis)</span>
                 </div>

                 <CoaCategory title="Ekuitas / Modal" items={coa.ekuitas} onAdd={(name) => handleAdd('ekuitas', name)} onRemove={(id) => handleRemove('ekuitas', id)} onEdit={(id, name) => handleEdit('ekuitas', id, name)} />
                 
                 <div className="py-2 border-t border-b border-blue-100 flex justify-between font-bold text-blue-800 bg-blue-50/50 px-3 rounded">
                   <span>Total Ekuitas</span>
                   <span className="text-sm font-normal">(Otomatis)</span>
                 </div>

                 <div className="pt-4 border-t-2 border-blue-200 flex justify-between font-black text-blue-900 text-lg">
                   <span>TOTAL KEWAJIBAN & EKUITAS</span>
                   <span className="text-sm font-normal self-center">(Otomatis)</span>
                 </div>
              </div>
            </div>

          </div>
          
          <div className="flex justify-end pt-6 mt-4 border-t border-gray-100">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20 font-medium text-sm">
              <Save className="w-4 h-4" />
              Simpan Struktur Neraca
            </button>
          </div>
        </div>
      </div>
  )
}

function LabaRugiSettings() {
  const [coa, setCoa] = useState({
    pendapatan: [
      { id: 1, name: "Pendapatan Bunga Pinjaman" },
      { id: 2, name: "Pendapatan Penjualan Produk" },
      { id: 3, name: "Pendapatan Penjualan Jasa" },
      { id: 4, name: "Pendapatan Bunga Bank" },
      { id: 5, name: "Pendapatan Lain-Lain" }
    ],
    pengeluaran: [
      { id: 6, name: "Jasa Simpanan Sukarela" },
      { id: 7, name: "Jasa Bank" },
      { id: 8, name: "Beban Asuransi" },
      { id: 9, name: "Beban Audit" },
      { id: 10, name: "Beban Pajak" },
      { id: 11, name: "Beban Rapat" },
      { id: 12, name: "Beban Perjalanan Dinas" },
      { id: 13, name: "Beban Pelatihan" },
      { id: 14, name: "Beban Honor Pengurus" },
      { id: 15, name: "Beban Organisasi" },
      { id: 16, name: "Beban Gaji Karyawan" },
      { id: 17, name: "Beban Konsumsi" },
      { id: 18, name: "Beban ATK" },
      { id: 19, name: "Beban Listrik, Telepon dan Air" },
      { id: 20, name: "Beban Internet" },
      { id: 21, name: "Beban Ongkos Kirim" },
      { id: 22, name: "Beban Perbaikan dan Pemeliharaan" },
      { id: 23, name: "Beban Operasional" },
      { id: 24, name: "Beban Sewa" },
      { id: 25, name: "Beban Pembelian Aset" },
      { id: 26, name: "Beban Penyusutan Inventaris" },
    ]
  });

  const handleAdd = (category: keyof typeof coa, name: string) => {
    setCoa(prev => ({
      ...prev,
      [category]: [...prev[category], { id: Date.now(), name }]
    }));
  };

  const handleRemove = (category: keyof typeof coa, id: number) => {
    setCoa(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
  };

  const handleEdit = (category: keyof typeof coa, id: number, newName: string) => {
    setCoa(prev => ({
      ...prev,
      [category]: prev[category].map(item => item.id === id ? { ...item, name: newName } : item)
    }));
  };

  return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Struktur Laba Rugi</h3>
            <p className="text-xs text-gray-500">Kelola daftar akun (Chart of Accounts) untuk laporan Laba Rugi.</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kiri: PENDAPATAN */}
            <div className="border border-emerald-100 rounded-xl overflow-hidden bg-emerald-50/10 h-max">
              <div className="bg-emerald-500 text-white font-bold px-4 py-3 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5" /> PENDAPATAN
              </div>
              <div className="p-4 space-y-6">
                 <CoaCategory title="Daftar Pendapatan" items={coa.pendapatan} onAdd={(name) => handleAdd('pendapatan', name)} onRemove={(id) => handleRemove('pendapatan', id)} onEdit={(id, name) => handleEdit('pendapatan', id, name)} />
                 
                 <div className="pt-4 border-t-2 border-emerald-200 flex justify-between font-black text-emerald-800 text-lg">
                   <span>TOTAL PENDAPATAN</span>
                   <span className="text-sm font-normal self-center">(Otomatis)</span>
                 </div>
              </div>
            </div>

            {/* Kanan: PENGELUARAN */}
            <div className="border border-rose-100 rounded-xl overflow-hidden bg-rose-50/10 h-max">
               <div className="bg-rose-500 text-white font-bold px-4 py-3 flex items-center gap-2">
                 <TrendingDown className="w-5 h-5" /> PENGELUARAN
              </div>
              <div className="p-4 space-y-6">
                 
                 <CoaCategory title="Daftar Pengeluaran / Beban" items={coa.pengeluaran} onAdd={(name) => handleAdd('pengeluaran', name)} onRemove={(id) => handleRemove('pengeluaran', id)} onEdit={(id, name) => handleEdit('pengeluaran', id, name)} />
                 
                 <div className="pt-4 border-t-2 border-rose-200 flex justify-between font-black text-rose-900 text-lg">
                   <span>TOTAL PENGELUARAN</span>
                   <span className="text-sm font-normal self-center">(Otomatis)</span>
                 </div>
                 
                 <div className="py-3 mt-4 border border-indigo-200 flex justify-between font-black text-indigo-800 bg-indigo-50 px-4 rounded-xl shadow-inner text-lg sm:text-xl">
                   <span>SISA HASIL USAHA</span>
                   <span className="text-sm font-normal self-center text-right sm:text-left">(Pendapatan - Pengeluaran)</span>
                 </div>
              </div>
            </div>

          </div>
          
          <div className="flex justify-end pt-6 mt-4 border-t border-gray-100">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors shadow-md shadow-rose-500/20 font-medium text-sm">
              <Save className="w-4 h-4" />
              Simpan Struktur Laba Rugi
            </button>
          </div>
        </div>
      </div>
  )
}

function CoaCategory({ title, items, onAdd, onRemove, onEdit }: { title: string, items: any[], onAdd: (name: string) => void, onRemove: (id: number) => void, onEdit: (id: number, newName: string) => void }) {
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const startEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const saveEdit = (id: number) => {
    if(editName.trim()) {
      onEdit(id, editName);
    }
    setEditingId(null);
  };
  
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-gray-200">
        <h5 className="font-bold text-gray-700 text-sm flex items-center gap-2">
           <Folder className="w-4 h-4 text-blue-500" />
           {title}
        </h5>
      </div>
      <ul className="space-y-1.5 mb-3">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between bg-white border border-gray-200 px-3 py-2 rounded-lg group hover:border-blue-300 transition-colors">
            {editingId === item.id ? (
              <div className="flex items-center gap-2 w-full">
                <input 
                  autoFocus
                  type="text" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => { if(e.key === 'Enter') saveEdit(item.id); if(e.key === 'Escape') setEditingId(null); }}
                  className="flex-1 border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button onClick={() => saveEdit(item.id)} className="text-emerald-500 hover:text-emerald-700 bg-emerald-50 p-1 rounded" title="Simpan Perubahan"><Save className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <>
                 <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                   {item.name}
                 </span>
                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => startEdit(item.id, item.name)} className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded" title="Ubah Nama">
                     <Edit3 className="w-3.5 h-3.5" />
                   </button>
                   <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded" title="Hapus Akun">
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                 </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => { if(e.key === 'Enter' && newItem.trim()) { onAdd(newItem); setNewItem(""); } }}
          placeholder="Tambah akun baru..." 
          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
        />
        <button 
           onClick={() => { if(newItem.trim()) { onAdd(newItem); setNewItem(""); } }}
           className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function AdminRow({ name, username, role, isSuper, status }: any) {
  const isNonaktif = status === "Nonaktif";
  
  return (
    <tr className="hover:bg-blue-50/30 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
            {name.charAt(0)}
          </div>
          <span className="font-bold text-gray-800">{name}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
        @{username}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${isSuper ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
          {role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`flex items-center gap-1.5 text-xs font-medium ${isNonaktif ? 'text-red-600' : 'text-emerald-600'}`}>
          <span className={`w-2 h-2 rounded-full ${isNonaktif ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors tooltip-trigger" title="Edit Pengurus">
            <Edit3 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors tooltip-trigger" title="Reset Password Admin">
            <Key className="w-4 h-4" />
          </button>
          {!isSuper && (
            <button className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors tooltip-trigger" title="Hapus Akses">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function PaketSimpananSettings() {
  const pendidikanTargets = [
    1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 
    8000000, 9000000, 10000000, 15000000, 20000000, 25000000, 
    30000000, 40000000, 50000000
  ];

  // Helper to approximate values based on image if exact not needed, or just dummy
  const calculateInstallment = (target: number, months: number) => {
    // Basic approximation to match the image loosely (target / months - small discount)
    // For exact match, we'd hardcode the matrix, but a dynamic formula is better for a settings page.
    let discountRate = 0.034; // approx 3.4% discount for 1 year
    if(months === 24) discountRate = 0.069;
    if(months === 36) discountRate = 0.1048;
    if(months === 48) discountRate = 0.1396;
    if(months === 60) discountRate = 0.172;
    if(months === 72) discountRate = 0.208;
    
    return Math.round((target * (1 - discountRate)) / months / 100) * 100;
  };

  const [paketHariRaya, setPaketHariRaya] = useState([
    { id: 1, amount: 25000 },
    { id: 2, amount: 50000 },
    { id: 3, amount: 100000 },
    { id: 4, amount: 200000 },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Pengaturan Simpanan Target</h3>
            <p className="text-xs text-gray-500">Konfigurasi tabel matriks Pendidikan dan nominal per paket Hari Raya.</p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Paket Pendidikan */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                Matriks Simpanan Pendidikan
              </div>
              <button className="text-xs flex items-center gap-1 text-amber-600 hover:text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                <Edit3 className="w-3 h-3" /> Edit Target
              </button>
            </h4>
            
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-sm text-center">
                <thead className="bg-gray-100/80 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 border-r border-gray-200 font-bold text-gray-700 sticky left-0 bg-gray-100/80 z-10 w-32">Tahun</th>
                    <th className="px-4 py-2 font-bold text-gray-700">6</th>
                    <th className="px-4 py-2 font-bold text-gray-700">5</th>
                    <th className="px-4 py-2 font-bold text-gray-700">4</th>
                    <th className="px-4 py-2 font-bold text-gray-700">3</th>
                    <th className="px-4 py-2 font-bold text-gray-700">2</th>
                    <th className="px-4 py-2 font-bold text-gray-700">1</th>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <th className="px-4 py-2 border-r border-gray-200 font-bold text-gray-700 sticky left-0 bg-gray-100/80 z-10">Bulan</th>
                    <th className="px-4 py-2 font-bold text-gray-700">72</th>
                    <th className="px-4 py-2 font-bold text-gray-700">60</th>
                    <th className="px-4 py-2 font-bold text-gray-700">48</th>
                    <th className="px-4 py-2 font-bold text-gray-700">36</th>
                    <th className="px-4 py-2 font-bold text-gray-700">24</th>
                    <th className="px-4 py-2 font-bold text-gray-700">12</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {pendidikanTargets.map((target) => (
                    <tr key={target} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-4 py-1.5 border-r border-gray-100 font-black text-amber-700 sticky left-0 bg-white shadow-[1px_0_5px_-2px_rgba(0,0,0,0.05)] whitespace-nowrap text-right">
                        {new Intl.NumberFormat("id-ID").format(target)}
                      </td>
                      <td className="px-4 py-1.5 font-mono text-gray-600">{new Intl.NumberFormat("id-ID").format(calculateInstallment(target, 72))}</td>
                      <td className="px-4 py-1.5 font-mono text-gray-600">{new Intl.NumberFormat("id-ID").format(calculateInstallment(target, 60))}</td>
                      <td className="px-4 py-1.5 font-mono text-gray-600">{new Intl.NumberFormat("id-ID").format(calculateInstallment(target, 48))}</td>
                      <td className="px-4 py-1.5 font-mono text-gray-600">{new Intl.NumberFormat("id-ID").format(calculateInstallment(target, 36))}</td>
                      <td className="px-4 py-1.5 font-mono text-gray-600">{new Intl.NumberFormat("id-ID").format(calculateInstallment(target, 24))}</td>
                      <td className="px-4 py-1.5 font-mono text-gray-600">{new Intl.NumberFormat("id-ID").format(calculateInstallment(target, 12))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">* Besaran angsuran bulanan dihitung otomatis berdasarkan suku bunga target tahunan.</p>
          </div>

          <hr className="border-gray-100" />

          {/* Paket Hari Raya */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <PartyPopper className="w-4 h-4 text-rose-500" />
              Paket Simpanan Hari Raya (Nominal Kelipatan)
            </h4>
            <div className="flex flex-wrap gap-4">
              {paketHariRaya.map((p, index) => (
                <div key={p.id} className="flex items-center gap-0 overflow-hidden border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-rose-500 transition-all bg-white shadow-sm w-full sm:w-auto">
                  <div className="px-3 py-2 bg-gray-50 border-r border-gray-200 text-sm font-bold text-gray-500">
                    Paket {index + 1}
                  </div>
                  <div className="relative w-36">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rp</span>
                    <input type="number" defaultValue={p.amount} className="w-full pl-8 pr-3 py-2 text-sm text-right font-bold text-gray-800 outline-none" />
                  </div>
                  <button className="text-red-400 hover:text-white hover:bg-red-500 px-3 py-2 bg-white transition-colors" title="Hapus Nominal">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button className="px-4 py-2 border border-dashed border-gray-300 text-gray-500 rounded-xl text-sm font-medium hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition-colors flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Tambah Nominal
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 max-w-xl leading-relaxed">
              Ini adalah pilihan besaran nilai untuk 1 paket. Anggota yang mendaftar dapat memilih nominal ini lalu mengalikannya dengan jumlah paket yang diinginkan (misal: 2 paket Rp 50.000 = bayar Rp 100.000/bulan).
            </p>
          </div>

        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end">
           <button className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20 font-medium text-sm">
             <Save className="w-4 h-4" />
             Simpan Pengaturan
           </button>
        </div>
      </div>
    </div>
  );
}

function DatabaseSettings() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Manajemen Database</h3>
            <p className="text-xs text-gray-500">Backup untuk mengamankan data dan Restore untuk mengembalikan data.</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <DownloadCloud className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Backup Database</h4>
                <p className="text-sm text-gray-500 mb-6 px-4">Unduh salinan keseluruhan database Anda untuk disimpan sebagai cadangan. Sangat disarankan untuk dilakukan secara berkala (misal: setiap akhir bulan).</p>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">
                  <DownloadCloud className="w-5 h-5" />
                  Mulai Backup (.sql)
                </button>
             </div>

             <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Restore Database</h4>
                <p className="text-sm text-gray-500 mb-6 px-4">Unggah file backup (.sql) untuk mengembalikan/menimpa database saat ini dengan data dari cadangan tersebut. Harap berhati-hati.</p>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-rose-600 border-2 border-rose-600 font-medium rounded-xl hover:bg-rose-50 transition-colors">
                  <UploadCloud className="w-5 h-5" />
                  Pilih File Restore
                </button>
             </div>
          </div>
        </div>
    </div>
  );
}

function AsuransiSettings() {
  const asuransiData = [
    { usia: "20 - 30", s1: 0.5, s2: 0.55, s3: 0.6, s4: 0.65, s5: 0.7, s6: 0.75 },
    { usia: "31 - 35", s1: 0.55, s2: 0.6, s3: 0.65, s4: 0.7, s5: 0.75, s6: 0.8 },
    { usia: "36 - 40", s1: 0.6, s2: 0.65, s3: 0.7, s4: 0.75, s5: 0.8, s6: 0.85 },
    { usia: "41 - 45", s1: 0.65, s2: 0.7, s3: 0.75, s4: 0.8, s5: 0.85, s6: 0.9 },
    { usia: "46 - 50", s1: 0.7, s2: 0.75, s3: 0.8, s4: 0.85, s5: 0.9, s6: 0.95 },
    { usia: "51 - 55", s1: 0.75, s2: 0.8, s3: 0.85, s4: 0.9, s5: 0.95, s6: 1 },
    { usia: "56 - 60", s1: 0.8, s2: 0.85, s3: 0.9, s4: 0.95, s5: 1, s6: 1.05 },
    { usia: "61 - ∞", s1: 0.85, s2: 0.9, s3: 0.95, s4: 1, s5: 1.05, s6: 1.1 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Asuransi Jiwa Pinjaman Koperasi</h3>
              <p className="text-xs text-gray-500">Tabel persentase asuransi jiwa untuk peminjam berdasarkan usia dan jangka waktu (semester).</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm">
            <Edit3 className="w-4 h-4" /> Edit Matriks
          </button>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-sm text-center">
              <thead className="bg-gray-100/80 border-b border-gray-200">
                <tr>
                  <th rowSpan={2} className="px-4 py-3 border-r border-gray-200 font-bold text-gray-700 align-middle sticky left-0 bg-gray-100/80 z-10 w-48">
                    Rentang Usia (Tahun)
                  </th>
                  <th colSpan={6} className="px-4 py-2 font-bold text-gray-700 border-b border-gray-200">
                    Per Semester (Persentase %)
                  </th>
                </tr>
                <tr>
                  <th className="px-4 py-2 font-bold text-gray-700 border-r border-gray-100">1</th>
                  <th className="px-4 py-2 font-bold text-gray-700 border-r border-gray-100">2</th>
                  <th className="px-4 py-2 font-bold text-gray-700 border-r border-gray-100">3</th>
                  <th className="px-4 py-2 font-bold text-gray-700 border-r border-gray-100">4</th>
                  <th className="px-4 py-2 font-bold text-gray-700 border-r border-gray-100">5</th>
                  <th className="px-4 py-2 font-bold text-gray-700">6</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {asuransiData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-cyan-50/30 transition-colors">
                    <td className="px-4 py-3 border-r border-gray-100 font-bold text-gray-800 sticky left-0 bg-white shadow-[1px_0_5px_-2px_rgba(0,0,0,0.05)] whitespace-nowrap">
                      {row.usia}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600 border-r border-gray-50">{row.s1}</td>
                    <td className="px-4 py-3 font-mono text-gray-600 border-r border-gray-50">{row.s2}</td>
                    <td className="px-4 py-3 font-mono text-gray-600 border-r border-gray-50">{row.s3}</td>
                    <td className="px-4 py-3 font-mono text-gray-600 border-r border-gray-50">{row.s4}</td>
                    <td className="px-4 py-3 font-mono text-gray-600 border-r border-gray-50">{row.s5}</td>
                    <td className="px-4 py-3 font-mono text-gray-600">{row.s6}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3 max-w-2xl leading-relaxed">
            * Angka dalam tabel merupakan persentase yang dikalikan dengan nominal pinjaman pokok. Contoh: Pinjaman Rp 10.000.000 dengan jangka waktu 2 semester untuk usia 35 tahun akan dikenakan biaya asuransi jiwa sebesar 0.6%.
          </p>
        </div>
        
        <div className="p-6 border-t border-gray-100 flex justify-end">
           <button className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors shadow-md shadow-cyan-500/20 font-medium text-sm">
             <Save className="w-4 h-4" />
             Simpan Matriks Asuransi
           </button>
        </div>
    </div>
  );
}

