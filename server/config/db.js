import mongoose from 'mongoose'

export async function connectDb() {
<<<<<<< HEAD
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/skillforge'
  mongoose.set('strictQuery', true)
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: parseInt(process.env.MONGO_MAX_POOL || '10', 10),
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 20000
  }
  let attempts = 0
  const maxAttempts = 5
  while (attempts < maxAttempts) {
    try {
      const conn = await mongoose.connect(uri, opts)
      // eslint-disable-next-line no-console
      console.log(`MongoDB Connected: ${conn.connection.host}`)
      return conn
    } catch (err) {
      attempts += 1
      // eslint-disable-next-line no-console
      console.error(`Mongo connect attempt ${attempts} failed:`, err.message)
      await new Promise(res => setTimeout(res, Math.min(1000 * attempts, 5000)))
    }
  }
  // eslint-disable-next-line no-console
  console.error('Database connection error: Failed to connect after retries')
  process.exit(1)
}

// Health check function
export function getDatabaseHealth() {
  const state = mongoose.connection.readyState
  return {
    state: state, // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    host: mongoose.connection.host,
    name: mongoose.connection.name
  }
=======
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillforge'
  const isProd = (process.env.NODE_ENV || 'development') === 'production'

  mongoose.set('strictQuery', true)
  if (!isProd) {
    mongoose.set('debug', true)
  }

  const options = {
    maxPoolSize: Number(process.env.DB_MAX_POOL) || 20,
    minPoolSize: Number(process.env.DB_MIN_POOL) || 2,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    family: 4
  }

  mongoose.connection.on('connected', () => {
    // eslint-disable-next-line no-console
    console.log('MongoDB connected')
  })
  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('MongoDB error', err)
  })
  mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.warn('MongoDB disconnected')
  })

  await mongoose.connect(uri, options)

  // Graceful shutdown
  const close = async () => {
    try {
      await mongoose.connection.close()
      // eslint-disable-next-line no-console
      console.log('MongoDB connection closed')
      process.exit(0)
    } catch (e) {
      process.exit(1)
    }
  }
  process.on('SIGINT', close)
  process.on('SIGTERM', close)
>>>>>>> 1d3b6a9f1ea76a99356112c0b3479ac218972df2
}

