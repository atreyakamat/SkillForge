import dotenv from 'dotenv'
import { connectDb } from '../config/db.js'
import Skill from '../models/Skill.js'

dotenv.config()

async function run() {
  await connectDb()
  const skills = [
    { name: 'JavaScript', category: 'Programming' },
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
  ]
  await Skill.deleteMany({})
  await Skill.insertMany(skills)
  // eslint-disable-next-line no-console
  console.log('Seeded skills')
  process.exit(0)
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

