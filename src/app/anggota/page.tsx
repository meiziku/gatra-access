"use client";

import { 
  Wallet, 
  CreditCard, 
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  AlertCircle,
  PiggyBank,
  Coins,
  Banknote,
  TrendingUp
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const chartData = [
  { name: 'Jan', simpanan: 4000, pinjaman: 2400 },
  { name: 'Feb', simpanan: 4500, pinjaman: 2200 },
  { name: 'Mar', simpanan: 5000, pinjaman: 2000 },
  { name: 'Apr', simpanan: 5500, pinjaman: 1800 },
  { name: 'Mei', simpanan: 6000, pinjaman: 1600 },
  { name: 'Jun', simpanan: 6500, pinjaman: 1400 },
  { name: 'Jul', simpanan: 7000, pinjaman: 1200 },
];

const recentActivity = [
  { id: 1, type: 'simpanan', title: 'Setoran Simpanan Wajib', amount: 'Rp 100.000', date: '25 Jul 2026, 09:30', status: 'Selesai' },
  { id: 2, type: 'pinjaman', title: 'Pencairan Pinjaman Pendidikan', amount: 'Rp 5.000.000', date: '24 Jul 2026, 14:15', status: 'Selesai' },
  { id: 3, type: 'angsuran', title: 'Pembayaran Angsuran ke-3', amount: 'Rp 550.000', date: '22 Jul 2026, 11:00', status: 'Selesai' },
  { id: 4, type: 'shu', title: 'Pembagian SHU 2025', amount: 'Rp 1.250.000', date: '01 Jul 2026, 08:00', status: 'Selesai' },
];

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Ringkasan Keuangan Anda</h2>
          <p className="text-sm text-gray-500">Pantau performa simpanan dan pinjaman Anda secara real-time.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
            <Download className="w-4 h-4" />
            Unduh Laporan
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[
          { title: "Simpanan Pokok", amount: "Rp 1.000.000", icon: Wallet, trend: "Lunas", trendLabel: "dibayar di awal", isUp: true, color: "emerald" },
          { title: "Simpanan Wajib", amount: "Rp 6.500.000", icon: PiggyBank, trend: "+Rp 100.000", trendLabel: "bulan ini", isUp: true, color: "emerald" },
          { title: "Simpanan Manasuka", amount: "Rp 5.000.000", icon: Coins, trend: "+Rp 250.000", trendLabel: "bulan ini", isUp: true, color: "emerald" },
          { title: "Sisa Pinjaman", amount: "Rp 3.850.000", icon: CreditCard, trend: "-Rp 550.000", trendLabel: "bulan ini", isUp: true, color: "blue" },
          { title: "Tagihan Bulan Ini", amount: "Rp 550.000", icon: Receipt, trend: "5 hari lagi", trendLabel: "jatuh tempo", isUp: false, color: "rose", highlight: true },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-5 rounded-2xl border ${stat.highlight ? 'border-rose-200 ring-1 ring-rose-100' : 'border-gray-100'} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${stat.color}-50 rounded-full blur-2xl group-hover:bg-${stat.color}-100 transition-colors`}></div>
            
            <div className="flex justify-between items-start relative">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1 leading-tight">{stat.title}</p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{stat.amount}</h3>
              </div>
              <div className={`w-10 h-10 rounded-xl shrink-0 bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500 ${stat.highlight ? 'animate-pulse' : ''}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 relative">
              <div className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : (stat.highlight ? 'bg-rose-50 text-rose-600' : 'bg-red-50 text-red-600')}`}>
                {stat.highlight ? <AlertCircle className="w-3 h-3" /> : (stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />)}
                <span className="truncate max-w-[80px] sm:max-w-full">{stat.trend}</span>
              </div>
              <span className="text-[11px] text-gray-400 truncate">{stat.trendLabel}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 font-heading">Grafik Simpanan & Pinjaman</h3>
            <select className="bg-gray-50 border-none text-sm text-gray-600 rounded-lg focus:ring-0 py-1.5 px-3">
              <option>Tahun Ini</option>
              <option>Tahun Lalu</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSimpanan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPinjaman" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`Rp ${value} Jt`, '']}
                />
                <Area type="monotone" dataKey="simpanan" name="Simpanan" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSimpanan)" />
                <Area type="monotone" dataKey="pinjaman" name="Pinjaman" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorPinjaman)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 font-heading">Aktivitas Terkini</h3>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Lihat Semua</button>
          </div>
          
          <div className="flex-1 space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activity.type === 'simpanan' ? 'bg-emerald-100 text-emerald-600' :
                  activity.type === 'pinjaman' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'angsuran' ? 'bg-purple-100 text-purple-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  {activity.type === 'simpanan' && <Wallet className="w-5 h-5" />}
                  {activity.type === 'pinjaman' && <CreditCard className="w-5 h-5" />}
                  {activity.type === 'angsuran' && <Banknote className="w-5 h-5" />}
                  {activity.type === 'shu' && <TrendingUp className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{activity.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.date}</p>
                  <p className={`text-sm font-bold mt-1 ${
                    activity.type === 'simpanan' || activity.type === 'angsuran' ? 'text-emerald-600' : 'text-gray-900'
                  }`}>
                    {activity.type === 'simpanan' || activity.type === 'angsuran' ? '+' : ''}{activity.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
