import { 
  Users, 
  Wallet, 
  CreditCard, 
  TrendingUp,
  UserPlus,
  CheckCircle,
  FileText,
  AlertCircle,
  History
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ringkasan Utama</h2>
          <p className="text-gray-500">Pantau aktivitas dan performa koperasi secara real-time.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Anggota" 
          value="1,248" 
          trend="+12 bulan ini"
          icon={Users}
          color="blue"
        />
        <MetricCard 
          title="Total Kas (Simpanan)" 
          value="Rp 4.5M" 
          trend="+5.2% dari bulan lalu"
          icon={Wallet}
          color="emerald"
        />
        <MetricCard 
          title="Pinjaman Beredar" 
          value="Rp 2.1M" 
          trend="48 aktif"
          icon={CreditCard}
          color="amber"
        />
        <MetricCard 
          title="SHU Sementara" 
          value="Rp 340Jt" 
          trend="+15% YoY"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts & Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Tren Simpanan vs Pinjaman</h3>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
              <option>6 Bulan Terakhir</option>
              <option>Tahun Ini</option>
            </select>
          </div>
          
          {/* Custom CSS Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 px-2 mt-4 border-b border-gray-100 pb-2 relative">
            {/* Chart Y-axis Labels */}
            <div className="absolute -left-2 top-0 h-full flex flex-col justify-between text-xs text-gray-400 font-medium">
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>
            
            {/* Bars */}
            {[
              { month: "Jan", s: 40, p: 20 },
              { month: "Feb", s: 45, p: 30 },
              { month: "Mar", s: 60, p: 25 },
              { month: "Apr", s: 50, p: 40 },
              { month: "Mei", s: 70, p: 55 },
              { month: "Jun", s: 85, p: 45 },
            ].map((data, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                <div className="flex items-end gap-1 w-full justify-center h-full relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Simpanan: {data.s}%<br/>Pinjaman: {data.p}%
                  </div>
                  <div 
                    className="w-1/3 bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:bg-blue-400 relative" 
                    style={{ height: `${data.s}%` }}
                  ></div>
                  <div 
                    className="w-1/3 bg-amber-400 rounded-t-sm transition-all duration-500 group-hover:bg-amber-300 relative" 
                    style={{ height: `${data.p}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Simpanan Masuk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Pencairan Pinjaman</span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Pending Approvals */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            Log Aktivitas Terbaru
          </h3>
          
          <div className="flex-1 space-y-4">
            <LogItem 
              action="Mengubah persentase SHU"
              user="Admin Gatra (Super Admin)"
              time="2 jam yang lalu"
              type="settings"
            />
            <LogItem 
              action="Menghapus transaksi SP"
              user="Budi (Bendahara)"
              time="4 jam yang lalu"
              type="delete"
            />
            <LogItem 
              action="Menambahkan anggota baru"
              user="Siti (Sekretaris)"
              time="1 hari yang lalu"
              type="add"
            />
          </div>

          <Link href="/admin/log-aktivitas" className="mt-6 block text-center w-full py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
            Lihat Semua Riwayat
          </Link>
        </div>

      </div>

      {/* Recent Activities Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Aktivitas Terkini</h3>
          <Link href="/admin/aktivitas" className="text-sm font-medium text-blue-600 hover:text-blue-700">Lihat Semua</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 rounded-lg">
              <tr>
                <th className="px-4 py-3 font-medium rounded-l-lg">Anggota</th>
                <th className="px-4 py-3 font-medium">Jenis Transaksi</th>
                <th className="px-4 py-3 font-medium">Nominal</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium rounded-r-lg">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <ActivityRow 
                name="Dewi Sartika" id="ANG-089"
                type="Setoran Simpanan Wajib"
                amount="+ Rp 100.000" isPositive={true}
                status="Berhasil" statusColor="text-emerald-600 bg-emerald-50"
                time="10:45 WIB"
              />
              <ActivityRow 
                name="Hendra Gunawan" id="ANG-102"
                type="Angsuran Pinjaman"
                amount="+ Rp 550.000" isPositive={true}
                status="Berhasil" statusColor="text-emerald-600 bg-emerald-50"
                time="09:12 WIB"
              />
              <ActivityRow 
                name="Rina Melati" id="ANG-234"
                type="Pencairan Pinjaman"
                amount="- Rp 2.000.000" isPositive={false}
                status="Diproses" statusColor="text-amber-600 bg-amber-50"
                time="Kemarin"
              />
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, trend, icon: Icon, color }: any) {
  const colorStyles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-default">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorStyles[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-emerald-500 font-medium">{trend}</span>
      </div>
    </div>
  );
}

function LogItem({ action, user, time, type }: any) {
  let iconBg = "bg-gray-50 text-gray-600";
  if (type === "delete") iconBg = "bg-red-50 text-red-600";
  if (type === "add") iconBg = "bg-emerald-50 text-emerald-600";
  if (type === "settings") iconBg = "bg-slate-800 text-white";

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer">
      <div className={`p-2 rounded-lg ${iconBg}`}>
        <History className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate">{action}</p>
        <p className="text-xs text-gray-500 truncate">{user}</p>
      </div>
      <div className="flex flex-col items-end justify-center">
        <span className="text-[10px] text-gray-400">{time}</span>
      </div>
    </div>
  );
}

function ActivityRow({ name, id, type, amount, isPositive, status, statusColor, time }: any) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
            {name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{name}</p>
            <p className="text-xs text-gray-500">{id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{type}</td>
      <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-gray-900'}`}>
        {amount}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{time}</td>
    </tr>
  );
}
