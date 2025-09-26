import mongoose from 'mongoose'

export async function connectDb() {
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
}

