"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  Wallet, 
  CreditCard, 
  Users,
  FileText,
  Settings,
  LogOut,
  X,
  BookOpen,
  ChevronDown,
  ChevronRight,
  PieChart,
  History,
  Building2,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Data Anggota", href: "/admin/anggota", icon: Users },
  { name: "Transaksi SP", href: "/admin/transaksi", icon: BookOpen },
  { name: "Transaksi Umum", href: "/admin/transaksi-umum", icon: BookOpen },
  { name: "Transaksi Bank", href: "/admin/transaksi-bank", icon: Building2 },
  { 
    name: "Laporan Simpanan", 
    href: "#", 
    icon: Wallet,
    subItems: [
      { name: "Simpanan Pokok", href: "/admin/laporan-simpanan/pokok" },
      { name: "Simpanan Wajib", href: "/admin/laporan-simpanan/wajib" },
      { name: "Simpanan Manasuka", href: "/admin/laporan-simpanan/manasuka" },
      { name: "Simpanan Pendidikan", href: "/admin/laporan-simpanan/pendidikan" },
      { name: "Simpanan Hari Raya", href: "/admin/laporan-simpanan/hari-raya" },
    ]
  },
  { name: "Laporan Pinjaman", href: "/admin/laporan-pinjaman", icon: CreditCard },
  { name: "Laporan Hasil Usaha", href: "/admin/laporan-hasil-usaha", icon: FileText },
  { name: "Laporan Neraca", href: "/admin/laporan-neraca", icon: PieChart },
  { name: "Laporan Pembagian SHU", href: "/admin/laporan-pembagian-shu", icon: FileText },
  { name: "Rekap Penerimaan SHU", href: "/admin/rekap-penerimaan-shu", icon: Users },
];

const bottomItems = [
  { name: "Setup Saldo", href: "/admin/setup-saldo", icon: Database },
  { name: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
  { name: "Log Aktivitas", href: "/admin/log-aktivitas", icon: History },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: string;
  setCurrentRole: (role: string) => void;
}

import { useState, useEffect } from "react";

export function Sidebar({ isOpen, onClose, currentRole, setCurrentRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  
  const roles = ["Super Admin", "Ketua", "Sekretaris", "Bendahara", "Pengelola SP", "Pengelola Toko"];

  const filteredMenuItems = menuItems.filter(item => {
    if (currentRole === "Super Admin") return true;

    if (item.name === "Transaksi Bank") {
      return currentRole === "Bendahara";
    }

    if (currentRole === "Ketua" || currentRole === "Sekretaris") {
      return item.name !== "Transaksi SP" && item.name !== "Transaksi Umum";
    }
    if (currentRole === "Pengelola SP") {
      return item.name !== "Transaksi Umum";
    }
    if (currentRole === "Pengelola Toko") {
      return item.name !== "Transaksi SP" && item.name !== "Transaksi Umum";
    }
    return true;
  });

  const filteredBottomItems = bottomItems.filter(item => {
    if (item.name === "Log Aktivitas") return true;
    if (currentRole === "Super Admin" || currentRole === "Ketua" || currentRole === "Sekretaris") return true;
    return item.name !== "Pengaturan";
  });

  // Auto open menu if child is active
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.subItems) {
        const isChildActive = item.subItems.some(sub => pathname.startsWith(sub.href));
        if (isChildActive) {
          setOpenMenus(prev => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname]);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              Gatra <span className="text-blue-400">Admin</span>
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Menu Utama
            </p>
            {filteredMenuItems.map((item) => {
              if (item.subItems) {
                const isChildActive = item.subItems.some(sub => pathname.startsWith(sub.href));
                const isExpanded = openMenus[item.name];

                return (
                  <div key={item.name} className="mb-1">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        isChildActive && !isExpanded
                          ? "text-white bg-slate-800/50"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("w-5 h-5", isChildActive ? "text-blue-400" : "text-slate-400")} />
                        {item.name}
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    
                    {/* Sub Menu Items */}
                    <div 
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        isExpanded ? "max-h-64 opacity-100 mt-1" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="pl-11 pr-3 space-y-1">
                        {item.subItems.map(subItem => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                                isSubActive
                                  ? "bg-blue-600/20 text-blue-400"
                                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                              )}
                            >
                              <div className={cn("w-1.5 h-1.5 rounded-full", isSubActive ? "bg-blue-400" : "bg-slate-600")} />
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/50"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-blue-200" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <nav className="space-y-1">
            {filteredBottomItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/50"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-blue-200" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Role Simulator */}
            <div className="pt-3 pb-2 mt-2 mb-2 border-t border-slate-800/80">
              <label className="px-3 text-[10px] font-semibold text-emerald-500/80 uppercase tracking-wider mb-2 block">
                Simulasi Hak Akses
              </label>
              <div className="px-3">
                <select 
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="w-full bg-slate-800 text-xs text-emerald-400 font-medium border border-slate-700/50 rounded-lg px-2.5 py-2 focus:outline-none focus:border-emerald-500/50 cursor-pointer appearance-none"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={async () => {
                try {
                  await signOut();
                } catch (e) {}
                router.push('/');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200 mt-2"
            >
              <LogOut className="w-5 h-5 text-red-400" />
              Keluar
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
