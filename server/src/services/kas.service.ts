import { db } from '../db'
import { transaksiKas, mutasiKas, setupSaldo } from '../db/schema'
import { eq, and, sum, gte, lte, desc, count } from 'drizzle-orm'
import { z } from 'zod'
import crypto from 'crypto'

export const transaksiKasSchema = z.object({
  bukuKas: z.enum(['kas_sp', 'kas_umum', 'kas_toko', 'bank']),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  akunId: z.string().uuid().optional(),
  tipe: z.enum(['pemasukan', 'pengeluaran']),
  nominal: z.number().positive(),
  keterangan: z.string().optional(),
  anggotaId: z.string().uuid().optional(),
  refType: z.string().max(50).optional(),
  refId: z.string().uuid().optional(),
})

export const mutasiKasSchema = z.object({
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dariKas: z.enum(['kas_sp', 'kas_umum', 'kas_toko', 'bank']),
  keKas: z.enum(['kas_sp', 'kas_umum', 'kas_toko', 'bank']),
  nominal: z.number().positive(),
  keterangan: z.string().optional(),
})

export type TransaksiKasInput = z.infer<typeof transaksiKasSchema>
export type MutasiKasInput = z.infer<typeof mutasiKasSchema>

export async function getSaldoKas(bukuKas: 'kas_sp' | 'kas_umum' | 'kas_toko' | 'bank') {
  // Get initial balance
  const [setup] = await db
    .select()
    .from(setupSaldo)
    .where(eq(setupSaldo.bukuKas, bukuKas))
    .limit(1)

  const saldoAwal = Number(setup?.saldoAwal ?? 0)

  // Get total pemasukan & pengeluaran
  const rows = await db
    .select({ tipe: transaksiKas.tipe, total: sum(transaksiKas.nominal) })
    .from(transaksiKas)
    .where(eq(transaksiKas.bukuKas, bukuKas))
    .groupBy(transaksiKas.tipe)

  let pemasukan = 0
  let pengeluaran = 0
  for (const r of rows) {
    if (r.tipe === 'pemasukan') pemasukan = Number(r.total ?? 0)
    if (r.tipe === 'pengeluaran') pengeluaran = Number(r.total ?? 0)
  }

  // Account for mutasi
  const [mutasiMasuk] = await db
    .select({ total: sum(mutasiKas.nominal) })
    .from(mutasiKas)
    .where(eq(mutasiKas.keKas, bukuKas))
  const [mutasiKeluar] = await db
    .select({ total: sum(mutasiKas.nominal) })
    .from(mutasiKas)
    .where(eq(mutasiKas.dariKas, bukuKas))

  const saldo = saldoAwal + pemasukan - pengeluaran + Number(mutasiMasuk?.total ?? 0) - Number(mutasiKeluar?.total ?? 0)
  return { bukuKas, saldo, saldoAwal, pemasukan, pengeluaran }
}

export async function createTransaksiKas(input: TransaksiKasInput, petugasId: string) {
  // Calculate running saldo
  const { saldo: saldoSekarang } = await getSaldoKas(input.bukuKas)
  const saldo = input.tipe === 'pemasukan'
    ? saldoSekarang + input.nominal
    : saldoSekarang - input.nominal

  const id = crypto.randomUUID()

  await db
    .insert(transaksiKas)
    .values({
      id,
      ...input,
      nominal: String(input.nominal),
      saldo: String(saldo),
      noReferensi: `TRX-${Date.now()}`,
      petugasId,
    })

  const [row] = await db.select().from(transaksiKas).where(eq(transaksiKas.id, id)).limit(1)
  return row
}

export async function createMutasiKas(input: MutasiKasInput, petugasId: string) {
  const id = crypto.randomUUID()
  await db
    .insert(mutasiKas)
    .values({
      id,
      ...input,
      nominal: String(input.nominal),
      noReferensi: `MUT-${Date.now()}`,
      petugasId,
    })
  const [row] = await db.select().from(mutasiKas).where(eq(mutasiKas.id, id)).limit(1)
  return row
}

export async function getTransaksiKas(filters: {
  bukuKas?: string
  tipe?: string
  tanggalDari?: string
  tanggalSampai?: string
  page?: number
  limit?: number
}) {
  const { bukuKas, tipe, tanggalDari, tanggalSampai, page = 1, limit = 20 } = filters
  const offset = (page - 1) * limit

  const conditions = []
  if (bukuKas) conditions.push(eq(transaksiKas.bukuKas, bukuKas as any))
  if (tipe) conditions.push(eq(transaksiKas.tipe, tipe as any))
  if (tanggalDari) conditions.push(gte(transaksiKas.tanggal, tanggalDari))
  if (tanggalSampai) conditions.push(lte(transaksiKas.tanggal, tanggalSampai))

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(transaksiKas)
      .where(where)
      .orderBy(desc(transaksiKas.tanggal), desc(transaksiKas.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(transaksiKas).where(where),
  ])

  return { data: rows, total: Number(total), page, limit }
}

export async function setupSaldoAwal(bukuKas: 'kas_sp' | 'kas_umum' | 'kas_toko' | 'bank', saldoAwal: number, tanggal: string, setBy: string) {
  // Upsert
  const [existing] = await db.select().from(setupSaldo).where(eq(setupSaldo.bukuKas, bukuKas)).limit(1)

  if (existing) {
    await db
      .update(setupSaldo)
      .set({ saldoAwal: String(saldoAwal), tanggal, setBy, updatedAt: new Date() })
      .where(eq(setupSaldo.bukuKas, bukuKas))
    const [row] = await db.select().from(setupSaldo).where(eq(setupSaldo.bukuKas, bukuKas)).limit(1)
    return row
  } else {
    const id = crypto.randomUUID()
    await db
      .insert(setupSaldo)
      .values({ id, bukuKas, saldoAwal: String(saldoAwal), tanggal, setBy })
    const [row] = await db.select().from(setupSaldo).where(eq(setupSaldo.id, id)).limit(1)
    return row
  }
}
