"use client";

import React, { createContext, useContext, useState } from "react";

type AnggotaContextType = {
  members: any[];
  setMembers: React.Dispatch<React.SetStateAction<any[]>>;
  addMember: (member: any) => void;
  updateMember: (member: any) => void;
  deleteMember: (id: string) => void;
  pendidikanMembers: any[];
  setPendidikanMembers: React.Dispatch<React.SetStateAction<any[]>>;
  hariRayaMembers: any[];
  setHariRayaMembers: React.Dispatch<React.SetStateAction<any[]>>;
  transactions: any[];
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  bungaPinjaman: number;
  setBungaPinjaman: React.Dispatch<React.SetStateAction<number>>;
  coaNeraca: any;
  setCoaNeraca: React.Dispatch<React.SetStateAction<any>>;
  coaLabaRugi: any;
  setCoaLabaRugi: React.Dispatch<React.SetStateAction<any>>;
  saldoAwalKoperasi: Record<string, number>;
  setSaldoAwalKoperasi: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  currentRole: string;
  setCurrentRole: React.Dispatch<React.SetStateAction<string>>;
};

const AnggotaContext = createContext<AnggotaContextType | undefined>(undefined);

export function AnggotaProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<any[]>([
    { id: "A-001", name: "Budi Santoso", date: "2026-01-15", phone: "081234567890", email: "budi@example.com", address: "Jl. Merdeka No. 1", pekerjaan: "ASN", status: "Aktif", balance: 0, loans: [] },
    { id: "A-002", name: "Siti Rahmawati", date: "2026-02-20", phone: "081298765432", email: "siti@example.com", address: "Jl. Pahlawan No. 2", pekerjaan: "Guru", status: "Aktif", balance: 0, loans: [] },
    { id: "A-003", name: "Ahmad Wijaya", date: "2026-03-10", phone: "081345678901", email: "ahmad@example.com", address: "Jl. Jend. Sudirman No. 3", pekerjaan: "Karyawan BUMD", status: "Aktif", balance: 0, loans: [] }
  ]);
  const [pendidikanMembers, setPendidikanMembers] = useState<any[]>([]);
  const [hariRayaMembers, setHariRayaMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [bungaPinjaman, setBungaPinjaman] = useState<number>(1.5);
  
  const [coaNeraca, setCoaNeraca] = useState<any>({
    asetLancar: [
      { id: 1, name: "Kas Simpan Pinjam" },
      { id: 2, name: "Kas Pusat" },
      { id: 3, name: "Bank" },
      { id: 4, name: "Toko" },
      { id: 5, name: "Piutang Pinjaman Anggota" },
    ],
    asetTetap: [
      { id: 6, name: "Inventaris" },
      { id: 7, name: "Akumulasi Penyusutan Inventaris" },
    ],
    kewajibanLancar: [
      { id: 8, name: "Beban yang akan dibayar" },
      { id: 9, name: "Manasuka" },
      { id: 10, name: "Tabungan Pendidikan" },
    ],
    dana: [
      { id: 11, name: "Pendidikan" },
      { id: 12, name: "Pengurus" },
      { id: 13, name: "Kesejahteraan Pegawai" },
      { id: 14, name: "Sosial" },
      { id: 15, name: "Pemdaker" },
    ],
    ekuitas: [
      { id: 16, name: "Simpanan Pokok" },
      { id: 17, name: "Simpanan Wajib" },
      { id: 18, name: "Toko" },
      { id: 19, name: "Dana Cadangan" },
      { id: 20, name: "Seragam" },
      { id: 21, name: "SHU Tahun Berjalan" },
    ]
  });

  const [coaLabaRugi, setCoaLabaRugi] = useState<any>({
    pendapatan: [
      { id: 1, name: "Pendapatan Bunga Pinjaman" },
      { id: 2, name: "Pendapatan Penjualan Produk" },
      { id: 3, name: "Pendapatan Penjualan Jasa" },
      { id: 4, name: "Pendapatan Bunga Bank" },
      { id: 5, name: "Pendapatan Lain-Lain" }
    ],
    pengeluaran: [
      { id: 6, name: "Jasa Simpanan Sukarela" },
      { id: 7, name: "Jasa Bank" },
      { id: 8, name: "Beban Asuransi" },
      { id: 9, name: "Beban Audit" },
      { id: 10, name: "Beban Pajak" },
      { id: 11, name: "Beban Rapat" },
      { id: 12, name: "Beban Perjalanan Dinas" },
      { id: 13, name: "Beban Pelatihan" },
      { id: 14, name: "Beban Honor Pengurus" },
      { id: 15, name: "Beban Organisasi" },
      { id: 16, name: "Beban Gaji Karyawan" },
      { id: 17, name: "Beban Konsumsi" },
      { id: 18, name: "Beban ATK" },
      { id: 19, name: "Beban Listrik, Telepon dan Air" },
      { id: 20, name: "Beban Internet" },
      { id: 21, name: "Beban Ongkos Kirim" },
      { id: 22, name: "Beban Perbaikan dan Pemeliharaan" },
      { id: 23, name: "Beban Operasional" },
      { id: 24, name: "Beban Sewa" },
      { id: 25, name: "Beban Pembelian Aset" },
      { id: 26, name: "Beban Penyusutan Inventaris" },
    ]
  });

  const [saldoAwalKoperasi, setSaldoAwalKoperasi] = useState<Record<string, number>>({});
  const [currentRole, setCurrentRole] = useState<string>("Super Admin");

  const addMember = (member: any) => setMembers((prev) => [member, ...prev]);
  const updateMember = (member: any) =>
    setMembers((prev) => prev.map((m) => (m.id === member.id ? member : m)));
  const deleteMember = (id: string) =>
    setMembers((prev) => prev.filter((m) => m.id !== id));

  return (
    <AnggotaContext.Provider value={{ members, setMembers, addMember, updateMember, deleteMember, pendidikanMembers, setPendidikanMembers, hariRayaMembers, setHariRayaMembers, transactions, setTransactions, bungaPinjaman, setBungaPinjaman, coaNeraca, setCoaNeraca, coaLabaRugi, setCoaLabaRugi, saldoAwalKoperasi, setSaldoAwalKoperasi, currentRole, setCurrentRole }}>
      {children}
    </AnggotaContext.Provider>
  );
}

export function useAnggota() {
  const context = useContext(AnggotaContext);
  if (!context) {
    throw new Error("useAnggota must be used within an AnggotaProvider");
  }
  return context;
}
