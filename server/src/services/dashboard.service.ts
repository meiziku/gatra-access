import { db } from '../db'
import { anggota, simpanan, pinjaman, transaksiKas, userProfiles, shuPembagian } from '../db/schema'
import { eq, count, sum, and, gte, lte } from 'drizzle-orm'

export async function getDashboardStats() {
  const today = new Date().toISOString().split('T')[0]
  const thisMonthStart = today.substring(0, 7) + '-01'

  const [
    [{ totalAnggota }],
    [{ totalSimpanan }],
    [{ totalPinjaman }],
    [{ transaksiHariIni }],
  ] = await Promise.all([
    db.select({ totalAnggota: count() }).from(anggota).where(eq(anggota.status, 'aktif')),
    db
      .select({ totalSimpanan: sum(simpanan.nominal) })
      .from(simpanan)
      .where(and(eq(simpanan.status, 'approved'), eq(simpanan.tipe, 'setoran'))),
    db
      .select({ totalPinjaman: sum(pinjaman.jumlah) })
      .from(pinjaman)
      .where(eq(pinjaman.status, 'cair')),
    db
      .select({ transaksiHariIni: count() })
      .from(transaksiKas)
      .where(eq(transaksiKas.tanggal, today)),
  ])

  return {
    totalAnggota: Number(totalAnggota ?? 0),
    totalSimpanan: Number(totalSimpanan ?? 0),
    totalPinjaman: Number(totalPinjaman ?? 0),
    transaksiHariIni: Number(transaksiHariIni ?? 0),
  }
}

export async function getAnggotaDashboard(userId: string) {
  // Find anggota linked to this user
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1)

  if (!profile?.anggotaId) return null

  const [anggotaRow] = await db
    .select()
    .from(anggota)
    .where(eq(anggota.id, profile.anggotaId))
    .limit(1)

  if (!anggotaRow) return null

  const [
    [{ totalSimpanan }],
    [{ totalPinjaman }],
    shuRows,
  ] = await Promise.all([
    db
      .select({ totalSimpanan: sum(simpanan.nominal) })
      .from(simpanan)
      .where(and(
        eq(simpanan.anggotaId, anggotaRow.id),
        eq(simpanan.status, 'approved'),
        eq(simpanan.tipe, 'setoran'),
      )),
    db
      .select({ totalPinjaman: sum(pinjaman.jumlah) })
      .from(pinjaman)
      .where(and(eq(pinjaman.anggotaId, anggotaRow.id), eq(pinjaman.status, 'cair'))),
    db.select().from(shuPembagian).where(eq(shuPembagian.anggotaId, anggotaRow.id)),
  ])

  return {
    anggota: anggotaRow,
    totalSimpanan: Number(totalSimpanan ?? 0),
    totalPinjaman: Number(totalPinjaman ?? 0),
    shuHistory: shuRows,
  }
}
