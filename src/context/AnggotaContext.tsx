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

  const addMember = (member: any) => setMembers((prev) => [member, ...prev]);
  const updateMember = (member: any) =>
    setMembers((prev) => prev.map((m) => (m.id === member.id ? member : m)));
  const deleteMember = (id: string) =>
    setMembers((prev) => prev.filter((m) => m.id !== id));

  return (
    <AnggotaContext.Provider value={{ members, setMembers, addMember, updateMember, deleteMember, pendidikanMembers, setPendidikanMembers, hariRayaMembers, setHariRayaMembers, transactions, setTransactions, bungaPinjaman, setBungaPinjaman }}>
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
