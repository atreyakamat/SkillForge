import jwt from 'jsonwebtoken'
import { BlacklistedToken } from '../models/Token.js'

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

