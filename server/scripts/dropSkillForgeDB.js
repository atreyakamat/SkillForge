import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function dropSkillForgeDatabase() {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/skillforge'
    await mongoose.connect(uri)
    console.log('Connected to MongoDB')

    // Get the database instance
    const db = mongoose.connection.db

    // List all databases
    const adminDb = db.admin()
    const databases = await adminDb.listDatabases()
    console.log('Available databases:', databases.databases.map(db => db.name))

    // Check if SkillForge database exists
    const skillforgeExists = databases.databases.some(db => db.name === 'skillforge')
    
    if (skillforgeExists) {
      // Drop the SkillForge database
      await db.getSiblingDB('skillforge').dropDatabase()
      console.log('✅ Successfully dropped SkillForge database')
    } else {
      console.log('ℹ️  SkillForge database does not exist')
    }

    // List databases again to confirm
    const updatedDatabases = await adminDb.listDatabases()
    console.log('Remaining databases:', updatedDatabases.databases.map(db => db.name))

  } catch (error) {
    console.error('❌ Error dropping SkillForge database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the script
dropSkillForgeDatabase()
