import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

function signToken(user) {
  const payload = { id: user._id, email: user.email, roles: user.roles }
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })
}

export async function register(req, res) {
  const { email, password } = req.body
  // TODO: validate with Joi
  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ message: 'Email already in use' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ email, passwordHash })
  const token = signToken(user)
  res.status(201).json({ token })
}

export async function login(req, res) {
  const { email, password } = req.body
  // TODO: validate with Joi
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: 'Invalid credentials' })
  const ok = await user.comparePassword(password)
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' })
  const token = signToken(user)
  res.json({ token })
}

