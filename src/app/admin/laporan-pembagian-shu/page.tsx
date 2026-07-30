"use client";

import { useState } from "react";
import { 
  Download,
  Filter,
  Printer,
  FileText
} from "lucide-react";

// Helper angka ribuan
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0
  }).format(angka);
};

// Data Alokasi SHU
const ALOKASI_SHU = [
  { no: 1, nama: "Jasa Modal (Simpanan) Anggota", persentase: 25 },
  { no: 2, nama: "Jasa Usaha Anggota - Simpan Pinjam", persentase: 50 },
  { no: 3, nama: "Dana Pemdaker", persentase: 2.5 },
  { no: 4, nama: "Dana Pengurus", persentase: 5 },
  { no: 5, nama: "Dana Kesejahteraan Pegawai", persentase: 2.5 },
  { no: 6, nama: "Dana Pendidikan", persentase: 2.5 },
  { no: 7, nama: "Dana Sosial", persentase: 2.5 },
  { no: 8, nama: "Dana Cadangan", persentase: 10 },
];

export default function LaporanPembagianSHUPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  
  // State untuk input base SHU
  const [baseShuString, setBaseShuString] = useState("124.835.601");
  
  // Mengonversi input string (dengan titik) menjadi number
  const baseShu = parseInt(baseShuString.replace(/\./g, "")) || 0;

  // Handler input format ribuan
  const handleShuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue) {
      setBaseShuString("");
      return;
    }
    const formatted = new Intl.NumberFormat("id-ID").format(parseInt(rawValue));
    setBaseShuString(formatted);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Laporan Pembagian SHU</h2>
          <p className="text-gray-500 text-sm mt-1">Rincian alokasi Sisa Hasil Usaha (SHU) berdasarkan persentase dana bagian.</p>
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
        
        {/* Spreadsheet Header / Title */}
        <div className="bg-black text-white px-6 py-4 flex items-center gap-3">
           <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
             <FileText className="w-4 h-4 text-blue-300" />
           </div>
           <h3 className="font-bold tracking-wider text-sm sm:text-base uppercase">LAPORAN ALOKASI SHU | EKUITAS</h3>
        </div>

        <div className="p-8">
           {/* Kop Laporan */}
           <div className="text-center mb-10">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase">KOPERASI GATRA TEKNIKA</h2>
              <h4 className="text-sm font-bold text-gray-800 mt-2 uppercase">Laporan Alokasi SHU</h4>
              <p className="text-sm font-bold text-gray-800 mt-1">1 Januari - 31 Desember {selectedYear}</p>
           </div>

           {/* Input Total SHU */}
           <div className="flex border-2 border-gray-900 mb-6">
              <div className="bg-gray-100 font-bold text-gray-800 px-4 py-2 border-r-2 border-gray-900 flex items-center flex-1">
                Total SHU
              </div>
              <div className="flex-[2] relative">
                <input 
                  type="text" 
                  value={baseShuString}
                  onChange={handleShuChange}
                  className="w-full h-full px-4 py-2 font-bold text-gray-900 text-right focus:outline-none focus:bg-blue-50 transition-colors"
                />
              </div>
           </div>

           {/* Tabel Alokasi */}
           <table className="w-full border-collapse border-2 border-gray-900">
             <thead>
               <tr className="bg-gray-100 font-bold text-gray-800">
                 <th className="border-2 border-gray-900 px-3 py-2 text-center w-12">No</th>
                 <th className="border-2 border-gray-900 px-4 py-2 text-left">Alokasi</th>
                 <th className="border-2 border-gray-900 px-4 py-2 text-center w-32">Persentase</th>
                 <th className="border-2 border-gray-900 px-4 py-2 text-right w-48">Nilai</th>
               </tr>
             </thead>
             <tbody>
               {ALOKASI_SHU.map((item) => {
                 const nilaiAlokasi = (baseShu * item.persentase) / 100;
                 return (
                   <tr key={item.no} className="hover:bg-gray-50/50">
                     <td className="border border-gray-900 px-3 py-2 text-center font-medium text-gray-700">{item.no}</td>
                     <td className="border border-gray-900 px-4 py-2 text-gray-800">{item.nama}</td>
                     <td className="border border-gray-900 px-4 py-2 text-center text-gray-700 font-medium">{item.persentase}%</td>
                     <td className="border border-gray-900 px-4 py-2 text-right text-gray-900 font-medium tracking-wide">
                       {formatRupiah(nilaiAlokasi)}
                     </td>
                   </tr>
                 );
               })}
             </tbody>
             <tfoot>
               <tr>
                 <td colSpan={3} className="border-2 border-gray-900 bg-black text-white px-4 py-3 text-center font-bold tracking-widest text-sm uppercase">
                   Total
                 </td>
                 <td className="border-2 border-gray-900 px-4 py-3 text-right font-black text-gray-900 tracking-wide bg-gray-50">
                   {formatRupiah(baseShu)}
                 </td>
               </tr>
             </tfoot>
           </table>
        </div>
      </div>
      
    </div>
  );
}
