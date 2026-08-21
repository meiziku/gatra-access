import { db } from '../db'
import { pinjaman, jadwalAngsuran, angsuran, anggota } from '../db/schema'
import { eq, and, count, desc, gte, lte } from 'drizzle-orm'
import { z } from 'zod'
import crypto from 'crypto'

export const createPinjamanSchema = z.object({
  anggotaId: z.string().uuid(),
  tanggalPengajuan: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  jumlah: z.number().positive(),
  tenorBulan: z.number().int().min(1).max(360),
  bungaPersen: z.number().min(0).max(100),
  jenisBunga: z.enum(['flat', 'anuitas', 'efektif']).default('flat'),
  asuransiPersen: z.number().min(0).default(0),
  tujuan: z.string().optional(),
})

export type CreatePinjamanInput = z.infer<typeof createPinjamanSchema>

/** Calculate installment schedule based on loan type */
function hitungAngsuran(params: {
  jumlah: number
  tenorBulan: number
  bungaPersen: number
  jenisBunga: 'flat' | 'anuitas' | 'efektif'
}) {
  const { jumlah, tenorBulan, bungaPersen, jenisBunga } = params

  if (jenisBunga === 'flat') {
    const totalBunga = jumlah * (bungaPersen / 100) * (tenorBulan / 12)
    const angsuranBunga = totalBunga / tenorBulan
    const angsuranPokok = jumlah / tenorBulan
    const angsuranTotal = angsuranPokok + angsuranBunga

    return {
      totalBunga,
      angsuranTotal,
      jadwal: Array.from({ length: tenorBulan }, (_, i) => ({
        ke: i + 1,
        pokok: angsuranPokok,
        bunga: angsuranBunga,
        total: angsuranTotal,
        sisaPokok: jumlah - angsuranPokok * (i + 1),
      })),
    }
  }

  if (jenisBunga === 'anuitas') {
    const r = bungaPersen / 100 / 12
    const angsuranTotal = (jumlah * r * Math.pow(1 + r, tenorBulan)) / (Math.pow(1 + r, tenorBulan) - 1)
    let sisaPokok = jumlah
    let totalBunga = 0

    const jadwal = Array.from({ length: tenorBulan }, (_, i) => {
      const bunga = sisaPokok * r
      const pokok = angsuranTotal - bunga
      totalBunga += bunga
      sisaPokok -= pokok
      return { ke: i + 1, pokok, bunga, total: angsuranTotal, sisaPokok: Math.max(0, sisaPokok) }
    })

    return { totalBunga, angsuranTotal, jadwal }
  }

  // Efektif: same as anuitas for this implementation
  const r = bungaPersen / 100 / 12
  const pokok = jumlah / tenorBulan
  let sisaPokok = jumlah
  let totalBunga = 0
  const jadwal = Array.from({ length: tenorBulan }, (_, i) => {
    const bunga = sisaPokok * r
    totalBunga += bunga
    sisaPokok -= pokok
    return { ke: i + 1, pokok, bunga, total: pokok + bunga, sisaPokok: Math.max(0, sisaPokok) }
  })

  return { totalBunga, angsuranTotal: jadwal[0].total, jadwal }
}

export async function createPinjaman(input: CreatePinjamanInput, createdBy: string) {
  const { jadwal, totalBunga, angsuranTotal } = hitungAngsuran({
    jumlah: input.jumlah,
    tenorBulan: input.tenorBulan,
    bungaPersen: input.bungaPersen,
    jenisBunga: input.jenisBunga,
  })

  const biayaAsuransi = input.jumlah * (input.asuransiPersen / 100)
  const noKontrak = `KP-${Date.now()}`
  const tanggalCairDate = new Date(input.tanggalPengajuan)
  const jatuhTempo = new Date(tanggalCairDate)
  jatuhTempo.setMonth(jatuhTempo.getMonth() + input.tenorBulan)

  const pinjamanId = crypto.randomUUID()

  // Insert pinjaman
  await db
    .insert(pinjaman)
    .values({
      id: pinjamanId,
      ...input,
      jumlah: String(input.jumlah),
      bungaPersen: String(input.bungaPersen),
      asuransiPersen: String(input.asuransiPersen),
      biayaAsuransi: String(biayaAsuransi),
      totalBunga: String(totalBunga),
      totalAngsuran: String(angsuranTotal),
      jatuhTempo: jatuhTempo.toISOString().split('T')[0],
      noKontrak,
      status: 'pengajuan',
      createdBy,
    })

  const [pinjamanRow] = await db.select().from(pinjaman).where(eq(pinjaman.id, pinjamanId)).limit(1)

  // Insert jadwal angsuran
  const today = new Date()
  await db.insert(jadwalAngsuran).values(
    jadwal.map((j) => {
      const tgl = new Date(today)
      tgl.setMonth(tgl.getMonth() + j.ke)
      return {
        id: crypto.randomUUID(),
        pinjamanId: pinjamanRow.id,
        ke: j.ke,
        tglJatuhTempo: tgl.toISOString().split('T')[0],
        pokok: String(j.pokok),
        bunga: String(j.bunga),
        total: String(j.total),
        sisaPokok: String(j.sisaPokok),
      }
    })
  )

  return pinjamanRow
}

export async function getAllPinjaman(filters: {
  anggotaId?: string
  status?: string
  tanggalDari?: string
  tanggalSampai?: string
  page?: number
  limit?: number
}) {
  const { anggotaId, status, tanggalDari, tanggalSampai, page = 1, limit = 20 } = filters
  const offset = (page - 1) * limit

  const conditions = []
  if (anggotaId) conditions.push(eq(pinjaman.anggotaId, anggotaId))
  if (status) conditions.push(eq(pinjaman.status, status as any))
  if (tanggalDari) conditions.push(gte(pinjaman.tanggalPengajuan, tanggalDari))
  if (tanggalSampai) conditions.push(lte(pinjaman.tanggalPengajuan, tanggalSampai))

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        pinjaman,
        anggota: { id: anggota.id, nama: anggota.nama, nomorAnggota: anggota.nomorAnggota },
      })
      .from(pinjaman)
      .leftJoin(anggota, eq(pinjaman.anggotaId, anggota.id))
      .where(where)
      .orderBy(desc(pinjaman.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(pinjaman).where(where),
  ])

  return { data: rows, total: Number(total), page, limit }
}

export async function getPinjamanById(id: string) {
  const [[pinjamanRow], jadwalRows] = await Promise.all([
    db
      .select({ pinjaman, anggota: { id: anggota.id, nama: anggota.nama, nomorAnggota: anggota.nomorAnggota } })
      .from(pinjaman)
      .leftJoin(anggota, eq(pinjaman.anggotaId, anggota.id))
      .where(eq(pinjaman.id, id))
      .limit(1),
    db.select().from(jadwalAngsuran).where(eq(jadwalAngsuran.pinjamanId, id)).orderBy(jadwalAngsuran.ke),
  ])

  if (!pinjamanRow) return null
  return { ...pinjamanRow, jadwal: jadwalRows }
}

export async function approvePinjaman(id: string, approvedBy: string) {
  await db
    .update(pinjaman)
    .set({ status: 'disetujui', approvedBy, approvedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(pinjaman.id, id), eq(pinjaman.status, 'pengajuan')))
  
  const [row] = await db.select().from(pinjaman).where(eq(pinjaman.id, id)).limit(1)
  return row ?? null
}

export async function cairkanPinjaman(id: string, tanggalCair: string) {
  await db
    .update(pinjaman)
    .set({ status: 'cair', tanggalCair, updatedAt: new Date() })
    .where(and(eq(pinjaman.id, id), eq(pinjaman.status, 'disetujui')))

  const [row] = await db.select().from(pinjaman).where(eq(pinjaman.id, id)).limit(1)
  return row ?? null
}

export async function bayarAngsuran(params: {
  pinjamanId: string
  jadwalAngsuranId: string
  anggotaId: string
  tanggal: string
  pokok: number
  bunga: number
  denda: number
  petugasId: string
  keterangan?: string
}) {
  const totalBayar = params.pokok + params.bunga + params.denda

  // Get remaining balance
  const pinjamanRow = await getPinjamanById(params.pinjamanId)
  if (!pinjamanRow) throw new Error('Pinjaman tidak ditemukan')

  const sisaPinjaman = Number(pinjamanRow.pinjaman.jumlah) - params.pokok

  const angsuranId = crypto.randomUUID()

  await db
    .insert(angsuran)
    .values({
      id: angsuranId,
      ...params,
      pokok: String(params.pokok),
      bunga: String(params.bunga),
      denda: String(params.denda),
      totalBayar: String(totalBayar),
      sisaPinjaman: String(Math.max(0, sisaPinjaman)),
      noReferensi: `ANG-${Date.now()}`,
    })

  const [angsuranRow] = await db.select().from(angsuran).where(eq(angsuran.id, angsuranId)).limit(1)

  // Update jadwal status
  await db
    .update(jadwalAngsuran)
    .set({ status: 'lunas', denda: String(params.denda) })
    .where(eq(jadwalAngsuran.id, params.jadwalAngsuranId))

  // Check if fully paid
  const remaining = await db
    .select({ total: count() })
    .from(jadwalAngsuran)
    .where(and(eq(jadwalAngsuran.pinjamanId, params.pinjamanId), eq(jadwalAngsuran.status, 'belum_bayar')))

  if (Number(remaining[0].total) === 0) {
    await db
      .update(pinjaman)
      .set({ status: 'lunas', updatedAt: new Date() })
      .where(eq(pinjaman.id, params.pinjamanId))
  }

  return angsuranRow
}
