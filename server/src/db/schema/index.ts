import { pgTable, text, uuid, boolean, timestamp, date, varchar, numeric, integer, pgEnum } from 'drizzle-orm/pg-core'

// ─── Enums ───────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum('user_role', [
  'super_admin', 'ketua', 'sekretaris', 'bendahara',
  'pengelola_sp', 'pengelola_toko', 'anggota'
])

export const anggotaStatusEnum = pgEnum('anggota_status', ['aktif', 'nonaktif', 'keluar'])
export const simpananStatusEnum = pgEnum('simpanan_status', ['pending', 'approved', 'rejected'])
export const simpananTargetStatusEnum = pgEnum('simpanan_target_status', ['aktif', 'selesai', 'batal'])
export const simpananTipeEnum = pgEnum('simpanan_tipe', ['setoran', 'penarikan'])
export const jadwalAngsuranStatusEnum = pgEnum('jadwal_angsuran_status', ['belum_bayar', 'sebagian', 'lunas', 'terlambat'])
export const jenisBungaEnum = pgEnum('jenis_bunga', ['flat', 'anuitas', 'efektif'])
export const pinjamanStatusEnum = pgEnum('pinjaman_status', ['pengajuan', 'disetujui', 'ditolak', 'cair', 'lunas', 'macet'])
export const akunLaporanEnum = pgEnum('akun_laporan', ['neraca', 'laba_rugi', 'keduanya'])
export const akunTipeEnum = pgEnum('akun_tipe', ['aset_lancar', 'aset_tetap', 'kewajiban_lancar', 'dana', 'ekuitas', 'pendapatan', 'pengeluaran'])
export const bukuKasEnum = pgEnum('buku_kas', ['kas_sp', 'kas_umum', 'kas_toko', 'bank'])
export const transaksiTipeEnum = pgEnum('transaksi_tipe', ['pemasukan', 'pengeluaran', 'mutasi'])
export const rumusShuEnum = pgEnum('rumus_shu', ['angsuran_total', 'angsuran_bunga', 'angsuran_pokok'])
export const shuPembagianStatusEnum = pgEnum('shu_pembagian_status', ['dihitung', 'dibagikan'])
export const notifkasiTipeEnum = pgEnum('notifikasi_tipe', ['info', 'warning', 'success', 'error'])

// ─── Better-Auth Tables ───────────────────────────────────────────────────────
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ─── User Profiles (extends Better-Auth user) ────────────────────────────────
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  role: userRoleEnum('role').notNull().default('anggota'),
  namaLengkap: text('nama_lengkap'),
  anggotaId: uuid('anggota_id'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── Anggota ─────────────────────────────────────────────────────────────────
export const anggota = pgTable('anggota', {
  id: uuid('id').primaryKey().defaultRandom(),
  nomorAnggota: varchar('nomor_anggota', { length: 20 }).notNull().unique(),
  nik: varchar('nik', { length: 16 }).unique(),
  nama: text('nama').notNull(),
  alamat: text('alamat'),
  email: varchar('email', { length: 255 }),
  noHp: varchar('no_hp', { length: 20 }),
  fotoUrl: text('foto_url'),
  ktpUrl: text('ktp_url'),
  tanggalMasuk: date('tanggal_masuk').notNull(),
  tanggalKeluar: date('tanggal_keluar'),
  status: anggotaStatusEnum('status').notNull().default('aktif'),
  pekerjaan: text('pekerjaan'),
  unitKerja: text('unit_kerja'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
})

// ─── Simpanan ─────────────────────────────────────────────────────────────────
export const jenisSimpanan = pgTable('jenis_simpanan', {
  id: uuid('id').primaryKey().defaultRandom(),
  kode: varchar('kode', { length: 20 }).notNull().unique(),
  nama: text('nama').notNull(),
  jasaPersen: numeric('jasa_persen', { precision: 5, scale: 2 }).notNull().default('0'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const simpanan = pgTable('simpanan', {
  id: uuid('id').primaryKey().defaultRandom(),
  anggotaId: uuid('anggota_id').notNull().references(() => anggota.id, { onDelete: 'restrict' }),
  jenisSimpananId: uuid('jenis_simpanan_id').notNull().references(() => jenisSimpanan.id, { onDelete: 'restrict' }),
  tanggal: date('tanggal').notNull(),
  nominal: numeric('nominal', { precision: 15, scale: 2 }).notNull(),
  tipe: simpananTipeEnum('tipe').notNull(),
  keterangan: text('keterangan'),
  petugasId: text('petugas_id').references(() => user.id, { onDelete: 'set null' }),
  noReferensi: varchar('no_referensi', { length: 30 }).unique(),
  status: simpananStatusEnum('status').notNull().default('approved'),
  approvedBy: text('approved_by').references(() => user.id, { onDelete: 'set null' }),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const simpananTarget = pgTable('simpanan_target', {
  id: uuid('id').primaryKey().defaultRandom(),
  anggotaId: uuid('anggota_id').notNull().references(() => anggota.id, { onDelete: 'restrict' }),
  jenisSimpananId: uuid('jenis_simpanan_id').notNull().references(() => jenisSimpanan.id, { onDelete: 'restrict' }),
  targetNominal: numeric('target_nominal', { precision: 15, scale: 2 }).notNull(),
  angsuranPerBulan: numeric('angsuran_per_bulan', { precision: 15, scale: 2 }).notNull(),
  tenorBulan: integer('tenor_bulan').notNull(),
  tglMulai: date('tgl_mulai').notNull(),
  tglSelesai: date('tgl_selesai'),
  status: simpananTargetStatusEnum('status').notNull().default('aktif'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
})

// ─── Pinjaman ─────────────────────────────────────────────────────────────────
export const pinjaman = pgTable('pinjaman', {
  id: uuid('id').primaryKey().defaultRandom(),
  noKontrak: varchar('no_kontrak', { length: 30 }).notNull().unique(),
  anggotaId: uuid('anggota_id').notNull().references(() => anggota.id, { onDelete: 'restrict' }),
  tanggalPengajuan: date('tanggal_pengajuan').notNull(),
  tanggalCair: date('tanggal_cair'),
  jumlah: numeric('jumlah', { precision: 15, scale: 2 }).notNull(),
  tenorBulan: integer('tenor_bulan').notNull(),
  bungaPersen: numeric('bunga_persen', { precision: 5, scale: 2 }).notNull(),
  jenisBunga: jenisBungaEnum('jenis_bunga').notNull().default('flat'),
  totalBunga: numeric('total_bunga', { precision: 15, scale: 2 }),
  totalAngsuran: numeric('total_angsuran', { precision: 15, scale: 2 }),
  jatuhTempo: date('jatuh_tempo'),
  asuransiPersen: numeric('asuransi_persen', { precision: 5, scale: 2 }).notNull().default('0'),
  biayaAsuransi: numeric('biaya_asuransi', { precision: 15, scale: 2 }).notNull().default('0'),
  tujuan: text('tujuan'),
  dokumenUrl: text('dokumen_url'),
  status: pinjamanStatusEnum('status').notNull().default('pengajuan'),
  approvedBy: text('approved_by').references(() => user.id, { onDelete: 'set null' }),
  approvedAt: timestamp('approved_at'),
  catatan: text('catatan'),
  createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const jadwalAngsuran = pgTable('jadwal_angsuran', {
  id: uuid('id').primaryKey().defaultRandom(),
  pinjamanId: uuid('pinjaman_id').notNull().references(() => pinjaman.id, { onDelete: 'cascade' }),
  ke: integer('ke').notNull(),
  tglJatuhTempo: date('tgl_jatuh_tempo').notNull(),
  pokok: numeric('pokok', { precision: 15, scale: 2 }).notNull(),
  bunga: numeric('bunga', { precision: 15, scale: 2 }).notNull(),
  total: numeric('total', { precision: 15, scale: 2 }).notNull(),
  denda: numeric('denda', { precision: 15, scale: 2 }).notNull().default('0'),
  sisaPokok: numeric('sisa_pokok', { precision: 15, scale: 2 }).notNull(),
  status: jadwalAngsuranStatusEnum('status').notNull().default('belum_bayar'),
})

export const angsuran = pgTable('angsuran', {
  id: uuid('id').primaryKey().defaultRandom(),
  pinjamanId: uuid('pinjaman_id').notNull().references(() => pinjaman.id, { onDelete: 'restrict' }),
  jadwalAngsuranId: uuid('jadwal_angsuran_id').references(() => jadwalAngsuran.id, { onDelete: 'set null' }),
  anggotaId: uuid('anggota_id').notNull().references(() => anggota.id, { onDelete: 'restrict' }),
  tanggal: date('tanggal').notNull(),
  pokok: numeric('pokok', { precision: 15, scale: 2 }).notNull(),
  bunga: numeric('bunga', { precision: 15, scale: 2 }).notNull().default('0'),
  denda: numeric('denda', { precision: 15, scale: 2 }).notNull().default('0'),
  totalBayar: numeric('total_bayar', { precision: 15, scale: 2 }).notNull(),
  sisaPinjaman: numeric('sisa_pinjaman', { precision: 15, scale: 2 }).notNull(),
  noReferensi: varchar('no_referensi', { length: 30 }).unique(),
  keterangan: text('keterangan'),
  petugasId: text('petugas_id').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Kas & Akuntansi ─────────────────────────────────────────────────────────
export const akun = pgTable('akun', {
  id: uuid('id').primaryKey().defaultRandom(),
  kode: text('kode').unique(),
  nama: text('nama').notNull(),
  tipe: akunTipeEnum('tipe').notNull(),
  laporan: akunLaporanEnum('laporan').notNull(),
  urutan: integer('urutan').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const transaksiKas = pgTable('transaksi_kas', {
  id: uuid('id').primaryKey().defaultRandom(),
  bukuKas: bukuKasEnum('buku_kas').notNull(),
  tanggal: date('tanggal').notNull(),
  noReferensi: varchar('no_referensi', { length: 30 }).unique(),
  akunId: uuid('akun_id').references(() => akun.id, { onDelete: 'set null' }),
  tipe: transaksiTipeEnum('tipe').notNull(),
  nominal: numeric('nominal', { precision: 15, scale: 2 }).notNull(),
  saldo: numeric('saldo', { precision: 15, scale: 2 }).notNull(),
  keterangan: text('keterangan'),
  refType: varchar('ref_type', { length: 50 }),
  refId: uuid('ref_id'),
  anggotaId: uuid('anggota_id').references(() => anggota.id, { onDelete: 'set null' }),
  petugasId: text('petugas_id').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const mutasiKas = pgTable('mutasi_kas', {
  id: uuid('id').primaryKey().defaultRandom(),
  tanggal: date('tanggal').notNull(),
  dariKas: bukuKasEnum('dari_kas').notNull(),
  keKas: bukuKasEnum('ke_kas').notNull(),
  nominal: numeric('nominal', { precision: 15, scale: 2 }).notNull(),
  noReferensi: varchar('no_referensi', { length: 30 }).unique(),
  keterangan: text('keterangan'),
  petugasId: text('petugas_id').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const setupSaldo = pgTable('setup_saldo', {
  id: uuid('id').primaryKey().defaultRandom(),
  bukuKas: bukuKasEnum('buku_kas').notNull().unique(),
  saldoAwal: numeric('saldo_awal', { precision: 15, scale: 2 }).notNull().default('0'),
  tanggal: date('tanggal').notNull(),
  keterangan: text('keterangan'),
  setBy: text('set_by').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── SHU ─────────────────────────────────────────────────────────────────────
export const shuConfig = pgTable('shu_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  tahun: integer('tahun').notNull().unique(),
  persenJasaSimpanan: numeric('persen_jasa_simpanan', { precision: 5, scale: 2 }).notNull().default('25'),
  persenJasaSp: numeric('persen_jasa_sp', { precision: 5, scale: 2 }).notNull().default('50'),
  persenPemdaker: numeric('persen_pemdaker', { precision: 5, scale: 2 }).notNull().default('2.5'),
  persenPengurus: numeric('persen_pengurus', { precision: 5, scale: 2 }).notNull().default('5'),
  persenKesejahteraan: numeric('persen_kesejahteraan', { precision: 5, scale: 2 }).notNull().default('2.5'),
  persenPendidikan: numeric('persen_pendidikan', { precision: 5, scale: 2 }).notNull().default('2.5'),
  persenSosial: numeric('persen_sosial', { precision: 5, scale: 2 }).notNull().default('2.5'),
  persenCadangan: numeric('persen_cadangan', { precision: 5, scale: 2 }).notNull().default('10'),
  rumusShu: rumusShuEnum('rumus_shu').notNull().default('angsuran_total'),
  jasaManasukaPersen: numeric('jasa_manasuka_persen', { precision: 5, scale: 2 }).notNull().default('10'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const shuPembagian = pgTable('shu_pembagian', {
  id: uuid('id').primaryKey().defaultRandom(),
  tahun: integer('tahun').notNull(),
  anggotaId: uuid('anggota_id').notNull().references(() => anggota.id, { onDelete: 'restrict' }),
  shuConfigId: uuid('shu_config_id').references(() => shuConfig.id, { onDelete: 'set null' }),
  totalShuAnggota: numeric('total_shu_anggota', { precision: 15, scale: 2 }).notNull(),
  porsiJasaSimpanan: numeric('porsi_jasa_simpanan', { precision: 15, scale: 2 }).notNull().default('0'),
  porsiJasaSp: numeric('porsi_jasa_sp', { precision: 15, scale: 2 }).notNull().default('0'),
  totalDiterima: numeric('total_diterima', { precision: 15, scale: 2 }).notNull(),
  tanggalPembagian: date('tanggal_pembagian'),
  status: shuPembagianStatusEnum('status').notNull().default('dihitung'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Config & Utilities ───────────────────────────────────────────────────────
export const asuransiConfig = pgTable('asuransi_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  nama: text('nama').notNull(),
  persen: numeric('persen', { precision: 5, scale: 2 }).notNull(),
  minPinjaman: numeric('min_pinjaman', { precision: 15, scale: 2 }),
  maxPinjaman: numeric('max_pinjaman', { precision: 15, scale: 2 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const pengaturanKoperasi = pgTable('pengaturan_koperasi', {
  id: uuid('id').primaryKey().defaultRandom(),
  namaKoperasi: text('nama_koperasi').notNull().default('Koperasi Gatra'),
  email: text('email'),
  noTelp: text('no_telp'),
  alamat: text('alamat'),
  logoUrl: text('logo_url'),
  ketua: text('ketua'),
  sekretaris: text('sekretaris'),
  bendahara: text('bendahara'),
  pengelolaSp: text('pengelola_sp'),
  pengelolaToko: text('pengelola_toko'),
  ketuaPengawas: text('ketua_pengawas'),
  pengawas1: text('pengawas_1'),
  pengawas2: text('pengawas_2'),
  smtpHost: text('smtp_host'),
  smtpPort: integer('smtp_port'),
  smtpUser: text('smtp_user'),
  smtpPass: text('smtp_pass'),
  smtpFrom: text('smtp_from'),
  waGatewayUrl: text('wa_gateway_url'),
  waApiKey: text('wa_api_key'),
  nomorRekening: text('nomor_rekening'),
  namaBank: text('nama_bank'),
  atasNama: text('atas_nama'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  updatedBy: text('updated_by').references(() => user.id, { onDelete: 'set null' }),
})

export const activityLog = pgTable('activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  module: varchar('module', { length: 50 }).notNull(),
  refId: uuid('ref_id'),
  description: text('description'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const notifikasi = pgTable('notifikasi', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  judul: text('judul').notNull(),
  pesan: text('pesan').notNull(),
  tipe: notifkasiTipeEnum('tipe').notNull().default('info'),
  isRead: boolean('is_read').notNull().default(false),
  refType: varchar('ref_type', { length: 50 }),
  refId: uuid('ref_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
