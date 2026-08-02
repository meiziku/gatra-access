import { useMemo } from "react";
import { useAnggota } from "@/context/AnggotaContext";

const PENDAPATAN_COA = [
  "Pendapatan Bunga Pinjaman",
  "Pendapatan Penjualan Produk",
  "Pendapatan Penjualan Jasa",
  "Pendapatan Bunga Bank",
  "Pendapatan Lain-Lain"
];

const PENGELUARAN_COA = [
  "Jasa Simpanan Sukarela",
  "Jasa Bank",
  "Beban Asuransi",
  "Beban Audit",
  "Beban Pajak",
  "Beban Rapat",
  "Beban Perjalanan Dinas",
  "Beban Pelatihan",
  "Beban Honor Pengurus",
  "Beban Organisasi",
  "Beban Gaji Karyawan",
  "Beban Konsumsi",
  "Beban ATK",
  "Beban Listrik, Telepon dan Air",
  "Beban Internet",
  "Beban Ongkos Kirim",
  "Beban Perbaikan dan Pemeliharaan",
  "Beban Operasional",
  "Beban Sewa",
  "Beban Pembelian Aset",
  "Beban Penyusutan Inventaris"
];

export function useNeraca(selectedYear: string) {
  const { transactions, coaNeraca, saldoAwalKoperasi } = useAnggota();

  return useMemo(() => {
    // Extract COA structure
    const ASET_LANCAR_COA = coaNeraca?.asetLancar?.map((c: any) => c.name) || [];
    const ASET_TETAP_COA = coaNeraca?.asetTetap?.map((c: any) => c.name) || [];
    const KEWAJIBAN_LANCAR_COA = coaNeraca?.kewajibanLancar?.map((c: any) => c.name) || [];
    const DANA_COA = coaNeraca?.dana?.map((c: any) => c.name) || [];
    const EKUITAS_COA = coaNeraca?.ekuitas?.map((c: any) => c.name) || [];
    
    // Aggregate from transactions
    let kasSP = 0;
    let kasPusat = 0;
    let bank = 0;
    let toko = 0;
    let sPokok = 0;
    let sWajib = 0;
    let sManasuka = 0;
    let sPendidikan = 0;
    let piutangPinjaman = 0;
    let shuTahunBerjalan = 0;

    if (transactions) {
      transactions.forEach((t: any) => {
        if (t.isMutasi) {
          const nominal = t.nominalMutasi || 0;
          
          if (t.mutasiStatus !== 'rejected' && t.mutasiStatus !== 'pending') {
            // Kurangi dariKas
            if (t.mutasiDari === "kas_sp") kasSP -= nominal;
            if (t.mutasiDari === "kas_umum") kasPusat -= nominal;
            if (t.mutasiDari === "bank") bank -= nominal;
            if (t.mutasiDari === "kas_toko") toko -= nominal;
            
            // Tambah keKas
            if (t.mutasiKe === "kas_sp") kasSP += nominal;
            if (t.mutasiKe === "kas_umum") kasPusat += nominal;
            if (t.mutasiKe === "bank") bank += nominal;
            if (t.mutasiKe === "kas_toko") toko += nominal;
          }
        } else {
          const net = (t.debit || 0) - (t.kredit || 0);
          
          if (t.id.startsWith("TRU-")) {
            kasPusat += net;
          } else if (t.id.startsWith("BNK-")) {
            bank += net;
          } else {
            kasSP += net;
          }
          
          if (t.description === "Simpanan Pokok") sPokok += net;
          if (t.description === "Simpanan Wajib") sWajib += net;
          if (t.description === "Simpanan Manasuka") sManasuka += net;
          if (t.description === "Simpanan Pendidikan") sPendidikan += net;
          
          if (t.description === "Pinjaman (Pencairan)") piutangPinjaman += Math.max(t.kredit, t.debit);
          if (t.description === "Angsuran Pinjaman") piutangPinjaman -= Math.max(t.kredit, t.debit);
          
          let txYear = "";
          if (t.date && t.date.includes("/")) {
            const parts = t.date.split("/");
            if (parts.length >= 3) txYear = parts[2];
          }
          
          if (txYear === selectedYear) {
            const nominalTx = Math.max(t.kredit, t.debit);
            if (t.description === "Jasa / Bunga") {
              shuTahunBerjalan += nominalTx;
            } else if (t.description === "Jasa Bank") {
              if (t.debit > 0) {
                shuTahunBerjalan += nominalTx;
              } else {
                shuTahunBerjalan -= nominalTx;
              }
            } else if (t.description === "Beban Admin Bank") {
              shuTahunBerjalan -= nominalTx;
            } else if (PENDAPATAN_COA.includes(t.description)) {
              shuTahunBerjalan += nominalTx;
            } else if (PENGELUARAN_COA.includes(t.description)) {
              shuTahunBerjalan -= nominalTx;
            }
          }
        }
      });
    }

    const asetLancarData: Record<string, number> = {};
    ASET_LANCAR_COA.forEach((coa: string) => asetLancarData[coa] = saldoAwalKoperasi[coa] || 0);
    asetLancarData["Kas Simpan Pinjam"] = (asetLancarData["Kas Simpan Pinjam"] || 0) + kasSP;
    asetLancarData["Kas Pusat"] = (asetLancarData["Kas Pusat"] || 0) + kasPusat;
    asetLancarData["Bank"] = (asetLancarData["Bank"] || 0) + bank;
    asetLancarData["Toko"] = (asetLancarData["Toko"] || 0) + toko;
    asetLancarData["Piutang Pinjaman Anggota"] = (asetLancarData["Piutang Pinjaman Anggota"] || 0) + piutangPinjaman;

    const asetTetapData: Record<string, number> = {};
    ASET_TETAP_COA.forEach((coa: string) => asetTetapData[coa] = saldoAwalKoperasi[coa] || 0);

    const kewajibanLancarData: Record<string, number> = {};
    KEWAJIBAN_LANCAR_COA.forEach((coa: string) => kewajibanLancarData[coa] = saldoAwalKoperasi[coa] || 0);
    if (KEWAJIBAN_LANCAR_COA.includes("Manasuka")) kewajibanLancarData["Manasuka"] = (kewajibanLancarData["Manasuka"] || 0) + sManasuka;
    if (KEWAJIBAN_LANCAR_COA.includes("Tabungan Pendidikan")) kewajibanLancarData["Tabungan Pendidikan"] = (kewajibanLancarData["Tabungan Pendidikan"] || 0) + sPendidikan;

    const danaData: Record<string, number> = {};
    DANA_COA.forEach((coa: string) => danaData[coa] = saldoAwalKoperasi[coa] || 0);

    const ekuitasData: Record<string, number> = {};
    EKUITAS_COA.forEach((coa: string) => ekuitasData[coa] = saldoAwalKoperasi[coa] || 0);
    if (EKUITAS_COA.includes("Simpanan Pokok")) ekuitasData["Simpanan Pokok"] = (ekuitasData["Simpanan Pokok"] || 0) + sPokok;
    if (EKUITAS_COA.includes("Simpanan Wajib")) ekuitasData["Simpanan Wajib"] = (ekuitasData["Simpanan Wajib"] || 0) + sWajib;
    if (EKUITAS_COA.includes("SHU Tahun Berjalan")) ekuitasData["SHU Tahun Berjalan"] = (ekuitasData["SHU Tahun Berjalan"] || 0) + shuTahunBerjalan;

    const totalAsetLancar = ASET_LANCAR_COA.reduce((sum: number, coa: string) => sum + (asetLancarData[coa] || 0), 0);
    const totalAsetTetap = ASET_TETAP_COA.reduce((sum: number, coa: string) => sum + (asetTetapData[coa] || 0), 0);
    const totalAset = totalAsetLancar + totalAsetTetap;

    const totalKewajibanLancar = KEWAJIBAN_LANCAR_COA.reduce((sum: number, coa: string) => sum + (kewajibanLancarData[coa] || 0), 0);
    const totalDana = DANA_COA.reduce((sum: number, coa: string) => sum + (danaData[coa] || 0), 0);
    const totalKewajiban = totalKewajibanLancar + totalDana;

    const totalEkuitas = EKUITAS_COA.reduce((sum: number, coa: string) => sum + (ekuitasData[coa] || 0), 0);
    const totalPasiva = totalKewajiban + totalEkuitas;

    const isSeimbang = totalAset === totalPasiva;

    return {
      totalAset,
      totalPasiva,
      isSeimbang,
      asetLancarData,
      asetTetapData,
      kewajibanLancarData,
      danaData,
      ekuitasData,
      totalAsetLancar,
      totalAsetTetap,
      totalKewajibanLancar,
      totalDana,
      totalKewajiban,
      totalEkuitas,
      ASET_LANCAR_COA,
      ASET_TETAP_COA,
      KEWAJIBAN_LANCAR_COA,
      DANA_COA,
      EKUITAS_COA
    };
  }, [transactions, coaNeraca, saldoAwalKoperasi, selectedYear]);
}
