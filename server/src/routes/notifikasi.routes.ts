import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { getNotifikasi, markNotifikasiRead, markAllNotifikasiRead } from '../services/activity.service'

const router = Router()

// GET /api/notifikasi
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user
    const { unread } = req.query
    const rows = await getNotifikasi(user.id, unread === 'true')
    res.json({ success: true, data: rows })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PATCH /api/notifikasi/:id/read
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user
    const row = await markNotifikasiRead(String(req.params.id), user.id)
    if (!row) {
      res.status(404).json({ success: false, message: 'Notifikasi tidak ditemukan' })
      return
    }
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PATCH /api/notifikasi/read-all
router.patch('/read-all', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user
    await markAllNotifikasiRead(user.id)
    res.json({ success: true, message: 'Semua notifikasi telah dibaca' })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
