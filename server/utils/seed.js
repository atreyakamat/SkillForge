import dotenv from 'dotenv'
import { connectDb } from '../config/db.js'
import Skill from '../models/Skill.js'
import Job from '../models/Job.js'

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
  const jobs = [
    {
      title: 'Frontend Engineer', company: 'Acme Corp', location: 'Remote', type: 'remote', industry: 'Technology', department: 'Engineering', careerLevel: 'mid',
      requiredSkills: [
        { name: 'JavaScript', level: 8, importance: 'critical' },
        { name: 'React', level: 7, importance: 'critical' },
        { name: 'CSS', level: 6, importance: 'preferred' }
      ], salaryMin: 90000, salaryMax: 130000, experience: '3+ years', source: 'manual'
    },
    {
      title: 'Full Stack Developer', company: 'Globex', location: 'Hybrid - NYC', type: 'hybrid', industry: 'Technology', department: 'Engineering', careerLevel: 'mid',
      requiredSkills: [
        { name: 'JavaScript', level: 7, importance: 'critical' },
        { name: 'Node.js', level: 7, importance: 'critical' },
        { name: 'React', level: 6, importance: 'preferred' }
      ], salaryMin: 100000, salaryMax: 140000, experience: '4+ years', source: 'manual'
    }
  ]
  await Job.deleteMany({})
  await Job.insertMany(jobs)
  // eslint-disable-next-line no-console
  console.log('Seeded skills and jobs')
  process.exit(0)
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

