import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import User from '../models/User.js'
import { RefreshToken, BlacklistedToken } from '../models/Token.js'
import { registerSchema, loginSchema, forgotSchema, resetSchema, validate } from '../utils/validators.js'
import ActionToken from '../models/ActionToken.js'
import { sendEmail } from '../utils/email.js'

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
  const user = await User.create({ name, email, passwordHash, role: req.body.role, industry: req.body.industry })
  // Send welcome and verification email
  const raw = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(raw).digest('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  await ActionToken.create({ user: user._id, purpose: 'email_verify', tokenHash, expiresAt })
  const verifyUrl = `${process.env.APP_BASE_URL || 'http://localhost:5173'}/verify?token=${raw}`
  void sendEmail(user.email, 'Welcome to SkillForge - Verify your email', `Verify your email: ${verifyUrl}`)
  const accessToken = signAccessToken(user)
  const { token: refreshToken, expiresAt } = signRefreshToken(user)
  await createRefreshRecord(user._id, refreshToken, expiresAt)
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: { id: user._id, name: user.name, email: user.email, role: user.role, verified: user.isEmailVerified },
    tokens: { access: accessToken, refresh: refreshToken }
  })
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
  res.json({
    success: true,
    message: 'Login successful',
    user: { id: user._id, name: user.name, email: user.email, role: user.role, skills: user.skills || [], careerGoals: [] },
    tokens: { access: accessToken, refresh: refreshToken }
  })
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
  res.json({ success: true, message: 'Logged out successfully' })
}

export async function refreshToken(req, res) {
  const { refreshToken } = req.body || {}
  if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' })
  const record = await RefreshToken.findOne({ token: refreshToken })
  if (!record || record.expiresAt < new Date()) return res.status(401).json({ message: 'Invalid refresh token' })
  const user = await User.findById(record.user)
  if (!user) return res.status(401).json({ message: 'Invalid refresh token' })
  const accessToken = signAccessToken(user)
  const newRefresh = refreshToken // could rotate in future
  res.json({ success: true, message: 'Token refreshed successfully', tokens: { access: accessToken, refresh: newRefresh } })
}

export async function forgotPassword(req, res) {
  const { email } = validate(forgotSchema, req.body)
  const user = await User.findOne({ email })
  // Always respond success to avoid user enumeration
  if (user) {
    const raw = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(raw).digest('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    await ActionToken.create({ user: user._id, purpose: 'password_reset', tokenHash, expiresAt })
    const resetUrl = `${process.env.APP_BASE_URL || 'http://localhost:5173'}/reset-password?token=${raw}`
    void sendEmail(user.email, 'Reset your SkillForge password', `Reset here: ${resetUrl}`)
  }
  res.json({ success: true, message: 'Password reset email sent successfully' })
}

export async function resetPassword(req, res) {
  const { token, password } = validate(resetSchema, req.body)
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const record = await ActionToken.findOne({ purpose: 'password_reset', tokenHash, consumedAt: { $exists: false }, expiresAt: { $gt: new Date() } })
  if (!record) return res.status(400).json({ message: 'Invalid or expired token' })
  const user = await User.findById(record.user)
  if (!user) return res.status(400).json({ message: 'Invalid token' })
  user.passwordHash = await bcrypt.hash(password, 10)
  await user.save()
  record.consumedAt = new Date()
  await record.save()
  res.json({ success: true, message: 'Password reset successfully' })
}

export async function verifyEmail(req, res) {
  const { token } = req.params
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const record = await ActionToken.findOne({ purpose: 'email_verify', tokenHash, consumedAt: { $exists: false }, expiresAt: { $gt: new Date() } })
  if (!record) return res.status(400).json({ success: false, message: 'Invalid or expired verification token' })
  const user = await User.findById(record.user)
  if (!user) return res.status(400).json({ message: 'Invalid token' })
  user.isEmailVerified = true
  await user.save()
  record.consumedAt = new Date()
  await record.save()
  res.json({ success: true, message: 'Email verified successfully', user: { id: user._id, email: user.email, verified: true } })
}

