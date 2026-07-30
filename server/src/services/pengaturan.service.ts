import { db } from '../db'
import { pengaturanKoperasi } from '../db/schema'
import { z } from 'zod'

export const pengaturanSchema = z.object({
  namaKoperasi: z.string().optional(),
  email: z.string().email().optional(),
  noTelp: z.string().optional(),
  alamat: z.string().optional(),
  logoUrl: z.string().url().optional(),
  ketua: z.string().optional(),
  sekretaris: z.string().optional(),
  bendahara: z.string().optional(),
  pengelolaSp: z.string().optional(),
  pengelolaToko: z.string().optional(),
  ketuaPengawas: z.string().optional(),
  pengawas1: z.string().optional(),
  pengawas2: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().int().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
  smtpFrom: z.string().optional(),
  waGatewayUrl: z.string().url().optional(),
  waApiKey: z.string().optional(),
  nomorRekening: z.string().optional(),
  namaBank: z.string().optional(),
  atasNama: z.string().optional(),
})

export type PengaturanInput = z.infer<typeof pengaturanSchema>

export async function getPengaturan() {
  const [row] = await db.select().from(pengaturanKoperasi).limit(1)
  return row ?? null
}

export async function upsertPengaturan(input: PengaturanInput, updatedBy: string) {
  const existing = await getPengaturan()

  if (existing) {
    const [row] = await db
      .update(pengaturanKoperasi)
      .set({ ...input, updatedBy, updatedAt: new Date() })
      .returning()
    return row
  }

  const [row] = await db
    .insert(pengaturanKoperasi)
    .values({ ...input, updatedBy })
    .returning()
  return row
}
