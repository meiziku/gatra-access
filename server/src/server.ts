import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { auth } from './lib/auth'
import { toNodeHandler } from 'better-auth/node'
import { db } from './db'
import { sql } from 'drizzle-orm'

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
app.use((req, res, next) => {
  const origin = req.headers.origin
  res.setHeader('Access-Control-Allow-Origin', origin || '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept,Authorization,Cookie')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  next()
})

// ─── Better-Auth handler (handles /api/auth/*) ────────────────────────────────
app.all('/api/auth/*', toNodeHandler(auth))

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

// ─── Health Check & Root ───────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Koperasi Gatra API is running' })
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: 'v3-db-diag', timestamp: new Date().toISOString() })
})

app.get('/health/db', async (_req, res) => {
  const { Pool } = require('pg') as typeof import('pg')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT 1 as ok')
    client.release()
    await pool.end()
    res.json({ status: 'ok', db: 'connected', result: result.rows, dbUrl: process.env.DATABASE_URL ? 'set (' + process.env.DATABASE_URL.substring(0, 30) + '...)' : 'NOT SET' })
  } catch (err: any) {
    await pool.end().catch(() => {})
    res.status(500).json({ 
      status: 'error', 
      db: 'failed', 
      message: err.message, 
      code: err.code,
      cause: err.cause?.message,
      dbUrl: process.env.DATABASE_URL ? 'set (' + process.env.DATABASE_URL.substring(0, 30) + '...)' : 'NOT SET'
    })
  }
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

// Only run listen() if not on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}

export default app
