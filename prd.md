# Product Requirements Document (PRD)

# Website & Aplikasi Koperasi Modern Indonesia

**Nama Produk:** KoperasiHub (Placeholder)
**Versi:** 1.0
**Target Pengguna:** Koperasi Konsumen (Koperasi Pegawai/Karyawan Sekolah)
**Platform:** Responsive Web Application (Desktop & Mobile)
**Bahasa:** Indonesia

---

# 1. Executive Summary

Website ini bertujuan menjadi sistem informasi dan aplikasi operasional koperasi yang modern, sederhana, cepat digunakan, namun memiliki tampilan premium.

Website terdiri dari dua bagian:

1. Landing Page
   * Sebagai profil koperasi
   * Menampilkan informasi kepada masyarakat
   * Media promosi

2. Web Application
   * Digunakan oleh pengurus dan anggota
   * Mengelola seluruh aktivitas koperasi

Konsep desain:
* Minimalis
* Modern
* Fast Loading
* Glassmorphism ringan
* Dominasi warna Hijau Emerald + Putih + Abu Muda
* Dashboard seperti aplikasi fintech.

---

# 2. Goals

### Tujuan Bisnis
* Digitalisasi koperasi
* Transparansi keuangan
* Mempermudah anggota melihat simpanan dan pinjaman
* Mempermudah laporan bendahara
* Mengurangi pencatatan manual

---

# Tujuan User

Anggota dapat:
* Login
* Melihat simpanan
* Melihat pinjaman
* Melihat angsuran
* Melihat SHU
* Download laporan pribadi

---

# 3. User Role

## 1. Master Admin

Hak akses penuh

Dapat:
* Mengatur semua menu
* Mengatur user
* Mengatur role
* Backup database
* Restore database
* Pengaturan website
* Pengaturan landing page
* Approval transaksi
* Melihat seluruh laporan

---

## 2. Ketua

Dapat:
Dashboard Monitoring
* Total aset
* Total anggota
* Simpanan
* Pinjaman
* SHU
* Grafik

Approval
* Persetujuan pinjaman
* Persetujuan anggota baru

Laporan
* Neraca
* Laba rugi
* SHU
* Buku besar

Tidak dapat mengubah transaksi.

---

## 3. Bendahara Umum

Mengelola:
Kas
Bank
Modal
SHU
Pendapatan
Biaya Operasional
Simpanan Pokok
Simpanan Wajib
Simpanan Sukarela
Simpanan Pendidikan
Angsuran
Jasa

Input:
Kas Masuk
Kas Keluar
Transfer/Mutasi
Jurnal

Laporan:
Kas
Buku Besar
Neraca
Laba Rugi
Arus Kas

---

## 4. Bendahara Simpan Pinjam

Mengelola:
Anggota
Simpanan Pokok
Simpanan Wajib
Simpanan Sukarela
Simpanan Pendidikan
Pinjaman
Biaya Asuransi
Angsuran
Jasa
Approval pembayaran
Laporan Simpan Pinjam

---

## 5. Bendahara Toko

Mengelola:
Produk
Kategori
Supplier
Pembelian
Penjualan
Stok
Barcode
Laporan Penjualan
Laporan Pembelian
Laporan Stok

---

## 6. Anggota

Melihat data pribadi

Tidak dapat mengubah data keuangan.

Menu:
Dashboard
Profil
Simpanan
Pinjaman
Angsuran
SHU
Riwayat
Download laporan

Notifikasi

---

# 4. Sitemap

```
Landing Page

Home
Tentang
Layanan
Produk
Pengurus
Berita
FAQ
Kontak
Login

↓

Login

↓

Dashboard sesuai Role
```

---

# 5. Landing Page

## Hero Section

Background full width

Judul besar

> "Koperasi Modern untuk Masa Depan Anggota"

Subtitle

"Tumbuh Bersama, Sejahtera Bersama"

Button

Masuk

Daftar Anggota

Hubungi Kami

Ilustrasi modern.

---

## Tentang

Sejarah

Visi

Misi

Nilai koperasi

---

## Layanan

Icon Card

* Simpanan
* Pinjaman
* Toko
* SHU
* Pembayaran Online

---

## Statistik

Counter Animation

Jumlah Anggota

Aset

Pinjaman

SHU

Tahun Berdiri

---

## Berita

Card modern

Image

Tanggal

Kategori

---

## Testimoni

Slider

---

## FAQ

Accordion

---

## Kontak

Google Maps

Alamat

WhatsApp

Email

Jam Operasional

---

## Footer

Quick Link

Media Sosial

Copyright

---

# 6. Login

Login menggunakan

Username

Password

Captcha

Remember Me

Forgot Password

OTP Email (opsional)

---

# 7. Dashboard

Menggunakan konsep

Material Dashboard

Card

Chart

Progress

Notification

Recent Activity

Quick Action

---

# Dashboard Widget

Saldo Kas

Total Simpanan

Total Pinjaman

SHU

Jumlah Anggota

Transaksi Hari Ini

Grafik Bulanan

---

# 8. Modul Anggota

Data:

Nomor Anggota

NIK

Nama

Alamat

Email

HP

Foto

Tanggal Masuk

Status

Pekerjaan

Unit Kerja

Upload KTP

Upload Foto

---

# 9. Modul Simpanan

Jenis:

Pokok

Wajib

Sukarela

Pendidikan

Data:

Tanggal

Nominal

Keterangan

Petugas

Status

---

# 10. Modul Pinjaman

No Kontrak

Tanggal

Jumlah

Tenor

Bunga

Jatuh Tempo

Status

Dokumen

---

# 11. Modul Angsuran

Riwayat

Pokok

Bunga

Denda

Sisa Pinjaman

Status

---

# 12. Modul SHU

Perhitungan

Pembagian

Riwayat

Download Slip SHU

---

# 13. Modul Kas

Kas Masuk

Kas Keluar

Transfer

Saldo

---

# 14. Modul Akuntansi

Chart of Account

Jurnal

Buku Besar

Neraca

Laba Rugi

Arus Kas

---

# 15. Modul Inventori Toko

Produk

Kategori

Supplier

Pembelian

Penjualan

Stok

Retur

Barcode

Stock Opname

---

# 16. Laporan

Semua laporan dapat

Preview

Print

Export PDF

Export Excel

Filter tanggal

---

# 17. Notifikasi

Realtime

Email

WhatsApp (opsional)

Push Notification

---

# 18. Pengaturan

Logo

Nama Koperasi

Alamat

Theme

Backup

Restore

SMTP

WhatsApp Gateway

Nomor Rekening

---

# 19. Database (ERD Sederhana)

```
users
roles
permissions

anggota

simpanan

jenis_simpanan

pinjaman

angsuran

kas

akun

jurnal

produk

kategori

supplier

stok

penjualan

pembelian

pengaturan

berita

banner

notifikasi

activity_log
```

---

# 20. UI Style Guide

## Warna

Primary

Emerald #10B981

Secondary

Blue #2563EB

Accent

Amber #F59E0B

Danger

Red #EF4444

Background

#F8FAFC

Card

White

---

## Font

Poppins

Inter

---

## Border Radius

16 px

---

## Shadow

Soft Shadow

Glass Effect

---

## Icon

Heroicons

Lucide

---

# 21. Teknologi

Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* React Hook Form
* TanStack Query
* Chart.js atau Recharts

Backend

* Laravel 12 (REST API) atau NestJS
* JWT Authentication
* Role-Based Access Control (RBAC)
* API Documentation (OpenAPI/Swagger)

Database

* PostgreSQL (disarankan) atau MySQL 8

Storage

* Object Storage (S3 Compatible) untuk dokumen dan foto

Deployment

* Docker
* Nginx
* SSL
* CI/CD GitHub Actions

---

# 22. Non Functional Requirements

* Mobile Responsive
* SEO Friendly (Landing Page)
* Fast Loading (< 2 detik untuk halaman umum)
* Aksesibilitas dasar (WCAG)
* Backup otomatis harian
* Audit Log untuk setiap perubahan data
* Enkripsi password menggunakan bcrypt/Argon2
* Session timeout yang dapat dikonfigurasi
* Dukungan hingga ±10.000 anggota tanpa perubahan arsitektur besar

---

# 23. Roadmap Pengembangan

### Fase 1 — Landing Page

* Profil koperasi
* Berita
* Kontak
* Login

### Fase 2 — Core Koperasi

* Login & RBAC
* Dashboard
* Data anggota
* Simpanan
* Pinjaman
* Angsuran

### Fase 3 — Keuangan

* Kas
* Akuntansi
* Laporan
* SHU

### Fase 4 — Toko Koperasi

* Inventori
* Penjualan
* Pembelian
* Supplier

### Fase 5 — Integrasi & Otomasi

* Notifikasi WhatsApp
* QR Code anggota
* Pembayaran QRIS (jika tersedia)
* Tanda tangan digital
* E-Statement anggota
* Backup cloud otomatis

---

# 24. Future Enhancement

* Progressive Web App (PWA)
* Aplikasi Android/iOS berbasis Flutter
* Single Sign-On (SSO)
* Integrasi Dukcapil (sesuai regulasi)
* Integrasi payment gateway
* AI Assistant untuk membantu menjawab pertanyaan anggota
* Dashboard analitik prediktif (tren simpanan, pinjaman, dan arus kas)
* Multi-cabang (multi-branch) dan multi-koperasi dalam satu platform

## Nilai Pembeda (Unique Selling Proposition)

Agar tampil sederhana tetapi tetap terasa modern dan profesional, aplikasi sebaiknya mengusung konsep **"Banking Experience for Cooperative"**, yaitu pengalaman pengguna yang menyerupai aplikasi perbankan digital. Setiap pengguna langsung melihat informasi yang paling penting sesuai perannya. Misalnya, anggota melihat total simpanan, sisa pinjaman, angsuran berikutnya, dan estimasi SHU dalam bentuk kartu ringkas serta grafik yang mudah dipahami. Pengurus memperoleh dashboard dengan indikator kesehatan koperasi, tren keuangan, dan aktivitas terbaru. Dengan pendekatan ini, sistem tidak hanya berfungsi sebagai alat administrasi, tetapi juga menjadi media transparansi dan meningkatkan kepercayaan seluruh anggota terhadap pengelolaan koperasi.
