"use client";

import { useState } from "react";
import { Search, Filter, Download, CreditCard, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2, ChevronRight, HandCoins, X } from "lucide-react";
import { useAnggota } from "@/context/AnggotaContext";

// Mock Data
export default function LaporanPinjamanPage() {
  const { transactions } = useAnggota();
  const [searchQuery, setSearchQuery] = useState("");
  const [showBelumLunas, setShowBelumLunas] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  const dummyData: any[] = [];
  let summaryPlafon = 0;
  let summarySisaPokok = 0;
  let summaryJasa = 0;
  let nplCount = 0;

  if (transactions) {
    const loanTxs = transactions.filter(t => t.description === "Pinjaman (Pencairan)");
    loanTxs.forEach(loan => {
      const plafon = Math.max(loan.kredit, loan.debit);
      
      const angsuranList = transactions.filter(t => t.description === "Angsuran Pinjaman" && t.id.includes(loan.id));
      const jasaList = transactions.filter(t => t.description === "Jasa / Bunga" && t.id.includes(loan.id));
      
      let totalAngsuran = 0;
      let totalJasa = 0;
      
      angsuranList.forEach(a => totalAngsuran += Math.max(a.debit, a.kredit));
      jasaList.forEach(a => totalJasa += Math.max(a.debit, a.kredit));
      
      const sisaPokok = Math.max(0, plafon - totalAngsuran);
      const tenorSisa = Math.max(0, (loan.tenor || 0) - angsuranList.length);
      const status = sisaPokok <= 0 ? "Lunas" : (tenorSisa <= 0 && sisaPokok > 0 ? "Macet" : "Lancar");

      summaryPlafon += plafon;
      summarySisaPokok += sisaPokok;
      summaryJasa += totalJasa; // or potential interest? We just use total collected for now
      if (status === "Macet" || status === "Diragukan") nplCount++;

      dummyData.push({
        id: loan.memberId || "-",
        nama: loan.member ? (loan.member.includes(" - ") ? loan.member.split(" - ")[1] : loan.member) : "Umum",
        noRef: loan.id,
        tglCair: loan.date,
        plafon,
        sisaPokok,
        tenorSisa,
        status,
        angsuranList
      });
    });
  }

  const nplPercentage = dummyData.length > 0 ? ((nplCount / dummyData.length) * 100).toFixed(1) : "0";

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
  };

  const filteredData = dummyData.filter(d => {
    const matchSearch = d.nama.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBelumLunas = showBelumLunas ? d.status !== "Lunas" : true;
    const matchStatus = filterStatus ? d.status === filterStatus : true;
    return matchSearch && matchBelumLunas && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Lancar": return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 shadow-sm flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Lancar</span>;
      case "Lunas": return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200 shadow-sm flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Lunas</span>;
      case "Kurang Lancar": return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 shadow-sm flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Kurang Lancar</span>;
      case "Diragukan": return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200 shadow-sm flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Diragukan</span>;
      case "Macet": return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold border border-rose-200 shadow-sm flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Macet</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Background Decorator */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] -z-10 bg-gradient-to-b from-blue-100/70 to-transparent -mx-8 -mt-8 pointer-events-none rounded-t-3xl" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Laporan Pinjaman</h2>
            <p className="text-gray-500 text-sm mt-1">Pemantauan kolektibilitas dan sisa pokok pinjaman anggota.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm">
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Pinjaman Aktif" 
          value={formatCurrency(summaryPlafon)} 
          sub={`${dummyData.filter(d => d.status !== "Lunas").length} Anggota`} 
          icon={ArrowUpRight} 
          color="blue" 
        />
        <MetricCard 
          title="Total Sisa Pokok" 
          value={formatCurrency(summarySisaPokok)} 
          sub="Belum Terbayar" 
          icon={HandCoins} 
          color="amber" 
        />
        <MetricCard 
          title="Total Jasa / Bunga" 
          value={formatCurrency(summaryJasa)} 
          sub="Pendapatan Diterima" 
          icon={ArrowDownRight} 
          color="emerald" 
        />
        <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <AlertTriangle className="w-16 h-16 text-rose-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-rose-600 mb-1">Kredit Bermasalah (NPL)</p>
            <h4 className="text-2xl font-black text-gray-800">{nplPercentage}%</h4>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-rose-500 bg-rose-50 w-max px-2 py-1 rounded-md">
              <span>Macet & Diragukan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari nama atau ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex w-full md:w-auto items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 font-medium cursor-pointer">
              <input 
                type="checkbox"
                checked={showBelumLunas}
                onChange={(e) => setShowBelumLunas(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              Hanya tampilkan yang belum lunas
            </label>
            <div className="relative flex-1 md:flex-none">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-4 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="Lancar">Lancar</option>
                <option value="Kurang Lancar">Kurang Lancar</option>
                <option value="Diragukan">Diragukan</option>
                <option value="Macet">Macet</option>
                <option value="Lunas">Lunas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Anggota & ID</th>
                <th className="px-6 py-4 font-bold">No. Referensi & Tanggal Cair</th>
                <th className="px-6 py-4 font-bold text-right">Plafon</th>
                <th className="px-6 py-4 font-bold text-right">Sisa Pokok</th>
                <th className="px-6 py-4 font-bold text-center">Tenor Sisa</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => setSelectedDetail(row)}
                    className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{row.nama}</div>
                      <div className="text-xs text-gray-500">{row.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-700">{row.noRef}</div>
                      <div className="text-xs text-gray-500">{row.tglCair}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-gray-700">
                      {formatCurrency(row.plafon)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-blue-700">
                      {formatCurrency(row.sisaPokok)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs">
                        {row.tenorSisa} / {row.tenorTotal} bln
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">{getStatusBadge(row.status)}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data pinjaman yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pinjaman */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Detail Pinjaman</h3>
                <p className="text-sm text-gray-500">{selectedDetail.noRef} • {selectedDetail.nama}</p>
              </div>
              <button onClick={() => setSelectedDetail(null)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Ringkasan */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Total Plafon</p>
                  <p className="font-bold text-gray-800">{formatCurrency(selectedDetail.plafon)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Sisa Pokok</p>
                  <p className="font-bold text-blue-700">{formatCurrency(selectedDetail.sisaPokok)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Progress Tenor</p>
                  <p className="font-bold text-gray-800">{selectedDetail.tenorTotal - selectedDetail.tenorSisa} / {selectedDetail.tenorTotal} Bln</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center">
                  <p className="text-xs text-gray-500 mb-1">Status Kelancaran</p>
                  <div>{getStatusBadge(selectedDetail.status)}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                  <span>Progres Pelunasan Pokok</span>
                  <span>{Math.round(((selectedDetail.plafon - selectedDetail.sisaPokok) / selectedDetail.plafon) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${((selectedDetail.plafon - selectedDetail.sisaPokok) / selectedDetail.plafon) * 100}%` }}
                  />
                </div>
              </div>

              {/* Riwayat Pembayaran (Dummy) */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Riwayat Pembayaran Terakhir</h4>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-3">Tanggal</th>
                        <th className="px-4 py-3">Angsuran Ke</th>
                        <th className="px-4 py-3 text-right">Pokok</th>
                        <th className="px-4 py-3 text-right">Bunga/Jasa</th>
                        <th className="px-4 py-3 text-right">Total Bayar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Array.from({ length: Math.min(5, selectedDetail.tenorTotal - selectedDetail.tenorSisa) }).map((_, i) => {
                        let monthStr = (new Date().getMonth() - i <= 0 ? 12 + (new Date().getMonth() - i) : new Date().getMonth() - i).toString().padStart(2, '0');
                        let year = new Date().getMonth() - i <= 0 ? new Date().getFullYear() - 1 : new Date().getFullYear();
                        return (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-700">10-{monthStr}-{year}</td>
                            <td className="px-4 py-3 text-gray-600">Bulan ke-{selectedDetail.tenorTotal - selectedDetail.tenorSisa - i}</td>
                            <td className="px-4 py-3 text-right font-mono text-gray-600">{formatCurrency(selectedDetail.plafon / selectedDetail.tenorTotal)}</td>
                            <td className="px-4 py-3 text-right font-mono text-gray-600">{formatCurrency((selectedDetail.plafon * 0.015))}</td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-gray-800">{formatCurrency((selectedDetail.plafon / selectedDetail.tenorTotal) + (selectedDetail.plafon * 0.015))}</td>
                          </tr>
                        );
                      })}
                      {selectedDetail.tenorTotal - selectedDetail.tenorSisa === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Belum ada riwayat pembayaran.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function MetricCard({ title, value, sub, icon: Icon, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };
  
  const iconColorMap: any = {
    blue: "text-blue-500",
    emerald: "text-emerald-500",
    amber: "text-amber-500",
  };

  return (
    <div className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow`}>
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 ${iconColorMap[color]}`}>
        <Icon className="w-16 h-16" />
      </div>
      <div className="relative z-10">
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h4 className="text-2xl font-black text-gray-800">{value}</h4>
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium w-max px-2 py-1 rounded-md ${colorMap[color]}`}>
          <span>{sub}</span>
        </div>
      </div>
    </div>
  );
}
