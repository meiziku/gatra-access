"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Key, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProfilPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok");
      return;
    }

    if (newPassword.length < 3) {
      setError("Password baru minimal 3 karakter");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await authClient.changePassword({
        newPassword,
        currentPassword
      });

      if (error) {
        setError(error.message || "Gagal mengubah password. Pastikan password saat ini benar.");
      } else {
        setSuccess("Password berhasil diubah");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setError("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Ubah Password</h2>
            <p className="text-sm text-gray-500">Kelola keamanan akun Anda</p>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3 text-red-600 items-start">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 flex gap-3 text-green-700 items-start">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password Saat Ini</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
                placeholder="Masukkan password saat ini"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password Baru</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
                placeholder="Masukkan password baru"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
                placeholder="Ulangi password baru"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-md shadow-blue-500/20 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
