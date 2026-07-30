import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { auth } from './lib/auth'
import { toNodeHandler } from 'better-auth/node'

// Routes
import anggotaRoutes from './routes/anggota.routes'
import simpananRoutes from './routes/simpanan.routes'
import pinjamanRoutes from './routes/pinjaman.routes'
import kasRoutes from './routes/kas.routes'
import shuRoutes from './routes/shu.routes'
import notifikasiRoutes from './routes/notifikasi.routes'
import pengaturanRoutes from './routes/pengaturan.routes'
import dashboardRoutes from './routes/dashboard.routes'

const app = express()
const PORT = process.env.PORT ?? 4000

// ─── Security & Logging ───────────────────────────────────────────────────────
app.use(helmet())
app.use(morgan('dev'))

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  })
)

// ─── Better-Auth handler (handles /api/auth/*) ────────────────────────────────
app.all('/api/auth/*splat', toNodeHandler(auth))

// ─── Body Parsing (after auth handler) ───────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/anggota', anggotaRoutes)
app.use('/api/simpanan', simpananRoutes)
app.use('/api/pinjaman', pinjamanRoutes)
app.use('/api/kas', kasRoutes)
app.use('/api/shu', shuRoutes)
app.use('/api/notifikasi', notifikasiRoutes)
app.use('/api/pengaturan', pengaturanRoutes)

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(err.status ?? 500).json({
    success: false,
    message: err.message ?? 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

export default app
