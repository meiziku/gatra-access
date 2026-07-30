import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.middleware'
import { getDashboardStats, getAnggotaDashboard } from '../services/dashboard.service'
import { getActivityLog } from '../services/activity.service'

const router = Router()

// GET /api/dashboard/stats  (admin)
router.get('/stats', requireAuth, requireRole('super_admin', 'ketua', 'sekretaris', 'bendahara', 'pengelola_sp', 'pengelola_toko'), async (_req, res) => {
  try {
    const stats = await getDashboardStats()
    res.json({ success: true, data: stats })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/dashboard/me  (anggota)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user
    const data = await getAnggotaDashboard(user.id)
    if (!data) {
      res.status(404).json({ success: false, message: 'Data anggota tidak ditemukan' })
      return
    }
    res.json({ success: true, data })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/dashboard/activity  (admin only)
router.get('/activity', requireAuth, requireRole('super_admin', 'ketua'), async (req, res) => {
  try {
    const { userId, module, page, limit } = req.query
    const result = await getActivityLog({
      userId: userId as string,
      module: module as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    })
    res.json({ success: true, ...result })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
