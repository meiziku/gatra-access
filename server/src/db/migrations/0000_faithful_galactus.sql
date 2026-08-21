CREATE TABLE `account` (
	`id` varchar(255) NOT NULL,
	`account_id` varchar(255) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` text,
	`password` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `activity_log` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(255),
	`action` varchar(100) NOT NULL,
	`module` varchar(50) NOT NULL,
	`ref_id` varchar(36),
	`description` text,
	`ip_address` varchar(45),
	`user_agent` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `akun` (
	`id` varchar(36) NOT NULL,
	`kode` varchar(50),
	`nama` text NOT NULL,
	`tipe` enum('aset_lancar','aset_tetap','kewajiban_lancar','dana','ekuitas','pendapatan','pengeluaran') NOT NULL,
	`laporan` enum('neraca','laba_rugi','keduanya') NOT NULL,
	`urutan` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `akun_id` PRIMARY KEY(`id`),
	CONSTRAINT `akun_kode_unique` UNIQUE(`kode`)
);
--> statement-breakpoint
CREATE TABLE `anggota` (
	`id` varchar(36) NOT NULL,
	`nomor_anggota` varchar(20) NOT NULL,
	`nik` varchar(16),
	`nama` text NOT NULL,
	`alamat` text,
	`email` varchar(255),
	`no_hp` varchar(20),
	`foto_url` text,
	`ktp_url` text,
	`tanggal_masuk` date NOT NULL,
	`tanggal_keluar` date,
	`status` enum('aktif','nonaktif','keluar') NOT NULL DEFAULT 'aktif',
	`pekerjaan` text,
	`unit_kerja` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(255),
	CONSTRAINT `anggota_id` PRIMARY KEY(`id`),
	CONSTRAINT `anggota_nomor_anggota_unique` UNIQUE(`nomor_anggota`),
	CONSTRAINT `anggota_nik_unique` UNIQUE(`nik`)
);
--> statement-breakpoint
CREATE TABLE `angsuran` (
	`id` varchar(36) NOT NULL,
	`pinjaman_id` varchar(36) NOT NULL,
	`jadwal_angsuran_id` varchar(36),
	`anggota_id` varchar(36) NOT NULL,
	`tanggal` date NOT NULL,
	`pokok` decimal(15,2) NOT NULL,
	`bunga` decimal(15,2) NOT NULL DEFAULT '0',
	`denda` decimal(15,2) NOT NULL DEFAULT '0',
	`total_bayar` decimal(15,2) NOT NULL,
	`sisa_pinjaman` decimal(15,2) NOT NULL,
	`no_referensi` varchar(30),
	`keterangan` text,
	`petugas_id` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `angsuran_id` PRIMARY KEY(`id`),
	CONSTRAINT `angsuran_no_referensi_unique` UNIQUE(`no_referensi`)
);
--> statement-breakpoint
CREATE TABLE `asuransi_config` (
	`id` varchar(36) NOT NULL,
	`nama` text NOT NULL,
	`persen` decimal(5,2) NOT NULL,
	`min_pinjaman` decimal(15,2),
	`max_pinjaman` decimal(15,2),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `asuransi_config_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jadwal_angsuran` (
	`id` varchar(36) NOT NULL,
	`pinjaman_id` varchar(36) NOT NULL,
	`ke` int NOT NULL,
	`tgl_jatuh_tempo` date NOT NULL,
	`pokok` decimal(15,2) NOT NULL,
	`bunga` decimal(15,2) NOT NULL,
	`total` decimal(15,2) NOT NULL,
	`denda` decimal(15,2) NOT NULL DEFAULT '0',
	`sisa_pokok` decimal(15,2) NOT NULL,
	`status` enum('belum_bayar','sebagian','lunas','terlambat') NOT NULL DEFAULT 'belum_bayar',
	CONSTRAINT `jadwal_angsuran_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jenis_simpanan` (
	`id` varchar(36) NOT NULL,
	`kode` varchar(20) NOT NULL,
	`nama` text NOT NULL,
	`jasa_persen` decimal(5,2) NOT NULL DEFAULT '0',
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jenis_simpanan_id` PRIMARY KEY(`id`),
	CONSTRAINT `jenis_simpanan_kode_unique` UNIQUE(`kode`)
);
--> statement-breakpoint
CREATE TABLE `mutasi_kas` (
	`id` varchar(36) NOT NULL,
	`tanggal` date NOT NULL,
	`dari_kas` enum('kas_sp','kas_umum','kas_toko','bank') NOT NULL,
	`ke_kas` enum('kas_sp','kas_umum','kas_toko','bank') NOT NULL,
	`nominal` decimal(15,2) NOT NULL,
	`no_referensi` varchar(30),
	`keterangan` text,
	`petugas_id` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mutasi_kas_id` PRIMARY KEY(`id`),
	CONSTRAINT `mutasi_kas_no_referensi_unique` UNIQUE(`no_referensi`)
);
--> statement-breakpoint
CREATE TABLE `notifikasi` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`judul` text NOT NULL,
	`pesan` text NOT NULL,
	`tipe` enum('info','warning','success','error') NOT NULL DEFAULT 'info',
	`is_read` boolean NOT NULL DEFAULT false,
	`ref_type` varchar(50),
	`ref_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifikasi_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pengaturan_koperasi` (
	`id` varchar(36) NOT NULL,
	`nama_koperasi` text NOT NULL DEFAULT ('Koperasi Gatra'),
	`email` text,
	`no_telp` text,
	`alamat` text,
	`logo_url` text,
	`ketua` text,
	`sekretaris` text,
	`bendahara` text,
	`pengelola_sp` text,
	`pengelola_toko` text,
	`ketua_pengawas` text,
	`pengawas_1` text,
	`pengawas_2` text,
	`smtp_host` text,
	`smtp_port` int,
	`smtp_user` text,
	`smtp_pass` text,
	`smtp_from` text,
	`wa_gateway_url` text,
	`wa_api_key` text,
	`nomor_rekening` text,
	`nama_bank` text,
	`atas_nama` text,
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`updated_by` varchar(255),
	CONSTRAINT `pengaturan_koperasi_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pinjaman` (
	`id` varchar(36) NOT NULL,
	`no_kontrak` varchar(30) NOT NULL,
	`anggota_id` varchar(36) NOT NULL,
	`tanggal_pengajuan` date NOT NULL,
	`tanggal_cair` date,
	`jumlah` decimal(15,2) NOT NULL,
	`tenor_bulan` int NOT NULL,
	`bunga_persen` decimal(5,2) NOT NULL,
	`jenis_bunga` enum('flat','anuitas','efektif') NOT NULL DEFAULT 'flat',
	`total_bunga` decimal(15,2),
	`total_angsuran` decimal(15,2),
	`jatuh_tempo` date,
	`asuransi_persen` decimal(5,2) NOT NULL DEFAULT '0',
	`biaya_asuransi` decimal(15,2) NOT NULL DEFAULT '0',
	`tujuan` text,
	`dokumen_url` text,
	`status` enum('pengajuan','disetujui','ditolak','cair','lunas','macet') NOT NULL DEFAULT 'pengajuan',
	`approved_by` varchar(255),
	`approved_at` timestamp,
	`catatan` text,
	`created_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pinjaman_id` PRIMARY KEY(`id`),
	CONSTRAINT `pinjaman_no_kontrak_unique` UNIQUE(`no_kontrak`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `setup_saldo` (
	`id` varchar(36) NOT NULL,
	`buku_kas` enum('kas_sp','kas_umum','kas_toko','bank') NOT NULL,
	`saldo_awal` decimal(15,2) NOT NULL DEFAULT '0',
	`tanggal` date NOT NULL,
	`keterangan` text,
	`set_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `setup_saldo_id` PRIMARY KEY(`id`),
	CONSTRAINT `setup_saldo_buku_kas_unique` UNIQUE(`buku_kas`)
);
--> statement-breakpoint
CREATE TABLE `shu_config` (
	`id` varchar(36) NOT NULL,
	`tahun` int NOT NULL,
	`persen_jasa_simpanan` decimal(5,2) NOT NULL DEFAULT '25',
	`persen_jasa_sp` decimal(5,2) NOT NULL DEFAULT '50',
	`persen_pemdaker` decimal(5,2) NOT NULL DEFAULT '2.5',
	`persen_pengurus` decimal(5,2) NOT NULL DEFAULT '5',
	`persen_kesejahteraan` decimal(5,2) NOT NULL DEFAULT '2.5',
	`persen_pendidikan` decimal(5,2) NOT NULL DEFAULT '2.5',
	`persen_sosial` decimal(5,2) NOT NULL DEFAULT '2.5',
	`persen_cadangan` decimal(5,2) NOT NULL DEFAULT '10',
	`rumus_shu` enum('angsuran_total','angsuran_bunga','angsuran_pokok') NOT NULL DEFAULT 'angsuran_total',
	`jasa_manasuka_persen` decimal(5,2) NOT NULL DEFAULT '10',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shu_config_id` PRIMARY KEY(`id`),
	CONSTRAINT `shu_config_tahun_unique` UNIQUE(`tahun`)
);
--> statement-breakpoint
CREATE TABLE `shu_pembagian` (
	`id` varchar(36) NOT NULL,
	`tahun` int NOT NULL,
	`anggota_id` varchar(36) NOT NULL,
	`shu_config_id` varchar(36),
	`total_shu_anggota` decimal(15,2) NOT NULL,
	`porsi_jasa_simpanan` decimal(15,2) NOT NULL DEFAULT '0',
	`porsi_jasa_sp` decimal(15,2) NOT NULL DEFAULT '0',
	`total_diterima` decimal(15,2) NOT NULL,
	`tanggal_pembagian` date,
	`status` enum('dihitung','dibagikan') NOT NULL DEFAULT 'dihitung',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shu_pembagian_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `simpanan` (
	`id` varchar(36) NOT NULL,
	`anggota_id` varchar(36) NOT NULL,
	`jenis_simpanan_id` varchar(36) NOT NULL,
	`tanggal` date NOT NULL,
	`nominal` decimal(15,2) NOT NULL,
	`tipe` enum('setoran','penarikan') NOT NULL,
	`keterangan` text,
	`petugas_id` varchar(255),
	`no_referensi` varchar(30),
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'approved',
	`approved_by` varchar(255),
	`approved_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `simpanan_id` PRIMARY KEY(`id`),
	CONSTRAINT `simpanan_no_referensi_unique` UNIQUE(`no_referensi`)
);
--> statement-breakpoint
CREATE TABLE `simpanan_target` (
	`id` varchar(36) NOT NULL,
	`anggota_id` varchar(36) NOT NULL,
	`jenis_simpanan_id` varchar(36) NOT NULL,
	`target_nominal` decimal(15,2) NOT NULL,
	`angsuran_per_bulan` decimal(15,2) NOT NULL,
	`tenor_bulan` int NOT NULL,
	`tgl_mulai` date NOT NULL,
	`tgl_selesai` date,
	`status` enum('aktif','selesai','batal') NOT NULL DEFAULT 'aktif',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(255),
	CONSTRAINT `simpanan_target_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transaksi_kas` (
	`id` varchar(36) NOT NULL,
	`buku_kas` enum('kas_sp','kas_umum','kas_toko','bank') NOT NULL,
	`tanggal` date NOT NULL,
	`no_referensi` varchar(30),
	`akun_id` varchar(36),
	`tipe` enum('pemasukan','pengeluaran','mutasi') NOT NULL,
	`nominal` decimal(15,2) NOT NULL,
	`saldo` decimal(15,2) NOT NULL,
	`keterangan` text,
	`ref_type` varchar(50),
	`ref_id` varchar(36),
	`anggota_id` varchar(36),
	`petugas_id` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transaksi_kas_id` PRIMARY KEY(`id`),
	CONSTRAINT `transaksi_kas_no_referensi_unique` UNIQUE(`no_referensi`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`role` enum('super_admin','ketua','sekretaris','bendahara','pengelola_sp','pengelola_toko','anggota') NOT NULL DEFAULT 'anggota',
	`nama_lengkap` text,
	`anggota_id` varchar(36),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(255) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activity_log` ADD CONSTRAINT `activity_log_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anggota` ADD CONSTRAINT `anggota_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `angsuran` ADD CONSTRAINT `angsuran_pinjaman_id_pinjaman_id_fk` FOREIGN KEY (`pinjaman_id`) REFERENCES `pinjaman`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `angsuran` ADD CONSTRAINT `angsuran_jadwal_angsuran_id_jadwal_angsuran_id_fk` FOREIGN KEY (`jadwal_angsuran_id`) REFERENCES `jadwal_angsuran`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `angsuran` ADD CONSTRAINT `angsuran_anggota_id_anggota_id_fk` FOREIGN KEY (`anggota_id`) REFERENCES `anggota`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `angsuran` ADD CONSTRAINT `angsuran_petugas_id_user_id_fk` FOREIGN KEY (`petugas_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jadwal_angsuran` ADD CONSTRAINT `jadwal_angsuran_pinjaman_id_pinjaman_id_fk` FOREIGN KEY (`pinjaman_id`) REFERENCES `pinjaman`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mutasi_kas` ADD CONSTRAINT `mutasi_kas_petugas_id_user_id_fk` FOREIGN KEY (`petugas_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifikasi` ADD CONSTRAINT `notifikasi_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pengaturan_koperasi` ADD CONSTRAINT `pengaturan_koperasi_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pinjaman` ADD CONSTRAINT `pinjaman_anggota_id_anggota_id_fk` FOREIGN KEY (`anggota_id`) REFERENCES `anggota`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pinjaman` ADD CONSTRAINT `pinjaman_approved_by_user_id_fk` FOREIGN KEY (`approved_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pinjaman` ADD CONSTRAINT `pinjaman_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `setup_saldo` ADD CONSTRAINT `setup_saldo_set_by_user_id_fk` FOREIGN KEY (`set_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shu_pembagian` ADD CONSTRAINT `shu_pembagian_anggota_id_anggota_id_fk` FOREIGN KEY (`anggota_id`) REFERENCES `anggota`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shu_pembagian` ADD CONSTRAINT `shu_pembagian_shu_config_id_shu_config_id_fk` FOREIGN KEY (`shu_config_id`) REFERENCES `shu_config`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `simpanan` ADD CONSTRAINT `simpanan_anggota_id_anggota_id_fk` FOREIGN KEY (`anggota_id`) REFERENCES `anggota`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `simpanan` ADD CONSTRAINT `simpanan_jenis_simpanan_id_jenis_simpanan_id_fk` FOREIGN KEY (`jenis_simpanan_id`) REFERENCES `jenis_simpanan`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `simpanan` ADD CONSTRAINT `simpanan_petugas_id_user_id_fk` FOREIGN KEY (`petugas_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `simpanan` ADD CONSTRAINT `simpanan_approved_by_user_id_fk` FOREIGN KEY (`approved_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `simpanan_target` ADD CONSTRAINT `simpanan_target_anggota_id_anggota_id_fk` FOREIGN KEY (`anggota_id`) REFERENCES `anggota`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `simpanan_target` ADD CONSTRAINT `simpanan_target_jenis_simpanan_id_jenis_simpanan_id_fk` FOREIGN KEY (`jenis_simpanan_id`) REFERENCES `jenis_simpanan`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `simpanan_target` ADD CONSTRAINT `simpanan_target_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaksi_kas` ADD CONSTRAINT `transaksi_kas_akun_id_akun_id_fk` FOREIGN KEY (`akun_id`) REFERENCES `akun`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaksi_kas` ADD CONSTRAINT `transaksi_kas_anggota_id_anggota_id_fk` FOREIGN KEY (`anggota_id`) REFERENCES `anggota`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaksi_kas` ADD CONSTRAINT `transaksi_kas_petugas_id_user_id_fk` FOREIGN KEY (`petugas_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;