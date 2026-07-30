CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'ketua', 'sekretaris', 'bendahara', 'pengelola_sp', 'pengelola_toko', 'anggota');--> statement-breakpoint
CREATE TYPE "public"."anggota_status" AS ENUM('aktif', 'nonaktif', 'keluar');--> statement-breakpoint
CREATE TYPE "public"."simpanan_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."simpanan_target_status" AS ENUM('aktif', 'selesai', 'batal');--> statement-breakpoint
CREATE TYPE "public"."simpanan_tipe" AS ENUM('setoran', 'penarikan');--> statement-breakpoint
CREATE TYPE "public"."jadwal_angsuran_status" AS ENUM('belum_bayar', 'sebagian', 'lunas', 'terlambat');--> statement-breakpoint
CREATE TYPE "public"."jenis_bunga" AS ENUM('flat', 'anuitas', 'efektif');--> statement-breakpoint
CREATE TYPE "public"."pinjaman_status" AS ENUM('pengajuan', 'disetujui', 'ditolak', 'cair', 'lunas', 'macet');--> statement-breakpoint
CREATE TYPE "public"."akun_laporan" AS ENUM('neraca', 'laba_rugi', 'keduanya');--> statement-breakpoint
CREATE TYPE "public"."akun_tipe" AS ENUM('aset_lancar', 'aset_tetap', 'kewajiban_lancar', 'dana', 'ekuitas', 'pendapatan', 'pengeluaran');--> statement-breakpoint
CREATE TYPE "public"."buku_kas" AS ENUM('kas_sp', 'kas_umum', 'kas_toko', 'bank');--> statement-breakpoint
CREATE TYPE "public"."transaksi_tipe" AS ENUM('pemasukan', 'pengeluaran', 'mutasi');--> statement-breakpoint
CREATE TYPE "public"."rumus_shu" AS ENUM('angsuran_total', 'angsuran_bunga', 'angsuran_pokok');--> statement-breakpoint
CREATE TYPE "public"."shu_pembagian_status" AS ENUM('dihitung', 'dibagikan');--> statement-breakpoint
CREATE TYPE "public"."notifikasi_tipe" AS ENUM('info', 'warning', 'success', 'error');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"role" "user_role" DEFAULT 'anggota' NOT NULL,
	"nama_lengkap" text,
	"anggota_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "anggota" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nomor_anggota" varchar(20) NOT NULL,
	"nik" varchar(16),
	"nama" text NOT NULL,
	"alamat" text,
	"email" varchar(255),
	"no_hp" varchar(20),
	"foto_url" text,
	"ktp_url" text,
	"tanggal_masuk" date NOT NULL,
	"tanggal_keluar" date,
	"status" "anggota_status" DEFAULT 'aktif' NOT NULL,
	"pekerjaan" text,
	"unit_kerja" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text,
	CONSTRAINT "anggota_nomor_anggota_unique" UNIQUE("nomor_anggota"),
	CONSTRAINT "anggota_nik_unique" UNIQUE("nik")
);
--> statement-breakpoint
CREATE TABLE "jenis_simpanan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kode" varchar(20) NOT NULL,
	"nama" text NOT NULL,
	"jasa_persen" text DEFAULT '0' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "jenis_simpanan_kode_unique" UNIQUE("kode")
);
--> statement-breakpoint
CREATE TABLE "simpanan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"anggota_id" uuid NOT NULL,
	"jenis_simpanan_id" uuid NOT NULL,
	"tanggal" date NOT NULL,
	"nominal" numeric(15, 2) NOT NULL,
	"tipe" "simpanan_tipe" NOT NULL,
	"keterangan" text,
	"petugas_id" text,
	"no_referensi" varchar(30),
	"status" "simpanan_status" DEFAULT 'approved' NOT NULL,
	"approved_by" text,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "simpanan_no_referensi_unique" UNIQUE("no_referensi")
);
--> statement-breakpoint
CREATE TABLE "simpanan_target" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"anggota_id" uuid NOT NULL,
	"jenis_simpanan_id" uuid NOT NULL,
	"target_nominal" numeric(15, 2) NOT NULL,
	"angsuran_per_bulan" numeric(15, 2) NOT NULL,
	"tenor_bulan" integer NOT NULL,
	"tgl_mulai" date NOT NULL,
	"tgl_selesai" date,
	"status" "simpanan_target_status" DEFAULT 'aktif' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" text
);
--> statement-breakpoint
CREATE TABLE "angsuran" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pinjaman_id" uuid NOT NULL,
	"jadwal_angsuran_id" uuid,
	"anggota_id" uuid NOT NULL,
	"tanggal" date NOT NULL,
	"pokok" numeric(15, 2) NOT NULL,
	"bunga" numeric(15, 2) DEFAULT '0' NOT NULL,
	"denda" numeric(15, 2) DEFAULT '0' NOT NULL,
	"total_bayar" numeric(15, 2) NOT NULL,
	"sisa_pinjaman" numeric(15, 2) NOT NULL,
	"no_referensi" varchar(30),
	"keterangan" text,
	"petugas_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "angsuran_no_referensi_unique" UNIQUE("no_referensi")
);
--> statement-breakpoint
CREATE TABLE "jadwal_angsuran" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pinjaman_id" uuid NOT NULL,
	"ke" integer NOT NULL,
	"tgl_jatuh_tempo" date NOT NULL,
	"pokok" numeric(15, 2) NOT NULL,
	"bunga" numeric(15, 2) NOT NULL,
	"total" numeric(15, 2) NOT NULL,
	"denda" numeric(15, 2) DEFAULT '0' NOT NULL,
	"sisa_pokok" numeric(15, 2) NOT NULL,
	"status" "jadwal_angsuran_status" DEFAULT 'belum_bayar' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pinjaman" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"no_kontrak" varchar(30) NOT NULL,
	"anggota_id" uuid NOT NULL,
	"tanggal_pengajuan" date NOT NULL,
	"tanggal_cair" date,
	"jumlah" numeric(15, 2) NOT NULL,
	"tenor_bulan" integer NOT NULL,
	"bunga_persen" numeric(5, 2) NOT NULL,
	"jenis_bunga" "jenis_bunga" DEFAULT 'flat' NOT NULL,
	"total_bunga" numeric(15, 2),
	"total_angsuran" numeric(15, 2),
	"jatuh_tempo" date,
	"asuransi_persen" numeric(5, 2) DEFAULT '0' NOT NULL,
	"biaya_asuransi" numeric(15, 2) DEFAULT '0' NOT NULL,
	"tujuan" text,
	"dokumen_url" text,
	"status" "pinjaman_status" DEFAULT 'pengajuan' NOT NULL,
	"approved_by" text,
	"approved_at" timestamp,
	"catatan" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pinjaman_no_kontrak_unique" UNIQUE("no_kontrak")
);
--> statement-breakpoint
CREATE TABLE "akun" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kode" text,
	"nama" text NOT NULL,
	"tipe" "akun_tipe" NOT NULL,
	"laporan" "akun_laporan" NOT NULL,
	"urutan" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "akun_kode_unique" UNIQUE("kode")
);
--> statement-breakpoint
CREATE TABLE "mutasi_kas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tanggal" date NOT NULL,
	"dari_kas" "buku_kas" NOT NULL,
	"ke_kas" "buku_kas" NOT NULL,
	"nominal" numeric(15, 2) NOT NULL,
	"no_referensi" varchar(30),
	"keterangan" text,
	"petugas_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mutasi_kas_no_referensi_unique" UNIQUE("no_referensi")
);
--> statement-breakpoint
CREATE TABLE "setup_saldo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"buku_kas" "buku_kas" NOT NULL,
	"saldo_awal" numeric(15, 2) DEFAULT '0' NOT NULL,
	"tanggal" date NOT NULL,
	"keterangan" text,
	"set_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "setup_saldo_buku_kas_unique" UNIQUE("buku_kas")
);
--> statement-breakpoint
CREATE TABLE "transaksi_kas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"buku_kas" "buku_kas" NOT NULL,
	"tanggal" date NOT NULL,
	"no_referensi" varchar(30),
	"akun_id" uuid,
	"tipe" "transaksi_tipe" NOT NULL,
	"nominal" numeric(15, 2) NOT NULL,
	"saldo" numeric(15, 2) NOT NULL,
	"keterangan" text,
	"ref_type" varchar(50),
	"ref_id" uuid,
	"anggota_id" uuid,
	"petugas_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transaksi_kas_no_referensi_unique" UNIQUE("no_referensi")
);
--> statement-breakpoint
CREATE TABLE "shu_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tahun" integer NOT NULL,
	"persen_jasa_simpanan" numeric(5, 2) DEFAULT '25' NOT NULL,
	"persen_jasa_sp" numeric(5, 2) DEFAULT '50' NOT NULL,
	"persen_pemdaker" numeric(5, 2) DEFAULT '2.5' NOT NULL,
	"persen_pengurus" numeric(5, 2) DEFAULT '5' NOT NULL,
	"persen_kesejahteraan" numeric(5, 2) DEFAULT '2.5' NOT NULL,
	"persen_pendidikan" numeric(5, 2) DEFAULT '2.5' NOT NULL,
	"persen_sosial" numeric(5, 2) DEFAULT '2.5' NOT NULL,
	"persen_cadangan" numeric(5, 2) DEFAULT '10' NOT NULL,
	"rumus_shu" "rumus_shu" DEFAULT 'angsuran_total' NOT NULL,
	"jasa_manasuka_persen" numeric(5, 2) DEFAULT '10' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shu_config_tahun_unique" UNIQUE("tahun")
);
--> statement-breakpoint
CREATE TABLE "shu_pembagian" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tahun" integer NOT NULL,
	"anggota_id" uuid NOT NULL,
	"shu_config_id" uuid,
	"total_shu_anggota" numeric(15, 2) NOT NULL,
	"porsi_jasa_simpanan" numeric(15, 2) DEFAULT '0' NOT NULL,
	"porsi_jasa_sp" numeric(15, 2) DEFAULT '0' NOT NULL,
	"total_diterima" numeric(15, 2) NOT NULL,
	"tanggal_pembagian" date,
	"status" "shu_pembagian_status" DEFAULT 'dihitung' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asuransi_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"persen" numeric(5, 2) NOT NULL,
	"min_pinjaman" numeric(15, 2),
	"max_pinjaman" numeric(15, 2),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pengaturan_koperasi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama_koperasi" text DEFAULT 'Koperasi Gatra' NOT NULL,
	"email" text,
	"no_telp" text,
	"alamat" text,
	"logo_url" text,
	"ketua" text,
	"sekretaris" text,
	"bendahara" text,
	"pengelola_sp" text,
	"pengelola_toko" text,
	"ketua_pengawas" text,
	"pengawas_1" text,
	"pengawas_2" text,
	"smtp_host" text,
	"smtp_port" integer,
	"smtp_user" text,
	"smtp_pass" text,
	"smtp_from" text,
	"wa_gateway_url" text,
	"wa_api_key" text,
	"nomor_rekening" text,
	"nama_bank" text,
	"atas_nama" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE TABLE "activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"action" varchar(100) NOT NULL,
	"module" varchar(50) NOT NULL,
	"ref_id" uuid,
	"description" text,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifikasi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"judul" text NOT NULL,
	"pesan" text NOT NULL,
	"tipe" "notifikasi_tipe" DEFAULT 'info' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"ref_type" varchar(50),
	"ref_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anggota" ADD CONSTRAINT "anggota_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simpanan" ADD CONSTRAINT "simpanan_anggota_id_anggota_id_fk" FOREIGN KEY ("anggota_id") REFERENCES "public"."anggota"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simpanan" ADD CONSTRAINT "simpanan_jenis_simpanan_id_jenis_simpanan_id_fk" FOREIGN KEY ("jenis_simpanan_id") REFERENCES "public"."jenis_simpanan"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simpanan" ADD CONSTRAINT "simpanan_petugas_id_user_id_fk" FOREIGN KEY ("petugas_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simpanan" ADD CONSTRAINT "simpanan_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simpanan_target" ADD CONSTRAINT "simpanan_target_anggota_id_anggota_id_fk" FOREIGN KEY ("anggota_id") REFERENCES "public"."anggota"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simpanan_target" ADD CONSTRAINT "simpanan_target_jenis_simpanan_id_jenis_simpanan_id_fk" FOREIGN KEY ("jenis_simpanan_id") REFERENCES "public"."jenis_simpanan"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simpanan_target" ADD CONSTRAINT "simpanan_target_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "angsuran" ADD CONSTRAINT "angsuran_pinjaman_id_pinjaman_id_fk" FOREIGN KEY ("pinjaman_id") REFERENCES "public"."pinjaman"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "angsuran" ADD CONSTRAINT "angsuran_jadwal_angsuran_id_jadwal_angsuran_id_fk" FOREIGN KEY ("jadwal_angsuran_id") REFERENCES "public"."jadwal_angsuran"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "angsuran" ADD CONSTRAINT "angsuran_anggota_id_anggota_id_fk" FOREIGN KEY ("anggota_id") REFERENCES "public"."anggota"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "angsuran" ADD CONSTRAINT "angsuran_petugas_id_user_id_fk" FOREIGN KEY ("petugas_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jadwal_angsuran" ADD CONSTRAINT "jadwal_angsuran_pinjaman_id_pinjaman_id_fk" FOREIGN KEY ("pinjaman_id") REFERENCES "public"."pinjaman"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pinjaman" ADD CONSTRAINT "pinjaman_anggota_id_anggota_id_fk" FOREIGN KEY ("anggota_id") REFERENCES "public"."anggota"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pinjaman" ADD CONSTRAINT "pinjaman_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pinjaman" ADD CONSTRAINT "pinjaman_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mutasi_kas" ADD CONSTRAINT "mutasi_kas_petugas_id_user_id_fk" FOREIGN KEY ("petugas_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "setup_saldo" ADD CONSTRAINT "setup_saldo_set_by_user_id_fk" FOREIGN KEY ("set_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi_kas" ADD CONSTRAINT "transaksi_kas_akun_id_akun_id_fk" FOREIGN KEY ("akun_id") REFERENCES "public"."akun"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi_kas" ADD CONSTRAINT "transaksi_kas_anggota_id_anggota_id_fk" FOREIGN KEY ("anggota_id") REFERENCES "public"."anggota"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi_kas" ADD CONSTRAINT "transaksi_kas_petugas_id_user_id_fk" FOREIGN KEY ("petugas_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shu_pembagian" ADD CONSTRAINT "shu_pembagian_anggota_id_anggota_id_fk" FOREIGN KEY ("anggota_id") REFERENCES "public"."anggota"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shu_pembagian" ADD CONSTRAINT "shu_pembagian_shu_config_id_shu_config_id_fk" FOREIGN KEY ("shu_config_id") REFERENCES "public"."shu_config"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pengaturan_koperasi" ADD CONSTRAINT "pengaturan_koperasi_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;