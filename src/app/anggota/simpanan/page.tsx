"use client";

import { 
  Wallet,
  PiggyBank,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  History,
  Filter
} from "lucide-react";
import { useState } from "react";

const simpananData = [
  { id: '1', title: "Simpanan Pokok", amount: "Rp 1.000.000", icon: Wallet, desc: "Simpanan awal keanggotaan (Lunas)", color: "emerald" },
  { id: '2', title: "Simpanan Wajib", amount: "Rp 6.500.000", icon: PiggyBank, desc: "Simpanan rutin bulanan", color: "blue" },
  { id: '3', title: "Simpanan Manasuka", amount: "Rp 5.000.000", icon: Coins, desc: "Simpanan sukarela, dapat ditarik", color: "amber" },
];

const transactionHistory = [
  { id: 1, type: 'setor', category: 'Wajib', amount: 'Rp 100.000', date: '25 Jul 2026', status: 'Berhasil', ref: 'TRX-998231' },
  { id: 2, type: 'setor', category: 'Manasuka', amount: 'Rp 500.000', date: '12 Jul 2026', status: 'Berhasil', ref: 'TRX-998150' },
  { id: 3, type: 'tarik', category: 'Manasuka', amount: 'Rp 1.500.000', date: '05 Jul 2026', status: 'Berhasil', ref: 'TRX-997842' },
  { id: 4, type: 'setor', category: 'Wajib', amount: 'Rp 100.000', date: '25 Jun 2026', status: 'Berhasil', ref: 'TRX-996521' },
  { id: 5, type: 'setor', category: 'Pokok', amount: 'Rp 1.000.000', date: '10 Jan 2025', status: 'Berhasil', ref: 'TRX-901234' },
];

export default function SimpananPage() {
  const [filter, setFilter] = useState('Semua');
  
  const totalSimpanan = "Rp 12.500.000";

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Simpanan Saya</h2>
          <p className="text-sm text-gray-500">Kelola dan pantau seluruh simpanan Anda di koperasi.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
            <Download className="w-4 h-4" />
            Riwayat
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white mb-6 shadow-lg shadow-emerald-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <p className="text-emerald-100 font-medium mb-1">Total Saldo Simpanan</p>
            <h3 className="text-4xl font-bold font-heading">{totalSimpanan}</h3>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {simpananData.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${item.color}-50 rounded-full blur-2xl group-hover:bg-${item.color}-100 transition-colors`}></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl shrink-0 bg-${item.color}-50 flex items-center justify-center text-${item.color}-500`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{item.title}</p>
                <h4 className="text-xl font-bold text-gray-900 mt-0.5">{item.amount}</h4>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
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
              <option value="Semua">Semua Kategori</option>
              <option value="Pokok">Simpanan Pokok</option>
              <option value="Wajib">Simpanan Wajib</option>
              <option value="Manasuka">Simpanan Manasuka</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4 pl-6">Transaksi</th>
                <th className="p-4">Kategori</th>
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
                        trx.type === 'setor' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {trx.type === 'setor' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {trx.type === 'setor' ? 'Setoran' : 'Penarikan'}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{trx.ref}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                      {trx.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {trx.date}
                  </td>
                  <td className={`p-4 text-right font-bold text-sm pr-6 ${
                    trx.type === 'setor' ? 'text-emerald-600' : 'text-gray-900'
                  }`}>
                    {trx.type === 'setor' ? '+' : '-'}{trx.amount}
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
