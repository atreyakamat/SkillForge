import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_TTL = process.env.JWT_ACCESS_EXPIRES_IN || '15m'
const REFRESH_TOKEN_TTL = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'

export function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL })
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET)
}

export function rotateTokens(payload) {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload)
  }
}


