"use client";

import { useState } from "react";
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Save, 
  Info,
  Database
} from "lucide-react";
import { motion } from "framer-motion";

export default function SetupSaldoPage() {
  const [activeTab, setActiveTab] = useState<"import" | "manual">("import");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Manual Input State
  const [saldoAwal, setSaldoAwal] = useState({
    kasTunai: "0",
    bankBCA: "0",
    bankMandiri: "0",
    modalKoperasi: "0",
    danaCadangan: "0",
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      alert("File berhasil diproses. 145 Data anggota dan saldo berhasil disinkronkan.");
      setFile(null);
    }, 2000);
  };

  const handleSaveManual = () => {
    alert("Saldo awal koperasi berhasil disimpan!");
  };

  const formatRupiah = (val: string) => {
    const num = parseInt(val.replace(/[^0-9]/g, '')) || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Setup Saldo Awal & Migrasi</h2>
        <p className="text-sm text-gray-500 mt-1">Masukkan data keuangan koperasi dari sistem/buku sebelumnya ke sistem baru.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 p-1 bg-white border border-gray-200 rounded-xl w-max">
        <button
          onClick={() => setActiveTab("import")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "import" 
              ? "bg-blue-50 text-blue-600 shadow-sm" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Import Excel / CSV
        </button>
        <button
          onClick={() => setActiveTab("manual")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "manual" 
              ? "bg-emerald-50 text-emerald-600 shadow-sm" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Database className="w-4 h-4" />
          Setup Saldo Koperasi
        </button>
      </div>

      {/* Tab 1: Import Excel */}
      {activeTab === "import" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Import Data Anggota & Simpanan</h3>
            <p className="text-sm text-gray-500 mt-1">Gunakan template Excel untuk memasukkan data seluruh anggota sekaligus.</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: Instructions */}
              <div className="md:w-1/3 space-y-6">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-blue-900 mb-1">Cara Import Data:</h4>
                      <ol className="text-sm text-blue-800 space-y-2 list-decimal pl-4">
                        <li>Unduh template Excel yang kami sediakan.</li>
                        <li>Isi data anggota dan saldo pada kolom yang tersedia tanpa mengubah format judul kolom.</li>
                        <li>Simpan file dan unggah kembali ke area di samping.</li>
                        <li>Klik <b>Mulai Import</b>.</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <button className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <Download className="w-4 h-4" />
                  Unduh Template Excel
                </button>
              </div>

              {/* Right Column: Upload Area */}
              <div className="md:w-2/3">
                <div 
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors ${
                    file ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <FileSpreadsheet className="w-8 h-8" />
                      </div>
                      <p className="font-semibold text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                      <button 
                        onClick={() => setFile(null)}
                        className="mt-4 text-sm font-medium text-red-500 hover:text-red-600"
                      >
                        Ganti File
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Tarik & Lepas File ke Sini</h4>
                      <p className="text-xs text-gray-500 mb-6 max-w-[200px]">Format yang didukung: .xlsx, .xls, .csv</p>
                      <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">
                        <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                        Pilih File dari Komputer
                      </label>
                    </>
                  )}
                </div>

                {file && (
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      {isUploading ? 'Memproses Data...' : 'Mulai Import Data'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Setup Saldo Manual */}
      {activeTab === "manual" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Setup Saldo Koperasi (Jurnal)</h3>
              <p className="text-sm text-gray-500 mt-1">Masukkan total aset dan ekuitas awal koperasi secara global.</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Kolom Aset */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900">Aset Kas & Bank (Debit)</h4>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Kas Tunai (Toko/Kasir)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-medium">Rp</div>
                    <input 
                      type="text" 
                      value={formatRupiah(saldoAwal.kasTunai).replace('Rp', '').trim()}
                      onChange={(e) => setSaldoAwal({...saldoAwal, kasTunai: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Saldo Bank BCA
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-medium">Rp</div>
                    <input 
                      type="text" 
                      value={formatRupiah(saldoAwal.bankBCA).replace('Rp', '').trim()}
                      onChange={(e) => setSaldoAwal({...saldoAwal, bankBCA: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Saldo Bank Mandiri
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-medium">Rp</div>
                    <input 
                      type="text" 
                      value={formatRupiah(saldoAwal.bankMandiri).replace('Rp', '').trim()}
                      onChange={(e) => setSaldoAwal({...saldoAwal, bankMandiri: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    />
                  </div>
                </div>
              </div>

              {/* Kolom Modal/Ekuitas */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900">Ekuitas & Kewajiban (Kredit)</h4>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Modal Disetor Koperasi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-medium">Rp</div>
                    <input 
                      type="text" 
                      value={formatRupiah(saldoAwal.modalKoperasi).replace('Rp', '').trim()}
                      onChange={(e) => setSaldoAwal({...saldoAwal, modalKoperasi: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Dana Cadangan (SHU Lalu)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-medium">Rp</div>
                    <input 
                      type="text" 
                      value={formatRupiah(saldoAwal.danaCadangan).replace('Rp', '').trim()}
                      onChange={(e) => setSaldoAwal({...saldoAwal, danaCadangan: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-500">Status Balance: </span>
                <span className="font-bold text-emerald-600">Seimbang (Balanced)</span>
              </div>
              <button 
                onClick={handleSaveManual}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Simpan Saldo Awal
              </button>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
