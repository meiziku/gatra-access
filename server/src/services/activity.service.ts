import { db } from '../db'
import { activityLog, notifikasi } from '../db/schema'
import { eq, desc, and, count } from 'drizzle-orm'
import crypto from 'crypto'

export async function logActivity(params: {
  userId?: string
  action: string
  module: string
  refId?: string
  description?: string
  ipAddress?: string
  userAgent?: string
}) {
  const id = crypto.randomUUID()
  await db.insert(activityLog).values({ id, ...params })
  const [row] = await db.select().from(activityLog).where(eq(activityLog.id, id)).limit(1)
  return row
}

export async function getActivityLog(filters: { userId?: string; module?: string; page?: number; limit?: number }) {
  const { userId, module, page = 1, limit = 50 } = filters
  const offset = (page - 1) * limit

  const conditions = []
  if (userId) conditions.push(eq(activityLog.userId, userId))
  if (module) conditions.push(eq(activityLog.module, module))
  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [rows, [{ total }]] = await Promise.all([
    db.select().from(activityLog).where(where).orderBy(desc(activityLog.createdAt)).limit(limit).offset(offset),
    db.select({ total: count() }).from(activityLog).where(where),
  ])

  return { data: rows, total: Number(total), page, limit }
}

export async function createNotifikasi(userId: string, params: {
  judul: string
  pesan: string
  tipe?: 'info' | 'warning' | 'success' | 'error'
  refType?: string
  refId?: string
}) {
  const id = crypto.randomUUID()
  await db
    .insert(notifikasi)
    .values({ id, userId, ...params, tipe: params.tipe ?? 'info' })
  const [row] = await db.select().from(notifikasi).where(eq(notifikasi.id, id)).limit(1)
  return row
}

export async function getNotifikasi(userId: string, onlyUnread = false) {
  const conditions = [eq(notifikasi.userId, userId)]
  if (onlyUnread) conditions.push(eq(notifikasi.isRead, false))

  const rows = await db
    .select()
    .from(notifikasi)
    .where(and(...conditions))
    .orderBy(desc(notifikasi.createdAt))
    .limit(50)
  return rows
}

export async function markNotifikasiRead(id: string, userId: string) {
  await db
    .update(notifikasi)
    .set({ isRead: true })
    .where(and(eq(notifikasi.id, id), eq(notifikasi.userId, userId)))

  const [row] = await db
    .select()
    .from(notifikasi)
    .where(and(eq(notifikasi.id, id), eq(notifikasi.userId, userId)))
    .limit(1)

  return row ?? null
}

export async function markAllNotifikasiRead(userId: string) {
  await db
    .update(notifikasi)
    .set({ isRead: true })
    .where(and(eq(notifikasi.userId, userId), eq(notifikasi.isRead, false)))
}
