"use client";

import { useState } from "react";
import { 
  Download,
  Filter,
  Printer,
  Wallet,
  Scale
} from "lucide-react";

// Struktur COA Neraca dari Pengaturan
const ASET_LANCAR_COA = [
  "Kas Simpan Pinjam",
  "Kas Pusat",
  "Bank",
  "Toko",
  "Piutang Pinjaman Anggota"
];

const ASET_TETAP_COA = [
  "Inventaris",
  "Akumulasi Penyusutan Inventaris"
];

const KEWAJIBAN_LANCAR_COA = [
  "Beban yang akan dibayar",
  "Manasuka",
  "Tabungan Pendidikan"
];

const DANA_COA = [
  "Pendidikan",
  "Pengurus",
  "Kesejahteraan Pegawai",
  "Sosial",
  "Pemdaker"
];

const EKUITAS_COA = [
  "Simpanan Pokok",
  "Simpanan Wajib",
  "Toko",
  "Dana Cadangan",
  "Seragam",
  "SHU Tahun Berjalan"
];

// Helper angka ribuan
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(angka);
};

// Dummy Data Neraca (Balanced at Rp 1,135,000,000)
const DUMMY_ASET_LANCAR: Record<string, number> = {
  "Kas Simpan Pinjam": 250000000,
  "Kas Pusat": 50000000,
  "Bank": 150000000,
  "Toko": 25000000,
  "Piutang Pinjaman Anggota": 600000000,
};

const DUMMY_ASET_TETAP: Record<string, number> = {
  "Inventaris": 75000000,
  "Akumulasi Penyusutan Inventaris": -15000000,
};

const DUMMY_KEWAJIBAN_LANCAR: Record<string, number> = {
  "Beban yang akan dibayar": 5000000,
  "Manasuka": 125000000,
  "Tabungan Pendidikan": 55000000,
};

const DUMMY_DANA: Record<string, number> = {
  "Pendidikan": 10000000,
  "Pengurus": 25000000,
  "Kesejahteraan Pegawai": 15000000,
  "Sosial": 5000000,
  "Pemdaker": 5000000,
};

const DUMMY_EKUITAS: Record<string, number> = {
  "Simpanan Pokok": 150000000,
  "Simpanan Wajib": 350000000,
  "Toko": 50000000,
  "Dana Cadangan": 120000000,
  "Seragam": 20000000,
  "SHU Tahun Berjalan": 200000000,
};

  export default function LaporanNeracaPage() {
  const [selectedYear, setSelectedYear] = useState("2026");

  // Kalkulasi
  const totalAsetLancar = ASET_LANCAR_COA.reduce((sum, coa) => sum + (DUMMY_ASET_LANCAR[coa] || 0), 0);
  const totalAsetTetap = ASET_TETAP_COA.reduce((sum, coa) => sum + (DUMMY_ASET_TETAP[coa] || 0), 0);
  const totalAset = totalAsetLancar + totalAsetTetap;

  const totalKewajibanLancar = KEWAJIBAN_LANCAR_COA.reduce((sum, coa) => sum + (DUMMY_KEWAJIBAN_LANCAR[coa] || 0), 0);
  const totalDana = DANA_COA.reduce((sum, coa) => sum + (DUMMY_DANA[coa] || 0), 0);
  const totalKewajiban = totalKewajibanLancar + totalDana;

  const totalEkuitas = EKUITAS_COA.reduce((sum, coa) => sum + (DUMMY_EKUITAS[coa] || 0), 0);
  const totalPasiva = totalKewajiban + totalEkuitas;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Laporan Neraca</h2>
          <p className="text-gray-500 text-sm mt-1">Laporan posisi keuangan (Aset, Kewajiban, Ekuitas) per akhir tahun buku terpilih.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* KOLOM KIRI: ASET */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden flex flex-col h-full">
          <div className="bg-emerald-500 text-white font-bold px-6 py-4 flex items-center gap-2 text-lg">
             <Wallet className="w-5 h-5" /> ASET (AKTIVA)
          </div>
          
          <div className="flex-1 p-6 space-y-6">
            
            {/* Aset Lancar */}
            <div>
              <h4 className="font-bold text-emerald-800 border-b border-emerald-100 pb-2 mb-3">Aset Lancar</h4>
              <div className="space-y-2">
                {ASET_LANCAR_COA.map((coa, idx) => {
                  const nominal = DUMMY_ASET_LANCAR[coa] || 0;
                  if (nominal === 0) return null;
                  return (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{coa}</span>
                      <span className="font-medium text-gray-900">{formatRupiah(nominal)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg mt-3">
                <span>Total Aset Lancar</span>
                <span>{formatRupiah(totalAsetLancar)}</span>
              </div>
            </div>

            {/* Aset Tetap */}
            <div>
              <h4 className="font-bold text-emerald-800 border-b border-emerald-100 pb-2 mb-3">Aset Tetap</h4>
              <div className="space-y-2">
                {ASET_TETAP_COA.map((coa, idx) => {
                  const nominal = DUMMY_ASET_TETAP[coa] || 0;
                  if (nominal === 0) return null;
                  return (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{coa}</span>
                      <span className={`font-medium ${nominal < 0 ? 'text-red-500' : 'text-gray-900'}`}>{formatRupiah(nominal)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg mt-3">
                <span>Total Aset Tetap</span>
                <span>{formatRupiah(totalAsetTetap)}</span>
              </div>
            </div>

          </div>

          {/* Footer Total Aset */}
          <div className="bg-emerald-600 px-6 py-5 text-white flex justify-between items-center mt-auto">
            <span className="font-bold text-lg">TOTAL ASET</span>
            <span className="font-black text-xl">{formatRupiah(totalAset)}</span>
          </div>
        </div>

        {/* KOLOM KANAN: KEWAJIBAN & EKUITAS */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden flex flex-col h-full">
          <div className="bg-blue-600 text-white font-bold px-6 py-4 flex items-center gap-2 text-lg">
             <Scale className="w-5 h-5" /> KEWAJIBAN & EKUITAS (PASIVA)
          </div>
          
          <div className="flex-1 p-6 space-y-6">
            
            {/* Kewajiban Lancar */}
            <div>
              <h4 className="font-bold text-blue-900 border-b border-blue-100 pb-2 mb-3">Kewajiban Lancar</h4>
              <div className="space-y-2">
                {KEWAJIBAN_LANCAR_COA.map((coa, idx) => {
                  const nominal = DUMMY_KEWAJIBAN_LANCAR[coa] || 0;
                  if (nominal === 0) return null;
                  return (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{coa}</span>
                      <span className="font-medium text-gray-900">{formatRupiah(nominal)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dana */}
            <div>
              <h4 className="font-bold text-blue-900 border-b border-blue-100 pb-2 mb-3">Dana-Dana</h4>
              <div className="space-y-2">
                {DANA_COA.map((coa, idx) => {
                  const nominal = DUMMY_DANA[coa] || 0;
                  if (nominal === 0) return null;
                  return (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{coa}</span>
                      <span className="font-medium text-gray-900">{formatRupiah(nominal)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-blue-800 bg-blue-50 px-3 py-2 rounded-lg mt-3">
              <span>Total Kewajiban</span>
              <span>{formatRupiah(totalKewajiban)}</span>
            </div>

            {/* Ekuitas */}
            <div>
              <h4 className="font-bold text-blue-900 border-b border-blue-100 pb-2 mb-3">Ekuitas / Modal</h4>
              <div className="space-y-2">
                {EKUITAS_COA.map((coa, idx) => {
                  const nominal = DUMMY_EKUITAS[coa] || 0;
                  if (nominal === 0) return null;
                  return (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{coa}</span>
                      <span className="font-medium text-gray-900">{formatRupiah(nominal)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-blue-800 bg-blue-50 px-3 py-2 rounded-lg mt-3">
                <span>Total Ekuitas</span>
                <span>{formatRupiah(totalEkuitas)}</span>
              </div>
            </div>

          </div>

          {/* Footer Total Kewajiban & Ekuitas */}
          <div className="bg-blue-700 px-6 py-5 text-white flex justify-between items-center mt-auto">
            <span className="font-bold text-lg">TOTAL PASIVA</span>
            <span className="font-black text-xl">{formatRupiah(totalPasiva)}</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
