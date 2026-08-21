"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, LogOut, Bell, Settings, History } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

interface TopbarProps {
  onOpenSidebar: () => void;
  currentRole?: string;
}

export function Topbar({ onOpenSidebar, currentRole = "Super Admin" }: TopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const hasNotification = true;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-gray-600 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold text-gray-800">Administrator</h1>
          <p className="text-sm text-gray-500">Ringkasan operasional Gatra Access.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          {hasNotification && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        <div className="w-px h-6 bg-gray-200"></div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 p-1 pr-2 rounded-full transition-colors border ${isProfileOpen ? 'bg-gray-50 border-gray-200' : 'border-transparent hover:bg-gray-50 hover:border-gray-200'}`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin+Gatra&background=3B82F6&color=fff" alt="Admin Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700 leading-none">Admin Gatra</p>
              <p className="text-xs text-blue-600 mt-1 font-medium">{currentRole}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 hidden md:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 origin-top-right transform transition-all">
              <Link 
                href="/admin/log-aktivitas" 
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <History className="w-4 h-4 text-gray-400" />
                Log Aktivitas
              </Link>
              <div className="h-px bg-gray-100 my-1"></div>
              
              {(currentRole === "Super Admin" || currentRole === "Ketua" || currentRole === "Sekretaris") && (
                <>
                  <Link 
                    href="/admin/pengaturan" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Pengaturan
                  </Link>
                  <div className="h-px bg-gray-100 my-1"></div>
                </>
              )}
              <button 
                onClick={async () => {
                  setIsProfileOpen(false);
                  try {
                    await signOut();
                  } catch (e) {}
                  router.push('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
