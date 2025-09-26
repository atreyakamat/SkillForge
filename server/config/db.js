import mongoose from 'mongoose'

export async function connectDb() {
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
}

