"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Tutup dropdown saat area di luarnya diklik
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
          <h1 className="text-xl font-bold text-gray-800">Halo, Budi!</h1>
          <p className="text-sm text-gray-500">Selamat datang kembali di dashboard Anda.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`flex items-center gap-3 p-1 pr-2 rounded-full transition-colors border ${isProfileOpen ? 'bg-gray-50 border-gray-200' : 'border-transparent hover:bg-gray-50 hover:border-gray-200'}`}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Budi+Santoso&background=10B981&color=fff" alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-700 leading-none">Budi Santoso</p>
            <p className="text-xs text-gray-500 mt-1">Anggota</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 hidden md:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 origin-top-right transform transition-all">
            <Link 
              href="/anggota/profil" 
              onClick={() => setIsProfileOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
            >
              <User className="w-4 h-4 text-gray-400" />
              Profil Saya
            </Link>
            <div className="h-px bg-gray-100 my-1"></div>
            <button 
              onClick={() => {
                setIsProfileOpen(false);
                router.push('/login');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
