import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { connectDb } from '../config/db.js'
import User from '../models/User.js'

dotenv.config()

async function seedUsers() {
  await connectDb()
  
  const testUsers = [
    {
      name: 'Test User',
      email: 'test@skillforge.dev',
      password: 'password123',
      role: 'user',
      industry: 'Technology'
    },
    {
      name: 'John Developer',
      email: 'john@skillforge.dev', 
      password: 'password123',
      role: 'user',
      industry: 'Technology'
    },
    {
      name: 'Jane Designer',
      email: 'jane@skillforge.dev',
      password: 'password123', 
      role: 'user',
      industry: 'Design'
    }
  ]

  // Remove existing test users
  await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } })

  // Create test users
  for (const userData of testUsers) {
    const passwordHash = await bcrypt.hash(userData.password, 10)
    await User.create({
      name: userData.name,
      email: userData.email,
      passwordHash,
      role: userData.role,
      industry: userData.industry,
      isEmailVerified: true // Skip email verification for test users
    })
  }

  console.log('✅ Test users created successfully!')
  console.log('You can now login with:')
  testUsers.forEach(user => {
    console.log(`📧 Email: ${user.email} | 🔑 Password: ${user.password}`)
  })

  process.exit(0)
}

seedUsers().catch(console.error)