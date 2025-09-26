import mongoose from 'mongoose'

export async function connectDb() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillforge'
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
}

