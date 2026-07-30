import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { createPinjamanSchema, getAllPinjaman, getPinjamanById, createPinjaman, approvePinjaman, cairkanPinjaman, bayarAngsuran } from '../services/pinjaman.service'
import { getRequestMeta } from '../lib/request'
import { logActivity } from '../services/activity.service'
import { z } from 'zod'

const router = Router()

const approveSchema = z.object({ catatan: z.string().optional() })
const cairSchema = z.object({ tanggalCair: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) })
const bayarSchema = z.object({
  jadwalAngsuranId: z.string().uuid(),
  anggotaId: z.string().uuid(),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pokok: z.number().positive(),
  bunga: z.number().min(0),
  denda: z.number().min(0).default(0),
  keterangan: z.string().optional(),
})

// GET /api/pinjaman
router.get('/', requireAuth, requireRole('super_admin', 'ketua', 'bendahara', 'pengelola_sp'), async (req, res) => {
  try {
    const { anggotaId, status, tanggalDari, tanggalSampai, page, limit } = req.query
    const result = await getAllPinjaman({
      anggotaId: anggotaId as string,
      status: status as string,
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

// GET /api/pinjaman/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const row = await getPinjamanById(String(String(req.params.id)))
    if (!row) {
      res.status(404).json({ success: false, message: 'Pinjaman tidak ditemukan' })
      return
    }
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/pinjaman
router.post('/', requireAuth, requireRole('super_admin', 'pengelola_sp', 'bendahara'), validate(createPinjamanSchema), async (req, res) => {
  try {
    const user = (req as any).user
    const row = await createPinjaman(req.body, user.id)
    await logActivity({ userId: user.id, action: 'CREATE', module: 'pinjaman', refId: row.id, description: `Pengajuan pinjaman Rp${req.body.jumlah}`, ...getRequestMeta(req) })
    res.status(201).json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/pinjaman/:id/approve
router.post('/:id/approve', requireAuth, requireRole('super_admin', 'ketua'), validate(approveSchema), async (req, res) => {
  try {
    const user = (req as any).user
    const row = await approvePinjaman(String(req.params.id), user.id)
    if (!row) {
      res.status(404).json({ success: false, message: 'Pinjaman tidak ditemukan atau sudah diproses' })
      return
    }
    await logActivity({ userId: user.id, action: 'APPROVE', module: 'pinjaman', refId: row.id, description: `Setujui pinjaman ${row.noKontrak}`, ...getRequestMeta(req) })
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/pinjaman/:id/cair
router.post('/:id/cair', requireAuth, requireRole('super_admin', 'bendahara', 'pengelola_sp'), validate(cairSchema), async (req, res) => {
  try {
    const user = (req as any).user
    const row = await cairkanPinjaman(String(req.params.id), req.body.tanggalCair)
    if (!row) {
      res.status(404).json({ success: false, message: 'Pinjaman tidak ditemukan atau belum disetujui' })
      return
    }
    await logActivity({ userId: user.id, action: 'CAIR', module: 'pinjaman', refId: row.id, description: `Cairkan pinjaman ${row.noKontrak}`, ...getRequestMeta(req) })
    res.json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/pinjaman/:id/bayar
router.post('/:id/bayar', requireAuth, requireRole('super_admin', 'pengelola_sp', 'bendahara'), validate(bayarSchema), async (req, res) => {
  try {
    const user = (req as any).user
    const row = await bayarAngsuran({ pinjamanId: String(req.params.id), ...req.body, petugasId: user.id })
    await logActivity({ userId: user.id, action: 'BAYAR', module: 'angsuran', refId: row.id, description: `Bayar angsuran ke-${req.body.ke}`, ...getRequestMeta(req) })
    res.status(201).json({ success: true, data: row })
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
