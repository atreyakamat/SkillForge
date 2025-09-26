import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import helmet from 'helmet'
import { connectDb } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import assessmentRoutes from './routes/assessment.routes.js'
import { notFound, errorHandler } from './middleware/error.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/assessments', assessmentRoutes)

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

