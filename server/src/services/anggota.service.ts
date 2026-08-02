import { db } from '../db'
import { anggota, userProfiles, user, account } from '../db/schema'
import { eq, ilike, and, count, desc } from 'drizzle-orm'
import { z } from 'zod'

export const createAnggotaSchema = z.object({
  nomorAnggota: z.string().min(1).max(20),
  nik: z.string().length(16).optional(),
  nama: z.string().min(1),
  alamat: z.string().optional(),
  email: z.string().email().optional(),
  noHp: z.string().max(20).optional(),
  tanggalMasuk: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pekerjaan: z.string().optional(),
  unitKerja: z.string().optional(),
})

export const updateAnggotaSchema = createAnggotaSchema.partial()

export type CreateAnggotaInput = z.infer<typeof createAnggotaSchema>
export type UpdateAnggotaInput = z.infer<typeof updateAnggotaSchema>

export async function getAllAnggota(filters: {
  search?: string
  status?: 'aktif' | 'nonaktif' | 'keluar'
  page?: number
  limit?: number
}) {
  const { search, status, page = 1, limit = 20 } = filters
  const offset = (page - 1) * limit

  const conditions = []
  if (search) {
    conditions.push(ilike(anggota.nama, `%${search}%`))
  }
  if (status) {
    conditions.push(eq(anggota.status, status))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [rows, [{ total }]] = await Promise.all([
    db.select().from(anggota).where(where).orderBy(desc(anggota.createdAt)).limit(limit).offset(offset),
    db.select({ total: count() }).from(anggota).where(where),
  ])

  return { data: rows, total: Number(total), page, limit }
}

export async function getAnggotaById(id: string) {
  const [row] = await db.select().from(anggota).where(eq(anggota.id, id)).limit(1)
  return row ?? null
}

import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function createAnggota(input: CreateAnggotaInput, createdBy: string) {
  return await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(anggota)
      .values({ ...input, createdBy })
      .returning()
      
    const dummyEmail = `${input.nomorAnggota}@gatra.local`
    const defaultPassword = '123'
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)
    const userId = crypto.randomUUID()
    
    // 1. Create better-auth user
    await tx.insert(user).values({
      id: userId,
      name: input.nama,
      email: dummyEmail,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    // 2. Create better-auth account
    await tx.insert(account).values({
      id: crypto.randomUUID(),
      accountId: dummyEmail,
      providerId: 'credential',
      userId: userId,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    // 3. Create userProfile mapped to this anggota
    await tx.insert(userProfiles).values({
      userId: userId,
      role: 'anggota',
      namaLengkap: input.nama,
      anggotaId: row.id,
      isActive: true,
    })
    
    return row
  })
}

export async function updateAnggota(id: string, input: UpdateAnggotaInput) {
  const [row] = await db
    .update(anggota)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(anggota.id, id))
    .returning()
  return row ?? null
}

export async function deleteAnggota(id: string) {
  // Soft delete – set status to keluar
  const [row] = await db
    .update(anggota)
    .set({ status: 'keluar', updatedAt: new Date() })
    .where(eq(anggota.id, id))
    .returning()
  return row ?? null
}

export async function setAnggotaPhoto(id: string, fotoUrl: string) {
  const [row] = await db
    .update(anggota)
    .set({ fotoUrl, updatedAt: new Date() })
    .where(eq(anggota.id, id))
    .returning()
  return row ?? null
}

export async function resetAnggotaPassword(anggotaId: string) {
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.anggotaId, anggotaId)
  })
  if (!profile || !profile.userId) {
    throw new Error('Akun pengguna tidak ditemukan untuk anggota ini')
  }
  
  const defaultPassword = '123'
  const hashedPassword = await bcrypt.hash(defaultPassword, 10)
  
  const [updatedAccount] = await db
    .update(account)
    .set({ password: hashedPassword, updatedAt: new Date() })
    .where(eq(account.userId, profile.userId))
    .returning()
    
  return updatedAccount ?? null
}
