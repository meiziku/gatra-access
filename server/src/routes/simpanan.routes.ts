import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { createSimpananSchema, getAllSimpanan, getSimpananById, getSaldoAnggota, createSimpanan, getJenisSimpanan } from '../services/simpanan.service'
import { getRequestMeta } from '../lib/request'
import { logActivity } from '../services/activity.service'

const router = Router()

// GET /api/simpanan/jenis
router.get('/jenis', requireAuth, async (_req, res) => {
  try {
    const rows = await getJenisSimpanan()
    res.json({ success: true, data: rows })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/simpanan/saldo/:anggotaId
router.get('/saldo/:anggotaId', requireAuth, async (req, res) => {
  try {
    const { jenisSimpananId } = req.query
    const result = await getSaldoAnggota(String(req.params.anggotaId), jenisSimpananId as string)
    res.json({ success: true, data: result })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/simpanan
router.get('/', requireAuth, requireRole('super_admin', 'ketua', 'bendahara', 'pengelola_sp'), async (req, res) => {
  try {
    const { anggotaId, jenisSimpananId, tipe, status, tanggalDari, tanggalSampai, page, limit } = req.query
    const result = await getAllSimpanan({
      anggotaId: anggotaId as string,
      jenisSimpananId: jenisSimpananId as string,
      tipe: tipe as any,
      status: status as any,
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

// GET /api/simpanan/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const row = await getSimpananById(String(String(req.params.id)))
    if (!row) {
      res.status(404).json({ success: false, message: 'Simpanan tidak ditemukan' })
      return
    }
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/simpanan
router.post('/', requireAuth, requireRole('super_admin', 'pengelola_sp', 'bendahara'), validate(createSimpananSchema), async (req, res) => {
  try {
    const user = (req as any).user
    const row = await createSimpanan(req.body, user.id)
    await logActivity({ userId: user.id, action: 'CREATE', module: 'simpanan', refId: row.id, description: `Transaksi simpanan ${req.body.tipe} Rp${req.body.nominal}`, ...getRequestMeta(req) })
    res.status(201).json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
