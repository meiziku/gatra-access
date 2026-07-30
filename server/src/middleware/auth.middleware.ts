import { Request, Response, NextFunction } from 'express'
import { auth } from '../lib/auth'
import { db } from '../db'
import { userProfiles } from '../db/schema'
import { eq } from 'drizzle-orm'

export type UserRole = 'super_admin' | 'ketua' | 'sekretaris' | 'bendahara' | 'pengelola_sp' | 'pengelola_toko' | 'anggota'

// Attach session to request
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any })
    if (!session?.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1)

    ;(req as any).user = session.user
    ;(req as any).profile = profile ?? null
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Invalid session' })
  }
}

// Role-based access control
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const profile = (req as any).profile
    if (!profile || !roles.includes(profile.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' })
      return
    }
    next()
  }
}
