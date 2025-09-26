import mongoose from 'mongoose'

let connectionAttempts = 0
const MAX_RETRIES = parseInt(process.env.DB_MAX_RETRIES || '5', 10)
const RETRY_DELAY_MS = parseInt(process.env.DB_RETRY_DELAY_MS || '3000', 10)

export async function connectDb() {
  const env = process.env.NODE_ENV || 'development'
  const uri =
    process.env.MONGODB_URI ||
    (env === 'test'
      ? process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/skillforge_test'
      : env === 'production'
        ? process.env.MONGODB_URI_PROD || 'mongodb://localhost:27017/skillforge_prod'
        : 'mongodb://localhost:27017/skillforge')

  const options = {
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10', 10),
    minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '0', 10)
  }

  mongoose.set('strictQuery', true)

  const attemptConnect = async () => {
    try {
      await mongoose.connect(uri, options)
      // eslint-disable-next-line no-console
      console.log('Connected to MongoDB')
    } catch (error) {
      connectionAttempts += 1
      if (connectionAttempts > MAX_RETRIES) {
        // eslint-disable-next-line no-console
        console.error('Exceeded max DB connection retries')
        throw error
      }
      // eslint-disable-next-line no-console
      console.warn(`DB connection failed (attempt ${connectionAttempts}). Retrying in ${RETRY_DELAY_MS}ms...`)
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
      return attemptConnect()
    }
  }

  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', err.message)
  })

  mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.warn('MongoDB disconnected')
  })

  return attemptConnect()
}

export function getDbHealth() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
  const state = mongoose.connection.readyState
  return {
    ok: state === 1,
    state: states[state] || 'unknown',
    host: mongoose.connection.host,
    name: mongoose.connection.name
  }
}


