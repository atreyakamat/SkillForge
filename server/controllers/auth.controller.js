import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import User from '../models/User.js'
import { RefreshToken, BlacklistedToken } from '../models/Token.js'
import { registerSchema, loginSchema, forgotSchema, resetSchema, validate } from '../utils/validators.js'

function signAccessToken(user) {
  const payload = { id: user._id, email: user.email, roles: [user.role] }
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '15m' })
}

function signRefreshToken(user) {
  const token = crypto.randomBytes(48).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  return { token, expiresAt }
}

async function createRefreshRecord(userId, token, expiresAt) {
  await RefreshToken.create({ user: userId, token, expiresAt })
}

export async function register(req, res) {
  const { name, email, password } = validate(registerSchema, req.body)
  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ message: 'Email already in use' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash })
  // TODO: send welcome and verification email
  const accessToken = signAccessToken(user)
  const { token: refreshToken, expiresAt } = signRefreshToken(user)
  await createRefreshRecord(user._id, refreshToken, expiresAt)
  res.status(201).json({ accessToken, refreshToken })
}

export async function login(req, res) {
  const { email, password } = validate(loginSchema, req.body)
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: 'Invalid credentials' })

  if (user.lockUntil && user.lockUntil > new Date()) {
    return res.status(423).json({ message: 'Account locked. Try again later.' })
  }

  const ok = await user.comparePassword(password)
  if (!ok) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000)
      user.failedLoginAttempts = 0
    }
    await user.save()
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  user.failedLoginAttempts = 0
  user.lockUntil = undefined
  await user.save()

  const accessToken = signAccessToken(user)
  const { token: refreshToken, expiresAt } = signRefreshToken(user)
  await createRefreshRecord(user._id, refreshToken, expiresAt)
  res.json({ accessToken, refreshToken })
}

export async function logout(req, res) {
  const { refreshToken } = req.body || {}
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken })
  }
  const header = req.headers.authorization || ''
  const access = header.startsWith('Bearer ') ? header.slice(7) : null
  if (access) {
    const decoded = jwt.decode(access)
    const expMs = (decoded?.exp ? decoded.exp * 1000 : Date.now())
    await BlacklistedToken.create({ token: access, expiresAt: new Date(expMs) })
  }
  res.json({ message: 'Logged out' })
}

export async function refreshToken(req, res) {
  const { refreshToken } = req.body || {}
  if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' })
  const record = await RefreshToken.findOne({ token: refreshToken })
  if (!record || record.expiresAt < new Date()) return res.status(401).json({ message: 'Invalid refresh token' })
  const user = await User.findById(record.user)
  if (!user) return res.status(401).json({ message: 'Invalid refresh token' })
  const accessToken = signAccessToken(user)
  res.json({ accessToken })
}

export async function forgotPassword(req, res) {
  const { email } = validate(forgotSchema, req.body)
  const user = await User.findOne({ email })
  // Always respond success to avoid user enumeration
  if (user) {
    // TODO: store reset token (hashed) and send email
  }
  res.json({ message: 'If the email exists, a reset link has been sent.' })
}

export async function resetPassword(req, res) {
  const { token, password } = validate(resetSchema, req.body)
  void token
  // TODO: verify token against stored hashed token
  // For scaffold, no-op
  res.json({ message: 'Password updated (placeholder)' })
}

export async function verifyEmail(req, res) {
  const { token } = req.params
  void token
  // TODO: verify email token and set isEmailVerified
  res.json({ message: 'Email verified (placeholder)' })
}

