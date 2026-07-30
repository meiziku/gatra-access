"use client";

import { 
  CreditCard,
  Receipt,
  ArrowDownRight,
  Download,
  History,
  Filter,
  CalendarClock,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

const activeLoans = [
  { 
    id: '1', 
    title: "Pinjaman Pendidikan", 
    total: "Rp 15.000.000", 
    remaining: "Rp 3.850.000",
    installment: "Rp 550.000",
    tenor: 24,
    paid: 20,
    nextDueDate: "31 Jul 2026",
    progress: 83,
    status: "Lancar"
  },
  { 
    id: '2', 
    title: "Pinjaman Renovasi Rumah", 
    total: "Rp 25.000.000", 
    remaining: "Rp 20.500.000",
    installment: "Rp 1.500.000",
    tenor: 24,
    paid: 3,
    nextDueDate: "15 Agu 2026",
    progress: 12,
    status: "Lancar"
  }
];

const transactionHistory = [
  { id: 1, type: 'angsuran', title: 'Pembayaran Angsuran ke-20', amount: 'Rp 550.000', date: '30 Jun 2026', status: 'Selesai', ref: 'ANG-998231' },
  { id: 2, type: 'angsuran', title: 'Pembayaran Angsuran ke-19', amount: 'Rp 550.000', date: '31 Mei 2026', status: 'Selesai', ref: 'ANG-998150' },
  { id: 3, type: 'angsuran', title: 'Pembayaran Angsuran ke-18', amount: 'Rp 550.000', date: '30 Apr 2026', status: 'Selesai', ref: 'ANG-997842' },
  { id: 4, type: 'angsuran', title: 'Pembayaran Angsuran ke-17', amount: 'Rp 550.000', date: '31 Mar 2026', status: 'Selesai', ref: 'ANG-996521' },
  { id: 5, type: 'pencairan', title: 'Pencairan Pinjaman', amount: 'Rp 15.000.000', date: '01 Nov 2024', status: 'Selesai', ref: 'CAIR-901234' },
];

export default function PinjamanPage() {
  const [filter, setFilter] = useState('Semua');
  
  const totalSisaPinjaman = "Rp 3.850.000";

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Pinjaman Saya</h2>
          <p className="text-sm text-gray-500">Kelola dan pantau seluruh fasilitas pinjaman Anda.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
            <Download className="w-4 h-4" />
            Riwayat
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-6 shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <p className="text-blue-100 font-medium mb-1">Total Sisa Pinjaman</p>
            <h3 className="text-4xl font-bold font-heading">{totalSisaPinjaman}</h3>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/20">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <CalendarClock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-100 mb-0.5">Tagihan Terdekat</p>
              <p className="font-bold text-white">Rp 550.000 <span className="text-xs font-normal opacity-80">(31 Jul)</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Loans */}
      <h3 className="text-lg font-bold text-gray-900 font-heading mb-4">Pinjaman Aktif</h3>
      <div className="grid grid-cols-1 gap-4 mb-8">
        {activeLoans.map((loan) => (
          <div key={loan.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              
              {/* Info Kiri */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 leading-tight">{loan.title}</h4>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {loan.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Pinjaman</p>
                    <p className="text-sm font-semibold text-gray-900">{loan.total}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Cicilan per Bulan</p>
                    <p className="text-sm font-semibold text-gray-900">{loan.installment}</p>
                  </div>
                </div>
              </div>

              {/* Progress Kanan */}
              <div className="flex-1 md:border-l md:border-gray-100 md:pl-6 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Sisa Pinjaman</p>
                    <p className="text-lg font-bold text-gray-900">{loan.remaining}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">{loan.progress}%</p>
                    <p className="text-xs text-gray-400">Terbayar</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${loan.progress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Tenor berjalan: <strong className="text-gray-900">{loan.paid}</strong> dari <strong className="text-gray-900">{loan.tenor}</strong> bulan
                </p>
              </div>

              {/* Aksi */}
              <div className="flex md:flex-col justify-end md:justify-center md:border-l md:border-gray-100 md:pl-6 gap-2 w-full md:w-auto mt-4 md:mt-0">
                 <button className="flex-1 md:flex-none px-6 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                   Detail
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-gray-900">
            <History className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold font-heading">Riwayat Transaksi</h3>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-50 border-none text-sm text-gray-600 rounded-lg focus:ring-0 py-1.5 px-3 w-full sm:w-auto"
            >
              <option value="Semua">Semua Transaksi</option>
              <option value="Angsuran">Angsuran</option>
              <option value="Pencairan">Pencairan</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4 pl-6">Transaksi</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4 text-right pr-6">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactionHistory.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        trx.type === 'pencairan' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {trx.type === 'pencairan' ? <ArrowDownRight className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {trx.title}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{trx.ref}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {trx.date}
                  </td>
                  <td className={`p-4 text-right font-bold text-sm pr-6 ${
                    trx.type === 'pencairan' ? 'text-emerald-600' : 'text-gray-900'
                  }`}>
                    {trx.type === 'pencairan' ? '+' : '-'}{trx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-50 bg-gray-50/30 text-center">
          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
            Muat Lebih Banyak
          </button>
        </div>
      </div>
    </>
  );
}
