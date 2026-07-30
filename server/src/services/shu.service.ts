import { db } from '../db'
import { shuConfig, shuPembagian, angsuran, simpanan, anggota } from '../db/schema'
import { eq, and, sum, gte, lte } from 'drizzle-orm'
import { z } from 'zod'

export const shuConfigSchema = z.object({
  tahun: z.number().int().min(2000).max(2100),
  persenJasaSimpanan: z.number().min(0).max(100).default(25),
  persenJasaSp: z.number().min(0).max(100).default(50),
  persenPemdaker: z.number().min(0).max(100).default(2.5),
  persenPengurus: z.number().min(0).max(100).default(5),
  persenKesejahteraan: z.number().min(0).max(100).default(2.5),
  persenPendidikan: z.number().min(0).max(100).default(2.5),
  persenSosial: z.number().min(0).max(100).default(2.5),
  persenCadangan: z.number().min(0).max(100).default(10),
  rumusShu: z.enum(['angsuran_total', 'angsuran_bunga', 'angsuran_pokok']).default('angsuran_total'),
  jasaManasukaPersen: z.number().min(0).max(100).default(10),
})

export type ShuConfigInput = z.infer<typeof shuConfigSchema>

export async function getShuConfig(tahun: number) {
  const [row] = await db.select().from(shuConfig).where(eq(shuConfig.tahun, tahun)).limit(1)
  return row ?? null
}

export async function upsertShuConfig(input: ShuConfigInput) {
  const existing = await getShuConfig(input.tahun)
  const values = {
    ...input,
    persenJasaSimpanan: String(input.persenJasaSimpanan),
    persenJasaSp: String(input.persenJasaSp),
    persenPemdaker: String(input.persenPemdaker),
    persenPengurus: String(input.persenPengurus),
    persenKesejahteraan: String(input.persenKesejahteraan),
    persenPendidikan: String(input.persenPendidikan),
    persenSosial: String(input.persenSosial),
    persenCadangan: String(input.persenCadangan),
    jasaManasukaPersen: String(input.jasaManasukaPersen),
    updatedAt: new Date(),
  }

  if (existing) {
    const [row] = await db.update(shuConfig).set(values).where(eq(shuConfig.tahun, input.tahun)).returning()
    return row
  }

  const [row] = await db.insert(shuConfig).values(values).returning()
  return row
}

/** Calculate SHU for all members for a given year */
export async function hitungShu(tahun: number, totalShuKoperasi: number) {
  const config = await getShuConfig(tahun)
  if (!config) throw new Error(`Konfigurasi SHU untuk tahun ${tahun} belum ada`)

  const tanggalDari = `${tahun}-01-01`
  const tanggalSampai = `${tahun}-12-31`

  // Get total angsuran per anggota for the year
  const angsuranPerAnggota = await db
    .select({ anggotaId: angsuran.anggotaId, totalAngsuran: sum(angsuran.totalBayar) })
    .from(angsuran)
    .where(and(gte(angsuran.tanggal, tanggalDari), lte(angsuran.tanggal, tanggalSampai)))
    .groupBy(angsuran.anggotaId)

  // Get total simpanan per anggota (approved)
  const simpananPerAnggota = await db
    .select({ anggotaId: simpanan.anggotaId, totalSimpanan: sum(simpanan.nominal) })
    .from(simpanan)
    .where(and(eq(simpanan.status, 'approved'), eq(simpanan.tipe, 'setoran')))
    .groupBy(simpanan.anggotaId)

  const totalAngsuranKoperasi = angsuranPerAnggota.reduce((s, r) => s + Number(r.totalAngsuran ?? 0), 0)
  const totalSimpananKoperasi = simpananPerAnggota.reduce((s, r) => s + Number(r.totalSimpanan ?? 0), 0)

  const porsiJasaSp = totalShuKoperasi * (Number(config.persenJasaSp) / 100)
  const porsiJasaSimpanan = totalShuKoperasi * (Number(config.persenJasaSimpanan) / 100)

  // Calculate per anggota
  const shuPerAnggota = angsuranPerAnggota.map((a) => {
    const totalAng = Number(a.totalAngsuran ?? 0)
    const simpAng = simpananPerAnggota.find((s) => s.anggotaId === a.anggotaId)
    const totalSimp = Number(simpAng?.totalSimpanan ?? 0)

    const bagianSp = totalAngsuranKoperasi > 0 ? (totalAng / totalAngsuranKoperasi) * porsiJasaSp : 0
    const bagianSimpanan = totalSimpananKoperasi > 0 ? (totalSimp / totalSimpananKoperasi) * porsiJasaSimpanan : 0
    const totalDiterima = bagianSp + bagianSimpanan

    return {
      anggotaId: a.anggotaId,
      tahun,
      shuConfigId: config.id,
      totalShuAnggota: totalShuKoperasi,
      porsiJasaSimpanan: bagianSimpanan,
      porsiJasaSp: bagianSp,
      totalDiterima,
    }
  })

  return shuPerAnggota
}

export async function simpanShu(tahun: number, totalShuKoperasi: number) {
  // Delete existing calculations for the year
  await db.delete(shuPembagian).where(eq(shuPembagian.tahun, tahun))

  const calculations = await hitungShu(tahun, totalShuKoperasi)

  if (calculations.length === 0) return []

  const rows = await db
    .insert(shuPembagian)
    .values(
      calculations.map((c) => ({
        ...c,
        totalShuAnggota: String(c.totalShuAnggota),
        porsiJasaSimpanan: String(c.porsiJasaSimpanan),
        porsiJasaSp: String(c.porsiJasaSp),
        totalDiterima: String(c.totalDiterima),
      }))
    )
    .returning()

  return rows
}

export async function getShuPembagian(tahun: number) {
  const rows = await db
    .select({
      shu: shuPembagian,
      anggota: { id: anggota.id, nama: anggota.nama, nomorAnggota: anggota.nomorAnggota },
    })
    .from(shuPembagian)
    .leftJoin(anggota, eq(shuPembagian.anggotaId, anggota.id))
    .where(eq(shuPembagian.tahun, tahun))
  return rows
}
