import { db } from '../db'
import { simpanan, jenisSimpanan, anggota } from '../db/schema'
import { eq, and, count, sum, desc, gte, lte } from 'drizzle-orm'
import { z } from 'zod'

export const createSimpananSchema = z.object({
  anggotaId: z.string().uuid(),
  jenisSimpananId: z.string().uuid(),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nominal: z.number().positive(),
  tipe: z.enum(['setoran', 'penarikan']),
  keterangan: z.string().optional(),
  noReferensi: z.string().max(30).optional(),
})

export type CreateSimpananInput = z.infer<typeof createSimpananSchema>

export async function getAllSimpanan(filters: {
  anggotaId?: string
  jenisSimpananId?: string
  tipe?: 'setoran' | 'penarikan'
  status?: 'pending' | 'approved' | 'rejected'
  tanggalDari?: string
  tanggalSampai?: string
  page?: number
  limit?: number
}) {
  const { anggotaId, jenisSimpananId, tipe, status, tanggalDari, tanggalSampai, page = 1, limit = 20 } = filters
  const offset = (page - 1) * limit

  const conditions = []
  if (anggotaId) conditions.push(eq(simpanan.anggotaId, anggotaId))
  if (jenisSimpananId) conditions.push(eq(simpanan.jenisSimpananId, jenisSimpananId))
  if (tipe) conditions.push(eq(simpanan.tipe, tipe))
  if (status) conditions.push(eq(simpanan.status, status))
  if (tanggalDari) conditions.push(gte(simpanan.tanggal, tanggalDari))
  if (tanggalSampai) conditions.push(lte(simpanan.tanggal, tanggalSampai))

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        simpanan,
        anggota: { id: anggota.id, nama: anggota.nama, nomorAnggota: anggota.nomorAnggota },
        jenisSimpanan: { id: jenisSimpanan.id, nama: jenisSimpanan.nama, kode: jenisSimpanan.kode },
      })
      .from(simpanan)
      .leftJoin(anggota, eq(simpanan.anggotaId, anggota.id))
      .leftJoin(jenisSimpanan, eq(simpanan.jenisSimpananId, jenisSimpanan.id))
      .where(where)
      .orderBy(desc(simpanan.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(simpanan).where(where),
  ])

  return { data: rows, total: Number(total), page, limit }
}

export async function getSimpananById(id: string) {
  const [row] = await db
    .select({
      simpanan,
      anggota: { id: anggota.id, nama: anggota.nama, nomorAnggota: anggota.nomorAnggota },
      jenisSimpanan: { id: jenisSimpanan.id, nama: jenisSimpanan.nama, kode: jenisSimpanan.kode },
    })
    .from(simpanan)
    .leftJoin(anggota, eq(simpanan.anggotaId, anggota.id))
    .leftJoin(jenisSimpanan, eq(simpanan.jenisSimpananId, jenisSimpanan.id))
    .where(eq(simpanan.id, id))
    .limit(1)
  return row ?? null
}

export async function getSaldoAnggota(anggotaId: string, jenisSimpananId?: string) {
  const conditions = [eq(simpanan.anggotaId, anggotaId), eq(simpanan.status, 'approved')]
  if (jenisSimpananId) conditions.push(eq(simpanan.jenisSimpananId, jenisSimpananId))

  const rows = await db
    .select({ tipe: simpanan.tipe, total: sum(simpanan.nominal) })
    .from(simpanan)
    .where(and(...conditions))
    .groupBy(simpanan.tipe)

  let setoran = 0
  let penarikan = 0
  for (const r of rows) {
    if (r.tipe === 'setoran') setoran = Number(r.total ?? 0)
    if (r.tipe === 'penarikan') penarikan = Number(r.total ?? 0)
  }

  return { saldo: setoran - penarikan, setoran, penarikan }
}

export async function createSimpanan(input: CreateSimpananInput, petugasId: string) {
  const [row] = await db
    .insert(simpanan)
    .values({
      ...input,
      nominal: String(input.nominal),
      petugasId,
      status: 'approved',
      approvedBy: petugasId,
      approvedAt: new Date(),
    })
    .returning()
  return row
}

// Get all jenis simpanan
export async function getJenisSimpanan(activeOnly = true) {
  const rows = await db
    .select()
    .from(jenisSimpanan)
    .where(activeOnly ? eq(jenisSimpanan.isActive, true) : undefined)
    .orderBy(jenisSimpanan.nama)
  return rows
}
