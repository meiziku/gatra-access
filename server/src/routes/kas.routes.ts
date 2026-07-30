import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { transaksiKasSchema, mutasiKasSchema, getSaldoKas, createTransaksiKas, createMutasiKas, getTransaksiKas, setupSaldoAwal } from '../services/kas.service'
import { getRequestMeta } from '../lib/request'
import { logActivity } from '../services/activity.service'
import { z } from 'zod'

const router = Router()

const setupSchema = z.object({
  bukuKas: z.enum(['kas_sp', 'kas_umum', 'kas_toko', 'bank']),
  saldoAwal: z.number().min(0),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  keterangan: z.string().optional(),
})

// GET /api/kas/saldo
router.get('/saldo', requireAuth, requireRole('super_admin', 'ketua', 'bendahara', 'pengelola_sp'), async (req, res) => {
  try {
    const { bukuKas } = req.query
    if (!bukuKas) {
      const all = await Promise.all(
        (['kas_sp', 'kas_umum', 'kas_toko', 'bank'] as const).map(getSaldoKas)
      )
      res.json({ success: true, data: all })
      return
    }
    const result = await getSaldoKas(bukuKas as any)
    res.json({ success: true, data: result })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/kas
router.get('/', requireAuth, requireRole('super_admin', 'ketua', 'bendahara', 'pengelola_sp'), async (req, res) => {
  try {
    const { bukuKas, tipe, tanggalDari, tanggalSampai, page, limit } = req.query
    const result = await getTransaksiKas({
      bukuKas: bukuKas as string,
      tipe: tipe as string,
      tanggalDari: tanggalDari as string,
      tanggalSampai: tanggalSampai as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    })
    res.json({ success: true, ...result })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/kas
router.post('/', requireAuth, requireRole('super_admin', 'bendahara', 'pengelola_sp'), validate(transaksiKasSchema), async (req, res) => {
  try {
    const user = (req as any).user
    const row = await createTransaksiKas(req.body, user.id)
    await logActivity({ userId: user.id, action: 'CREATE', module: 'kas', refId: row.id, description: `Transaksi kas ${req.body.tipe} Rp${req.body.nominal}`, ...getRequestMeta(req) })
    res.status(201).json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/kas/mutasi
router.post('/mutasi', requireAuth, requireRole('super_admin', 'bendahara'), validate(mutasiKasSchema), async (req, res) => {
  try {
    const user = (req as any).user
    const row = await createMutasiKas(req.body, user.id)
    await logActivity({ userId: user.id, action: 'MUTASI', module: 'kas', refId: row.id, description: `Mutasi kas dari ${req.body.dariKas} ke ${req.body.keKas}`, ...getRequestMeta(req) })
    res.status(201).json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/kas/setup-saldo
router.post('/setup-saldo', requireAuth, requireRole('super_admin'), validate(setupSchema), async (req, res) => {
  try {
    const user = (req as any).user
    const { bukuKas, saldoAwal, tanggal, keterangan } = req.body
    const row = await setupSaldoAwal(bukuKas, saldoAwal, tanggal, user.id)
    await logActivity({ userId: user.id, action: 'SETUP', module: 'kas', description: `Setup saldo awal ${bukuKas}`, ...getRequestMeta(req) })
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
