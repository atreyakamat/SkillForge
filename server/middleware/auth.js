import { verifyAccessToken } from '../config/jwt.js'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ type: 'AuthError', message: 'Unauthorized' })
  try {
    const decoded = verifyAccessToken(token)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ type: 'AuthError', message: 'Invalid or expired token' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ type: 'AuthError', message: 'Unauthorized' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ type: 'AuthError', message: 'Forbidden' })
    }
    next()
  }
}

