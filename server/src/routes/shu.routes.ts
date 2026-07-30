import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { shuConfigSchema, getShuConfig, upsertShuConfig, simpanShu, getShuPembagian } from '../services/shu.service'
import { getRequestMeta } from '../lib/request'
import { logActivity } from '../services/activity.service'
import { z } from 'zod'

const router = Router()

const hitungSchema = z.object({
  tahun: z.number().int().min(2000).max(2100),
  totalShuKoperasi: z.number().positive(),
})

// GET /api/shu/config/:tahun
router.get('/config/:tahun', requireAuth, requireRole('super_admin', 'ketua', 'bendahara'), async (req, res) => {
  try {
    const row = await getShuConfig(Number(String(String(req.params.tahun))))
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/shu/config
router.post('/config', requireAuth, requireRole('super_admin'), validate(shuConfigSchema), async (req, res) => {
  try {
    const row = await upsertShuConfig(req.body)
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/shu/hitung
router.post('/hitung', requireAuth, requireRole('super_admin', 'ketua'), validate(hitungSchema), async (req, res) => {
  try {
    const user = (req as any).user
    const { tahun, totalShuKoperasi } = req.body
    const rows = await simpanShu(tahun, totalShuKoperasi)
    await logActivity({ userId: user.id, action: 'HITUNG_SHU', module: 'shu', description: `Hitung SHU tahun ${tahun}`, ...getRequestMeta(req) })
    res.json({ success: true, data: rows })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/shu/:tahun
router.get('/:tahun', requireAuth, requireRole('super_admin', 'ketua', 'bendahara'), async (req, res) => {
  try {
    const rows = await getShuPembagian(Number(String(String(req.params.tahun))))
    res.json({ success: true, data: rows })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
