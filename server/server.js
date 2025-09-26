import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { connectDb } from './config/db.js'
import { requireAuth } from './middleware/auth.js'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import assessmentRoutes from './routes/assessment.routes.js'
import skillsRoutes from './routes/skills.routes.js'
import peerRoutes from './routes/peer.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'
import reportsRoutes from './routes/reports.routes.js'
import jobsRoutes from './routes/jobs.routes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(helmet())
app.use(express.json())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Rate limit exceeded' }
})
app.use(limiter)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: "Skill Gap Analyzer API root",
    service: 'skill-gap-analyzer-api'
  })
})

// Health endpoint with database status
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'skill-gap-analyzer-api',
    env: process.env.NODE_ENV || 'development',
    db: {
      state: mongoose.connection.readyState // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    }
  })
})

// Test JWT token generation endpoint
app.get('/health/test-token', (req, res) => {
  const testPayload = {
    id: 'test-user-123',
    role: 'user'
  }
  // Use jwt directly for test endpoint
  const token = jwt.sign(testPayload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' })
  res.json({
    success: true,
    token: token
  })
})

// Protected endpoint for testing authentication
app.get('/protected', requireAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Protected route access granted',
    user: {
      id: req.user.id,
      role: req.user.role
    }
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/assessments', assessmentRoutes)
app.use('/api/skills', skillsRoutes)
app.use('/api/peer', peerRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/reports', reportsRoutes)
app.use('/api/jobs', jobsRoutes)

// Errors
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
connectDb().then(() => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`)
  })
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to connect to DB', err)
  process.exit(1)
})
