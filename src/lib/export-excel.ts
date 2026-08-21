import * as XLSX from "xlsx";

/** Helper to format rupiah */
export const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

/** Template Import Anggota */
export function downloadAnggotaTemplate() {
  const headers = [
    "ID Anggota",
    "Nama Lengkap",
    "Email",
    "No HP",
    "Alamat",
    "Pekerjaan",
    "Tanggal Bergabung",
  ];

  const sampleData = [
    headers,
    [
      "GT001",
      "Budi Santoso",
      "budi@gmail.com",
      "081234567890",
      "Jl. Merdeka No. 10 Cirebon",
      "ASN",
      "2024-01-15",
    ],
    [
      "GT002",
      "Siti Aminah",
      "siti@gmail.com",
      "085678901234",
      "Jl. Mawar No. 5 Cirebon",
      "NON ASN",
      "2024-02-01",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);

  // Set column widths for clean presentation
  ws["!cols"] = [
    { wch: 15 }, // ID Anggota
    { wch: 25 }, // Nama Lengkap
    { wch: 25 }, // Email
    { wch: 18 }, // No HP
    { wch: 35 }, // Alamat
    { wch: 15 }, // Pekerjaan
    { wch: 20 }, // Tanggal Bergabung
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template Anggota");
  XLSX.writeFile(wb, "Template_Import_Anggota.xlsx");
}

/** Template Import Transaksi Kas */
export function downloadTransaksiTemplate() {
  const headers = ["Tanggal", "Buku Kas", "Tipe", "Nominal", "Keterangan"];

  const sampleData = [
    headers,
    ["2026-01-10", "kas_sp", "pemasukan", 500000, "Setoran Simpanan Pokok"],
    ["2026-01-12", "kas_umum", "pengeluaran", 150000, "Pembelian ATK Kantor"],
    ["2026-01-15", "bank", "pemasukan", 2000000, "Transfer Angsuran Pinjaman"],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  ws["!cols"] = [
    { wch: 15 }, // Tanggal
    { wch: 15 }, // Buku Kas
    { wch: 15 }, // Tipe
    { wch: 18 }, // Nominal
    { wch: 35 }, // Keterangan
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template Transaksi");
  XLSX.writeFile(wb, "Template_Import_Transaksi.xlsx");
}

/** Template Import Setup Saldo */
export function downloadSaldoAwalTemplate() {
  const headers = ["Buku Kas", "Saldo Awal", "Tanggal", "Keterangan"];

  const sampleData = [
    headers,
    ["kas_sp", 50000000, "2026-01-01", "Saldo Awal Kas Simpan Pinjam"],
    ["kas_umum", 25000000, "2026-01-01", "Saldo Awal Kas Umum"],
    ["kas_toko", 15000000, "2026-01-01", "Saldo Awal Kas Toko"],
    ["bank", 100000000, "2026-01-01", "Saldo Awal Rekening Bank"],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  ws["!cols"] = [
    { wch: 15 }, // Buku Kas
    { wch: 20 }, // Saldo Awal
    { wch: 15 }, // Tanggal
    { wch: 35 }, // Keterangan
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template Saldo Awal");
  XLSX.writeFile(wb, "Template_Import_Saldo_Awal.xlsx");
}

/** Export Data Anggota ke Excel */
export function exportAnggotaExcel(members: any[]) {
  const exportData = members.map((m) => ({
    "ID Anggota": m.id,
    "Nama Lengkap": m.name,
    "Email": m.email || "-",
    "No HP": m.phone || "-",
    "Alamat": m.address || "-",
    "Pekerjaan": m.pekerjaan || "-",
    "Tanggal Bergabung": m.date || "-",
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  ws["!cols"] = [
    { wch: 15 },
    { wch: 25 },
    { wch: 25 },
    { wch: 18 },
    { wch: 35 },
    { wch: 15 },
    { wch: 20 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Anggota");
  const filename = `Data_Anggota_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/** Export Transaksi ke Excel */
export function exportTransaksiExcel(transactions: any[], title: string = "Transaksi") {
  const exportData = transactions.map((t, idx) => ({
    "No": idx + 1,
    "No Referensi": t.noReferensi || t.id || "-",
    "Tanggal": t.tanggal || "-",
    "Buku Kas": t.bukuKas || "-",
    "Tipe": t.tipe || "-",
    "Nominal": Number(t.nominal || 0),
    "Saldo Running": Number(t.saldo || 0),
    "Keterangan": t.keterangan || "-",
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  ws["!cols"] = [
    { wch: 6 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 35 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title);
  const filename = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
}
