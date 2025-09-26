<<<<<<< HEAD
import jwt from 'jsonwebtoken'
import { BlacklistedToken } from '../models/Token.js'
=======
import { verifyAccessToken } from '../config/jwt.js'
>>>>>>> c593d28860cafaaa1fa204e9e0aa564e2e246775

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
<<<<<<< HEAD
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  const blacklisted = await BlacklistedToken.findOne({ token })
  if (blacklisted) return res.status(401).json({ message: 'Token revoked' })
=======
  if (!token) return res.status(401).json({ type: 'AuthError', message: 'Unauthorized' })
>>>>>>> c593d28860cafaaa1fa204e9e0aa564e2e246775
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

