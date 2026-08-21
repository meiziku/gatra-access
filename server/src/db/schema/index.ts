import { mysqlTable, text, varchar, boolean, timestamp, date, decimal, int, mysqlEnum } from 'drizzle-orm/mysql-core'
import crypto from 'crypto'

// ─── Enums ───────────────────────────────────────────────────────────────────
export const userRoleValues = ['super_admin', 'ketua', 'sekretaris', 'bendahara', 'pengelola_sp', 'pengelola_toko', 'anggota'] as const
export const anggotaStatusValues = ['aktif', 'nonaktif', 'keluar'] as const
export const simpananStatusValues = ['pending', 'approved', 'rejected'] as const
export const simpananTargetStatusValues = ['aktif', 'selesai', 'batal'] as const
export const simpananTipeValues = ['setoran', 'penarikan'] as const
export const jadwalAngsuranStatusValues = ['belum_bayar', 'sebagian', 'lunas', 'terlambat'] as const
export const jenisBungaValues = ['flat', 'anuitas', 'efektif'] as const
export const pinjamanStatusValues = ['pengajuan', 'disetujui', 'ditolak', 'cair', 'lunas', 'macet'] as const
export const akunLaporanValues = ['neraca', 'laba_rugi', 'keduanya'] as const
export const akunTipeValues = ['aset_lancar', 'aset_tetap', 'kewajiban_lancar', 'dana', 'ekuitas', 'pendapatan', 'pengeluaran'] as const
export const bukuKasValues = ['kas_sp', 'kas_umum', 'kas_toko', 'bank'] as const
export const transaksiTipeValues = ['pemasukan', 'pengeluaran', 'mutasi'] as const
export const rumusShuValues = ['angsuran_total', 'angsuran_bunga', 'angsuran_pokok'] as const
export const shuPembagianStatusValues = ['dihitung', 'dibagikan'] as const
export const notifikasiTipeValues = ['info', 'warning', 'success', 'error'] as const

// Legacy enum exports for type compat if needed
export const userRoleEnum = (name: string) => mysqlEnum(name, userRoleValues)
export const anggotaStatusEnum = (name: string) => mysqlEnum(name, anggotaStatusValues)
export const simpananStatusEnum = (name: string) => mysqlEnum(name, simpananStatusValues)
export const simpananTargetStatusEnum = (name: string) => mysqlEnum(name, simpananTargetStatusValues)
export const simpananTipeEnum = (name: string) => mysqlEnum(name, simpananTipeValues)
export const jadwalAngsuranStatusEnum = (name: string) => mysqlEnum(name, jadwalAngsuranStatusValues)
export const jenisBungaEnum = (name: string) => mysqlEnum(name, jenisBungaValues)
export const pinjamanStatusEnum = (name: string) => mysqlEnum(name, pinjamanStatusValues)
export const akunLaporanEnum = (name: string) => mysqlEnum(name, akunLaporanValues)
export const akunTipeEnum = (name: string) => mysqlEnum(name, akunTipeValues)
export const bukuKasEnum = (name: string) => mysqlEnum(name, bukuKasValues)
export const transaksiTipeEnum = (name: string) => mysqlEnum(name, transaksiTipeValues)
export const rumusShuEnum = (name: string) => mysqlEnum(name, rumusShuValues)
export const shuPembagianStatusEnum = (name: string) => mysqlEnum(name, shuPembagianStatusValues)
export const notifkasiTipeEnum = (name: string) => mysqlEnum(name, notifikasiTipeValues)

// ─── Better-Auth Tables ───────────────────────────────────────────────────────
export const user = mysqlTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const session = mysqlTable('session', {
  id: varchar('id', { length: 255 }).primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = mysqlTable('account', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: varchar('account_id', { length: 255 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
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

export const verification = mysqlTable('verification', {
  id: varchar('id', { length: 255 }).primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ─── User Profiles (extends Better-Auth user) ────────────────────────────────
export const userProfiles = mysqlTable('user_profiles', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 }).notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  role: mysqlEnum('role', userRoleValues).notNull().default('anggota'),
  namaLengkap: text('nama_lengkap'),
  anggotaId: varchar('anggota_id', { length: 36 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── Anggota ─────────────────────────────────────────────────────────────────
export const anggota = mysqlTable('anggota', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
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
  status: mysqlEnum('status', anggotaStatusValues).notNull().default('aktif'),
  pekerjaan: text('pekerjaan'),
  unitKerja: text('unit_kerja'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: varchar('created_by', { length: 255 }).references(() => user.id, { onDelete: 'set null' }),
})

// ─── Simpanan ─────────────────────────────────────────────────────────────────
export const jenisSimpanan = mysqlTable('jenis_simpanan', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  kode: varchar('kode', { length: 20 }).notNull().unique(),
  nama: text('nama').notNull(),
  jasaPersen: decimal('jasa_persen', { precision: 5, scale: 2 }).notNull().default('0'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const simpanan = mysqlTable('simpanan', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  anggotaId: varchar('anggota_id', { length: 36 }).notNull().references(() => anggota.id, { onDelete: 'restrict' }),
  jenisSimpananId: varchar('jenis_simpanan_id', { length: 36 }).notNull().references(() => jenisSimpanan.id, { onDelete: 'restrict' }),
  tanggal: date('tanggal').notNull(),
  nominal: decimal('nominal', { precision: 15, scale: 2 }).notNull(),
  tipe: mysqlEnum('tipe', simpananTipeValues).notNull(),
  keterangan: text('keterangan'),
  petugasId: varchar('petugas_id', { length: 255 }).references(() => user.id, { onDelete: 'set null' }),
  noReferensi: varchar('no_referensi', { length: 30 }).unique(),
  status: mysqlEnum('status', simpananStatusValues).notNull().default('approved'),
  approvedBy: varchar('approved_by', { length: 255 }).references(() => user.id, { onDelete: 'set null' }),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const simpananTarget = mysqlTable('simpanan_target', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  anggotaId: varchar('anggota_id', { length: 36 }).notNull().references(() => anggota.id, { onDelete: 'restrict' }),
  jenisSimpananId: varchar('jenis_simpanan_id', { length: 36 }).notNull().references(() => jenisSimpanan.id, { onDelete: 'restrict' }),
  targetNominal: decimal('target_nominal', { precision: 15, scale: 2 }).notNull(),
  angsuranPerBulan: decimal('angsuran_per_bulan', { precision: 15, scale: 2 }).notNull(),
  tenorBulan: int('tenor_bulan').notNull(),
  tglMulai: date('tgl_mulai').notNull(),
  tglSelesai: date('tgl_selesai'),
  status: mysqlEnum('status', simpananTargetStatusValues).notNull().default('aktif'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  createdBy: varchar('created_by', { length: 255 }).references(() => user.id, { onDelete: 'set null' }),
})

// ─── Pinjaman ─────────────────────────────────────────────────────────────────
export const pinjaman = mysqlTable('pinjaman', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  noKontrak: varchar('no_kontrak', { length: 30 }).notNull().unique(),
  anggotaId: varchar('anggota_id', { length: 36 }).notNull().references(() => anggota.id, { onDelete: 'restrict' }),
  tanggalPengajuan: date('tanggal_pengajuan').notNull(),
  tanggalCair: date('tanggal_cair'),
  jumlah: decimal('jumlah', { precision: 15, scale: 2 }).notNull(),
  tenorBulan: int('tenor_bulan').notNull(),
  bungaPersen: decimal('bunga_persen', { precision: 5, scale: 2 }).notNull(),
  jenisBunga: mysqlEnum('jenis_bunga', jenisBungaValues).notNull().default('flat'),
  totalBunga: decimal('total_bunga', { precision: 15, scale: 2 }),
  totalAngsuran: decimal('total_angsuran', { precision: 15, scale: 2 }),
  jatuhTempo: date('jatuh_tempo'),
  asuransiPersen: decimal('asuransi_persen', { precision: 5, scale: 2 }).notNull().default('0'),
  biayaAsuransi: decimal('biaya_asuransi', { precision: 15, scale: 2 }).notNull().default('0'),
  tujuan: text('tujuan'),
  dokumenUrl: text('dokumen_url'),
  status: mysqlEnum('status', pinjamanStatusValues).notNull().default('pengajuan'),
  approvedBy: varchar('approved_by', { length: 255 }).references(() => user.id, { onDelete: 'set null' }),
  approvedAt: timestamp('approved_at'),
  catatan: text('catatan'),
  createdBy: varchar('created_by', { length: 255 }).references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const jadwalAngsuran = mysqlTable('jadwal_angsuran', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  pinjamanId: varchar('pinjaman_id', { length: 36 }).notNull().references(() => pinjaman.id, { onDelete: 'cascade' }),
  ke: int('ke').notNull(),
  tglJatuhTempo: date('tgl_jatuh_tempo').notNull(),
  pokok: decimal('pokok', { precision: 15, scale: 2 }).notNull(),
  bunga: decimal('bunga', { precision: 15, scale: 2 }).notNull(),
  total: decimal('total', { precision: 15, scale: 2 }).notNull(),
  denda: decimal('denda', { precision: 15, scale: 2 }).notNull().default('0'),
  sisaPokok: decimal('sisa_pokok', { precision: 15, scale: 2 }).notNull(),
  status: mysqlEnum('status', jadwalAngsuranStatusValues).notNull().default('belum_bayar'),
})

export const angsuran = mysqlTable('angsuran', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  pinjamanId: varchar('pinjaman_id', { length: 36 }).notNull().references(() => pinjaman.id, { onDelete: 'restrict' }),
  jadwalAngsuranId: varchar('jadwal_angsuran_id', { length: 36 }).references(() => jadwalAngsuran.id, { onDelete: 'set null' }),
  anggotaId: varchar('anggota_id', { length: 36 }).notNull().references(() => anggota.id, { onDelete: 'restrict' }),
  tanggal: date('tanggal').notNull(),
  pokok: decimal('pokok', { precision: 15, scale: 2 }).notNull(),
  bunga: decimal('bunga', { precision: 15, scale: 2 }).notNull().default('0'),
  denda: decimal('denda', { precision: 15, scale: 2 }).notNull().default('0'),
  totalBayar: decimal('total_bayar', { precision: 15, scale: 2 }).notNull(),
  sisaPinjaman: decimal('sisa_pinjaman', { precision: 15, scale: 2 }).notNull(),
  noReferensi: varchar('no_referensi', { length: 30 }).unique(),
  keterangan: text('keterangan'),
  petugasId: varchar('petugas_id', { length: 255 }).references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Kas & Akuntansi ─────────────────────────────────────────────────────────
export const akun = mysqlTable('akun', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  kode: varchar('kode', { length: 50 }).unique(),
  nama: text('nama').notNull(),
  tipe: mysqlEnum('tipe', akunTipeValues).notNull(),
  laporan: mysqlEnum('laporan', akunLaporanValues).notNull(),
  urutan: int('urutan').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const transaksiKas = mysqlTable('transaksi_kas', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  bukuKas: mysqlEnum('buku_kas', bukuKasValues).notNull(),
  tanggal: date('tanggal').notNull(),
  noReferensi: varchar('no_referensi', { length: 30 }).unique(),
  akunId: varchar('akun_id', { length: 36 }).references(() => akun.id, { onDelete: 'set null' }),
  tipe: mysqlEnum('tipe', transaksiTipeValues).notNull(),
  nominal: decimal('nominal', { precision: 15, scale: 2 }).notNull(),
  saldo: decimal('saldo', { precision: 15, scale: 2 }).notNull(),
  keterangan: text('keterangan'),
  refType: varchar('ref_type', { length: 50 }),
  refId: varchar('ref_id', { length: 36 }),
  anggotaId: varchar('anggota_id', { length: 36 }).references(() => anggota.id, { onDelete: 'set null' }),
  petugasId: varchar('petugas_id', { length: 255 }).references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const mutasiKas = mysqlTable('mutasi_kas', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tanggal: date('tanggal').notNull(),
  dariKas: mysqlEnum('dari_kas', bukuKasValues).notNull(),
  keKas: mysqlEnum('ke_kas', bukuKasValues).notNull(),
  nominal: decimal('nominal', { precision: 15, scale: 2 }).notNull(),
  noReferensi: varchar('no_referensi', { length: 30 }).unique(),
  keterangan: text('keterangan'),
  petugasId: varchar('petugas_id', { length: 255 }).references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const setupSaldo = mysqlTable('setup_saldo', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  bukuKas: mysqlEnum('buku_kas', bukuKasValues).notNull().unique(),
  saldoAwal: decimal('saldo_awal', { precision: 15, scale: 2 }).notNull().default('0'),
  tanggal: date('tanggal').notNull(),
  keterangan: text('keterangan'),
  setBy: varchar('set_by', { length: 255 }).references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── SHU ─────────────────────────────────────────────────────────────────────
export const shuConfig = mysqlTable('shu_config', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tahun: int('tahun').notNull().unique(),
  persenJasaSimpanan: decimal('persen_jasa_simpanan', { precision: 5, scale: 2 }).notNull().default('25'),
  persenJasaSp: decimal('persen_jasa_sp', { precision: 5, scale: 2 }).notNull().default('50'),
  persenPemdaker: decimal('persen_pemdaker', { precision: 5, scale: 2 }).notNull().default('2.5'),
  persenPengurus: decimal('persen_pengurus', { precision: 5, scale: 2 }).notNull().default('5'),
  persenKesejahteraan: decimal('persen_kesejahteraan', { precision: 5, scale: 2 }).notNull().default('2.5'),
  persenPendidikan: decimal('persen_pendidikan', { precision: 5, scale: 2 }).notNull().default('2.5'),
  persenSosial: decimal('persen_sosial', { precision: 5, scale: 2 }).notNull().default('2.5'),
  persenCadangan: decimal('persen_cadangan', { precision: 5, scale: 2 }).notNull().default('10'),
  rumusShu: mysqlEnum('rumus_shu', rumusShuValues).notNull().default('angsuran_total'),
  jasaManasukaPersen: decimal('jasa_manasuka_persen', { precision: 5, scale: 2 }).notNull().default('10'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const shuPembagian = mysqlTable('shu_pembagian', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tahun: int('tahun').notNull(),
  anggotaId: varchar('anggota_id', { length: 36 }).notNull().references(() => anggota.id, { onDelete: 'restrict' }),
  shuConfigId: varchar('shu_config_id', { length: 36 }).references(() => shuConfig.id, { onDelete: 'set null' }),
  totalShuAnggota: decimal('total_shu_anggota', { precision: 15, scale: 2 }).notNull(),
  porsiJasaSimpanan: decimal('porsi_jasa_simpanan', { precision: 15, scale: 2 }).notNull().default('0'),
  porsiJasaSp: decimal('porsi_jasa_sp', { precision: 15, scale: 2 }).notNull().default('0'),
  totalDiterima: decimal('total_diterima', { precision: 15, scale: 2 }).notNull(),
  tanggalPembagian: date('tanggal_pembagian'),
  status: mysqlEnum('status', shuPembagianStatusValues).notNull().default('dihitung'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ─── Config & Utilities ───────────────────────────────────────────────────────
export const asuransiConfig = mysqlTable('asuransi_config', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  nama: text('nama').notNull(),
  persen: decimal('persen', { precision: 5, scale: 2 }).notNull(),
  minPinjaman: decimal('min_pinjaman', { precision: 15, scale: 2 }),
  maxPinjaman: decimal('max_pinjaman', { precision: 15, scale: 2 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const pengaturanKoperasi = mysqlTable('pengaturan_koperasi', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
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
  smtpPort: int('smtp_port'),
  smtpUser: text('smtp_user'),
  smtpPass: text('smtp_pass'),
  smtpFrom: text('smtp_from'),
  waGatewayUrl: text('wa_gateway_url'),
  waApiKey: text('wa_api_key'),
  nomorRekening: text('nomor_rekening'),
  namaBank: text('nama_bank'),
  atasNama: text('atas_nama'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  updatedBy: varchar('updated_by', { length: 255 }).references(() => user.id, { onDelete: 'set null' }),
})

export const activityLog = mysqlTable('activity_log', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 }).references(() => user.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  module: varchar('module', { length: 50 }).notNull(),
  refId: varchar('ref_id', { length: 36 }),
  description: text('description'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const notifikasi = mysqlTable('notifikasi', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  judul: text('judul').notNull(),
  pesan: text('pesan').notNull(),
  tipe: mysqlEnum('tipe', notifikasiTipeValues).notNull().default('info'),
  isRead: boolean('is_read').notNull().default(false),
  refType: varchar('ref_type', { length: 50 }),
  refId: varchar('ref_id', { length: 36 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
