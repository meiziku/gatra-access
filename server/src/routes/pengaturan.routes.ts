import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { pengaturanSchema, getPengaturan, upsertPengaturan } from '../services/pengaturan.service'
import { getRequestMeta } from '../lib/request'
import { logActivity } from '../services/activity.service'

const router = Router()

// GET /api/pengaturan
router.get('/', requireAuth, async (_req, res) => {
  try {
    const row = await getPengaturan()
    // Strip sensitive SMTP/WA fields for non-admins if needed
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/pengaturan
router.put('/', requireAuth, requireRole('super_admin'), validate(pengaturanSchema), async (req, res) => {
  try {
    const user = (req as any).user
    const row = await upsertPengaturan(req.body, user.id)
    await logActivity({ userId: user.id, action: 'UPDATE', module: 'pengaturan', description: 'Update pengaturan koperasi', ...getRequestMeta(req) })
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
