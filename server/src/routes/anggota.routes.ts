import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { createAnggotaSchema, updateAnggotaSchema, getAllAnggota, getAnggotaById, createAnggota, updateAnggota, deleteAnggota } from '../services/anggota.service'
import { getRequestMeta } from '../lib/request'
import { logActivity } from '../services/activity.service'

const router = Router()

// GET /api/anggota
router.get('/', requireAuth, requireRole('super_admin', 'ketua', 'bendahara', 'pengelola_sp'), async (req, res) => {
  try {
    const { search, status, page, limit } = req.query
    const result = await getAllAnggota({
      search: search as string,
      status: status as any,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    })
    res.json({ success: true, ...result })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/anggota/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const row = await getAnggotaById(String(String(req.params.id)))
    if (!row) {
      res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' })
      return
    }
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/anggota
router.post('/', requireAuth, requireRole('super_admin', 'pengelola_sp', 'bendahara'), validate(createAnggotaSchema), async (req, res) => {
  try {
    const user = (req as any).user
    const row = await createAnggota(req.body, user.id)
    await logActivity({ userId: user.id, action: 'CREATE', module: 'anggota', refId: row.id, description: `Tambah anggota ${row.nama}`, ...getRequestMeta(req) })
    res.status(201).json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PATCH /api/anggota/:id
router.patch('/:id', requireAuth, requireRole('super_admin', 'pengelola_sp', 'bendahara'), validate(updateAnggotaSchema), async (req, res) => {
  try {
    const user = (req as any).user
    const row = await updateAnggota(String(req.params.id), req.body)
    if (!row) {
      res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' })
      return
    }
    await logActivity({ userId: user.id, action: 'UPDATE', module: 'anggota', refId: row.id, description: `Update anggota ${row.nama}`, ...getRequestMeta(req) })
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/anggota/:id  (soft delete)
router.delete('/:id', requireAuth, requireRole('super_admin'), async (req, res) => {
  try {
    const user = (req as any).user
    const row = await deleteAnggota(String(String(req.params.id)))
    if (!row) {
      res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' })
      return
    }
    await logActivity({ userId: user.id, action: 'DELETE', module: 'anggota', refId: row.id, description: `Nonaktifkan anggota ${row.nama}`, ...getRequestMeta(req) })
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
