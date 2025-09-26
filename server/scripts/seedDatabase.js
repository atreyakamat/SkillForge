import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { seedJobDatabase } from '../utils/seedJobs.js'
import connectDB from '../config/database.js'

// Load environment variables
dotenv.config()

/**
 * Script to seed the database with sample job data
 */
async function runSeed() {
  try {
    // Connect to database
    console.log('Connecting to database...')
    await connectDB()
    
    // Seed job data
    console.log('Seeding job data...')
    const jobs = await seedJobDatabase()
    
    console.log(`✅ Successfully seeded ${jobs.length} jobs`)
    console.log('Job titles:', jobs.map(job => job.title))
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seeding script
if (process.argv[2] === '--run') {
  runSeed()
} else {
  console.log('Usage: node scripts/seedDatabase.js --run')
}