import { Request } from 'express'

/** Extract request metadata safely for activity logging */
export function getRequestMeta(req: Request) {
  return {
    ipAddress: req.ip ?? req.socket?.remoteAddress,
    userAgent: Array.isArray(req.headers['user-agent'])
      ? req.headers['user-agent'][0]
      : req.headers['user-agent'],
  }
}
