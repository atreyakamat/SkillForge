import { BlacklistedToken } from '../models/Token.js'
import jwt from 'jsonwebtoken'

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  const blacklisted = await BlacklistedToken.findOne({ token })
  if (blacklisted) return res.status(401).json({ message: 'Token revoked' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
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

