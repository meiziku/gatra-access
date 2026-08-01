import { 
  Search, 
  Filter, 
  PlusCircle, 
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  ArrowUpDown,
  CreditCard,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

export default function DataPinjamanPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Data Pinjaman</h2>
          <p className="text-gray-500 text-sm">Kelola pengajuan, pencairan, dan status angsuran pinjaman anggota.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <button className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex-1 xl:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20 font-medium text-sm">
            <PlusCircle className="w-4 h-4" />
            Pinjaman Baru
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard title="Total Pinjaman Aktif" value="Rp 0" sub="0 Peminjam Aktif" icon={CreditCard} color="blue" />
        <MetricCard title="Menunggu Persetujuan" value="Rp 0" sub="0 Pengajuan Baru" icon={CheckCircle} color="amber" />
        <MetricCard title="Pinjaman Bermasalah" value="Rp 0" sub="0 Menunggak" icon={AlertTriangle} color="red" />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors"
            placeholder="Cari nama atau ID Pinjaman..."
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select className="block w-full pl-10 pr-8 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-600 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors appearance-none cursor-pointer">
              <option value="">Semua Status</option>
              <option value="lancar">Lancar</option>
              <option value="menunggak">Menunggak</option>
              <option value="menunggu">Menunggu Persetujuan</option>
              <option value="lunas">Lunas</option>
            </select>
          </div>
          
          <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100/50 transition-colors group">
                  <div className="flex items-center gap-2">
                    Informasi Peminjam
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100/50 transition-colors group">
                  <div className="flex items-center gap-2">
                    Jenis Pinjaman
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100/50 transition-colors group">
                  <div className="flex items-center gap-2">
                    Sisa Pokok
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100/50 transition-colors group">
                  <div className="flex items-center gap-2">
                    Jatuh Tempo
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100/50 transition-colors group">
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            </tbody>
          </table>
        </div>
        
        {/* Pagination & Items Per Page */}
        <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <span>Tampilkan</span>
            <select className="border border-gray-200 rounded-lg py-1 px-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>baris</span>
          </div>
          
          <div>Menampilkan 1 hingga 5 dari 55 pinjaman</div>
          
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors" disabled>Seb</button>
            <button className="px-3 py-1 border border-amber-500 bg-amber-50 text-amber-700 rounded font-medium transition-colors">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 transition-colors">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 transition-colors">3</button>
            <span className="px-2 py-1">...</span>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 transition-colors">Lanjut</button>
          </div>
        </div>
      </div>
      
    </div>
  );
}

function MetricCard({ title, value, sub, icon: Icon, color }: any) {
  const colorStyles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group">
      <div className={`p-4 rounded-xl ${colorStyles[color]} group-hover:scale-105 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-0.5">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
    </div>
  );
}

function PinjamanRow({ name, id, type, amount, date, status, statusColor }: any) {
  return (
    <tr className="hover:bg-amber-50/30 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold border border-amber-200">
            {name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{name}</p>
            <span className="text-xs font-medium text-gray-500">{id}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
        {type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
        {amount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors tooltip-trigger" title="Detail">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors tooltip-trigger" title="Edit">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors tooltip-trigger" title="Hapus">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
