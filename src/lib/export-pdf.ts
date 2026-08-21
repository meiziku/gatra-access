import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

const formatDate = () => {
  return new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/** Header formal untuk dokumen PDF */
function addPDFHeader(doc: jsPDF, title: string, subtitle: string) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129); // Emerald color
  doc.text("KOPERASI KONSUMEN GATRA", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Sistem Informasi & Operasional Koperasi Modern", 14, 23);
  doc.text(`Tanggal Cetak: ${formatDate()}`, 14, 28);

  // Decorative line
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.8);
  doc.line(14, 31, doc.internal.pageSize.width - 14, 31);

  // Title section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text(title.toUpperCase(), 14, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(subtitle, 14, 46);
}

/** Tanda tangan pengurus di bagian bawah PDF */
function addPDFSignatures(doc: jsPDF, yPos: number) {
  const pageHeight = doc.internal.pageSize.height;
  let finalY = yPos + 15;
  if (finalY + 35 > pageHeight) {
    doc.addPage();
    finalY = 25;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const colWidth = (doc.internal.pageSize.width - 28) / 3;

  doc.text("Ketua Koperasi,", 14 + 10, finalY);
  doc.text("Bendahara,", 14 + colWidth + 10, finalY);
  doc.text("Pengawas,", 14 + colWidth * 2 + 10, finalY);

  doc.text("( .................................... )", 14, finalY + 22);
  doc.text("( .................................... )", 14 + colWidth, finalY + 22);
  doc.text("( .................................... )", 14 + colWidth * 2, finalY + 22);
}

/** Export Laporan Neraca PDF */
export function generateNeracaPDF(data: {
  selectedYear: string;
  totalAset: number;
  totalPasiva: number;
  asetLancarData: Record<string, number>;
  asetTetapData: Record<string, number>;
  kewajibanLancarData: Record<string, number>;
  danaData: Record<string, number>;
  ekuitasData: Record<string, number>;
  totalAsetLancar: number;
  totalAsetTetap: number;
  totalKewajibanLancar: number;
  totalDana: number;
  totalKewajiban: number;
  totalEkuitas: number;
  ASET_LANCAR_COA: string[];
  ASET_TETAP_COA: string[];
  KEWAJIBAN_LANCAR_COA: string[];
  DANA_COA: string[];
  EKUITAS_COA: string[];
}) {
  const doc = new jsPDF("p", "mm", "a4");

  addPDFHeader(
    doc,
    "Laporan Neraca (Posisi Keuangan)",
    `Per akhir Tahun Buku ${data.selectedYear}`
  );

  const asetRows: any[] = [];
  asetRows.push([{ content: "A. ASET LANCAR", colSpan: 2, styles: { fontStyle: "bold", fillColor: [236, 253, 245] } }]);
  data.ASET_LANCAR_COA.forEach((coa) => {
    asetRows.push(["  " + coa, formatRupiah(data.asetLancarData[coa] || 0)]);
  });
  asetRows.push([{ content: "Total Aset Lancar", styles: { fontStyle: "bold" } }, { content: formatRupiah(data.totalAsetLancar), styles: { fontStyle: "bold" } }]);

  asetRows.push([{ content: "B. ASET TETAP", colSpan: 2, styles: { fontStyle: "bold", fillColor: [236, 253, 245] } }]);
  data.ASET_TETAP_COA.forEach((coa) => {
    asetRows.push(["  " + coa, formatRupiah(data.asetTetapData[coa] || 0)]);
  });
  asetRows.push([{ content: "Total Aset Tetap", styles: { fontStyle: "bold" } }, { content: formatRupiah(data.totalAsetTetap), styles: { fontStyle: "bold" } }]);
  asetRows.push([{ content: "TOTAL ASET (AKTIVA)", styles: { fontStyle: "bold", fillColor: [16, 185, 129], textColor: [255, 255, 255] } }, { content: formatRupiah(data.totalAset), styles: { fontStyle: "bold", fillColor: [16, 185, 129], textColor: [255, 255, 255] } }]);

  const pasivaRows: any[] = [];
  pasivaRows.push([{ content: "A. KEWAJIBAN LANCAR", colSpan: 2, styles: { fontStyle: "bold", fillColor: [239, 246, 255] } }]);
  data.KEWAJIBAN_LANCAR_COA.forEach((coa) => {
    pasivaRows.push(["  " + coa, formatRupiah(data.kewajibanLancarData[coa] || 0)]);
  });

  pasivaRows.push([{ content: "B. DANA-DANA", colSpan: 2, styles: { fontStyle: "bold", fillColor: [239, 246, 255] } }]);
  data.DANA_COA.forEach((coa) => {
    pasivaRows.push(["  " + coa, formatRupiah(data.danaData[coa] || 0)]);
  });
  pasivaRows.push([{ content: "Total Kewajiban & Dana", styles: { fontStyle: "bold" } }, { content: formatRupiah(data.totalKewajiban), styles: { fontStyle: "bold" } }]);

  pasivaRows.push([{ content: "C. EKUITAS / MODAL", colSpan: 2, styles: { fontStyle: "bold", fillColor: [239, 246, 255] } }]);
  data.EKUITAS_COA.forEach((coa) => {
    pasivaRows.push(["  " + coa, formatRupiah(data.ekuitasData[coa] || 0)]);
  });
  pasivaRows.push([{ content: "Total Ekuitas", styles: { fontStyle: "bold" } }, { content: formatRupiah(data.totalEkuitas), styles: { fontStyle: "bold" } }]);
  pasivaRows.push([{ content: "TOTAL PASIVA (KEWAJIBAN & EKUITAS)", styles: { fontStyle: "bold", fillColor: [37, 99, 235], textColor: [255, 255, 255] } }, { content: formatRupiah(data.totalPasiva), styles: { fontStyle: "bold", fillColor: [37, 99, 235], textColor: [255, 255, 255] } }]);

  autoTable(doc, {
    startY: 52,
    head: [["KOMPONEN ASET (AKTIVA)", "NOMINAL"]],
    body: asetRows,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 8, cellPadding: 2 },
  });

  const firstTableY = (doc as any).lastAutoTable.finalY + 8;

  autoTable(doc, {
    startY: firstTableY,
    head: [["KOMPONEN KEWAJIBAN & EKUITAS (PASIVA)", "NOMINAL"]],
    body: pasivaRows,
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 8, cellPadding: 2 },
  });

  addPDFSignatures(doc, (doc as any).lastAutoTable.finalY);

  doc.save(`Laporan_Neraca_${data.selectedYear}.pdf`);
}

/** Export Laporan Hasil Usaha (Laba Rugi) PDF */
export function generateLabaRugiPDF(data: {
  selectedYear: string;
  totalPendapatan: number;
  totalPengeluaran: number;
  shuKotor: number;
  persenPajak: number;
  nominalPajak: number;
  shuBersih: number;
  pendapatanData: Record<string, number>;
  pengeluaranData: Record<string, number>;
  PENDAPATAN_COA: string[];
  PENGELUARAN_COA: string[];
}) {
  const doc = new jsPDF("p", "mm", "a4");

  addPDFHeader(
    doc,
    "Laporan Hasil Usaha (Laba Rugi)",
    `Tahun Buku ${data.selectedYear}`
  );

  const rows: any[] = [];

  rows.push([{ content: "I. PENDAPATAN OPERASIONAL", colSpan: 2, styles: { fontStyle: "bold", fillColor: [236, 253, 245] } }]);
  data.PENDAPATAN_COA.forEach((coa) => {
    rows.push(["  " + coa, formatRupiah(data.pendapatanData[coa] || 0)]);
  });
  rows.push([{ content: "TOTAL PENDAPATAN", styles: { fontStyle: "bold" } }, { content: formatRupiah(data.totalPendapatan), styles: { fontStyle: "bold" } }]);

  rows.push([{ content: "II. PENGELUARAN / BEBAN OPERASIONAL", colSpan: 2, styles: { fontStyle: "bold", fillColor: [254, 242, 242] } }]);
  data.PENGELUARAN_COA.forEach((coa) => {
    rows.push(["  " + coa, formatRupiah(data.pengeluaranData[coa] || 0)]);
  });
  rows.push([{ content: "TOTAL PENGELUARAN", styles: { fontStyle: "bold" } }, { content: formatRupiah(data.totalPengeluaran), styles: { fontStyle: "bold" } }]);

  rows.push([{ content: "III. SISA HASIL USAHA (SHU) KOTOR", styles: { fontStyle: "bold", fillColor: [241, 245, 249] } }, { content: formatRupiah(data.shuKotor), styles: { fontStyle: "bold", fillColor: [241, 245, 249] } }]);
  rows.push([`  Beban Pajak PPh (${data.persenPajak}%)`, formatRupiah(data.nominalPajak)]);
  rows.push([{ content: "IV. SISA HASIL USAHA (SHU) BERSIH", styles: { fontStyle: "bold", fillColor: [16, 185, 129], textColor: [255, 255, 255] } }, { content: formatRupiah(data.shuBersih), styles: { fontStyle: "bold", fillColor: [16, 185, 129], textColor: [255, 255, 255] } }]);

  autoTable(doc, {
    startY: 52,
    head: [["URAIAN PERHITUNGAN", "NOMINAL (RP)"]],
    body: rows,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 8, cellPadding: 2.5 },
  });

  addPDFSignatures(doc, (doc as any).lastAutoTable.finalY);

  doc.save(`Laporan_Hasil_Usaha_${data.selectedYear}.pdf`);
}

/** Export Laporan Pembagian SHU PDF */
export function generatePembagianShuPDF(data: {
  selectedYear: string;
  shuList: any[];
  totalShuKoperasi: number;
  totalJasaSimpanan: number;
  totalJasaSp: number;
}) {
  const doc = new jsPDF("l", "mm", "a4");

  addPDFHeader(
    doc,
    "Laporan Pembagian Sisa Hasil Usaha (SHU)",
    `Tahun Buku ${data.selectedYear} | Total SHU Koperasi: ${formatRupiah(data.totalShuKoperasi)}`
  );

  const body = data.shuList.map((item, idx) => [
    idx + 1,
    item.id,
    item.nama,
    formatRupiah(item.simpananTotal || 0),
    formatRupiah(item.jasaSimpanan || 0),
    formatRupiah(item.jasaSp || 0),
    formatRupiah(item.totalShu || 0),
  ]);

  const totalDiterima = data.shuList.reduce((s, i) => s + (i.totalShu || 0), 0);

  body.push([
    { content: "TOTAL", colSpan: 3, styles: { fontStyle: "bold", halign: "center" } },
    "",
    formatRupiah(data.totalJasaSimpanan),
    formatRupiah(data.totalJasaSp),
    formatRupiah(totalDiterima),
  ]);

  autoTable(doc, {
    startY: 52,
    head: [["NO", "ID ANGGOTA", "NAMA ANGGOTA", "TOTAL SIMPANAN", "JASA SIMPANAN", "JASA SP", "TOTAL SHU DITERIMA"]],
    body,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { halign: "center", cellWidth: 28 },
      2: { cellWidth: 55 },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right", fontStyle: "bold" },
    },
  });

  addPDFSignatures(doc, (doc as any).lastAutoTable.finalY);

  doc.save(`Laporan_Pembagian_SHU_${data.selectedYear}.pdf`);
}

/** Export Laporan Simpanan PDF */
export function generateSimpananPDF(data: {
  jenisNama: string;
  selectedYear: string;
  rows: any[];
}) {
  const doc = new jsPDF("p", "mm", "a4");

  addPDFHeader(
    doc,
    `Laporan Simpanan - ${data.jenisNama}`,
    `Tahun Buku ${data.selectedYear}`
  );

  let totalNominal = 0;
  const tableData = data.rows.map((r, idx) => {
    const nominal = Number(r.nominal || r.simpanan?.nominal || 0);
    totalNominal += nominal;
    return [
      idx + 1,
      r.tanggal || r.simpanan?.tanggal || "-",
      r.noReferensi || r.simpanan?.noReferensi || "-",
      r.anggota?.nama || r.nama || "-",
      r.tipe || r.simpanan?.tipe || "setoran",
      formatRupiah(nominal),
    ];
  });

  tableData.push([
    { content: "TOTAL", colSpan: 5, styles: { fontStyle: "bold", halign: "center" } },
    formatRupiah(totalNominal),
  ]);

  autoTable(doc, {
    startY: 52,
    head: [["NO", "TANGGAL", "NO REFERENSI", "NAMA ANGGOTA", "TIPE", "NOMINAL"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { halign: "center", cellWidth: 25 },
      2: { cellWidth: 35 },
      3: { cellWidth: 50 },
      4: { halign: "center", cellWidth: 25 },
      5: { halign: "right", fontStyle: "bold" },
    },
  });

  addPDFSignatures(doc, (doc as any).lastAutoTable.finalY);

  doc.save(`Laporan_Simpanan_${data.jenisNama.replace(/\s+/g, "_")}_${data.selectedYear}.pdf`);
}

/** Export Laporan Pinjaman PDF */
export function generatePinjamanPDF(data: {
  selectedYear: string;
  rows: any[];
}) {
  const doc = new jsPDF("l", "mm", "a4");

  addPDFHeader(
    doc,
    "Laporan Pinjaman Anggota",
    `Tahun Buku ${data.selectedYear}`
  );

  let totalJumlah = 0;
  const tableData = data.rows.map((r, idx) => {
    const jumlah = Number(r.jumlah || r.pinjaman?.jumlah || 0);
    totalJumlah += jumlah;
    return [
      idx + 1,
      r.noKontrak || r.pinjaman?.noKontrak || "-",
      r.anggota?.nama || r.nama || "-",
      r.tanggalPengajuan || r.pinjaman?.tanggalPengajuan || "-",
      formatRupiah(jumlah),
      `${r.tenorBulan || r.pinjaman?.tenorBulan || 0} Bln`,
      `${r.bungaPersen || r.pinjaman?.bungaPersen || 0}%`,
      r.status || r.pinjaman?.status || "pengajuan",
    ];
  });

  tableData.push([
    { content: "TOTAL JUMLAH PINJAMAN", colSpan: 4, styles: { fontStyle: "bold", halign: "center" } },
    formatRupiah(totalJumlah),
    "",
    "",
    "",
  ]);

  autoTable(doc, {
    startY: 52,
    head: [["NO", "NO KONTRAK", "NAMA ANGGOTA", "TANGGAL PENGAJUAN", "JUMLAH PINJAMAN", "TENOR", "BUNGA", "STATUS"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { cellWidth: 35 },
      2: { cellWidth: 55 },
      3: { halign: "center", cellWidth: 35 },
      4: { halign: "right", fontStyle: "bold" },
      5: { halign: "center", cellWidth: 20 },
      6: { halign: "center", cellWidth: 20 },
      7: { halign: "center", cellWidth: 25 },
    },
  });

  addPDFSignatures(doc, (doc as any).lastAutoTable.finalY);

  doc.save(`Laporan_Pinjaman_${data.selectedYear}.pdf`);
}
