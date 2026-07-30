"use client";

import { 
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building,
  Calendar,
  Camera,
  Edit2,
  Lock,
  CheckCircle2
} from "lucide-react";

export default function ProfilPage() {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Profil Saya</h2>
          <p className="text-sm text-gray-500">Kelola informasi pribadi dan data keanggotaan Anda.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
            <Lock className="w-4 h-4" />
            Ubah Kata Sandi
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/30 text-sm font-medium">
            <Edit2 className="w-4 h-4" />
            Edit Profil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 h-full">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center relative overflow-hidden group h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
            
            <div className="relative mt-8 mb-4 inline-block">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Budi+Santoso&background=10B981&color=fff&size=150" alt="Budi Santoso" className="w-full h-full object-cover" />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-emerald-600 transition-colors border border-gray-100">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900">Budi Santoso</h3>
            <p className="text-sm text-gray-500 mb-4">No. Anggota: KPG-2024-0012</p>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium mb-6 self-center">
              <CheckCircle2 className="w-4 h-4" />
              Anggota Aktif
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-4 text-left mt-auto">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="font-medium text-gray-900 truncate">budi.santoso@email.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">No. Handphone</p>
                  <p className="font-medium text-gray-900">+62 812-3456-7890</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Bergabung Sejak</p>
                  <p className="font-medium text-gray-900">10 Januari 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Data Pribadi */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 font-heading mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              Data Pribadi
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Nama Lengkap Sesuai KTP</p>
                <p className="font-medium text-gray-900">Budi Santoso</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Nomor Induk Kependudukan (NIK)</p>
                <p className="font-medium text-gray-900">3201234567890001</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tempat, Tanggal Lahir</p>
                <p className="font-medium text-gray-900">Jakarta, 15 Agustus 1990</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Jenis Kelamin</p>
                <p className="font-medium text-gray-900">Laki-laki</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Alamat Domisili</p>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p className="font-medium text-gray-900 leading-relaxed">Jl. Sudirman No. 123, RT 01/RW 02, Kel. Senayan, Kec. Kebayoran Baru, Jakarta Selatan, 12190</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Pekerjaan */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 font-heading mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gray-400" />
              Data Pekerjaan
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Profesi / Jabatan</p>
                <p className="font-medium text-gray-900">Software Engineer</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Nama Perusahaan</p>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400 shrink-0" />
                  <p className="font-medium text-gray-900">PT Teknologi Nusantara</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
