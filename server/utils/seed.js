import dotenv from 'dotenv'
import { connectDb } from '../config/db.js'
import Skill from '../models/Skill.js'
import Job from '../models/Job.js'
import User from '../models/User.js'
import Assessment from '../models/Assessment.js'
import bcrypt from 'bcryptjs'
import { sampleUsers, taxonomy } from './seedData.js'

dotenv.config()

async function run() {
  await connectDb()
  const skills = [
    { name: 'JavaScript', category: 'Programming' },
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'CSS', category: 'Frontend' },
    { name: 'UX Research', category: 'Design' },
    { name: 'UI Design', category: 'Design' },
    { name: 'Prototyping', category: 'Design' },
    { name: 'Roadmapping', category: 'Product' },
    { name: 'Stakeholder Management', category: 'Product' },
    { name: 'Data Analysis', category: 'Product' },
    { name: 'SQL', category: 'Data' }
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
  await User.deleteMany({})
  await Assessment.deleteMany({})

  const passwordHash = await bcrypt.hash('DemoPass123!', 10)
  const createdUsers = await User.insertMany(sampleUsers.map(u => ({
    ...u,
    passwordHash,
  })))

  // Map skill names to ids
  const skillMap = Object.fromEntries((await Skill.find()).map(s => [s.name, s._id]))
  const assessments = []
  for (const u of createdUsers) {
    for (const s of u.skills || []) {
      const sid = skillMap[s.name]
      if (!sid) continue
      const peerReviews = (s.peerRatings || []).map(pr => ({ rating: pr.rating, comment: pr.comment }))
      assessments.push({
        user: u._id,
        skill: sid,
        selfRating: Math.min(10, Math.max(1, Math.round((s.selfRating || 5) * 2))),
        confidence: 7,
        evidence: 'Demo evidence: projects, outcomes, and responsibilities.',
        peerReviews
      })
    }
  }
  if (assessments.length) await Assessment.insertMany(assessments)
  // eslint-disable-next-line no-console
  console.log('Seeded skills, jobs, users, assessments. Demo credentials use password: DemoPass123!')
  process.exit(0)
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

