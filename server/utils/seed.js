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
      title: 'Frontend Engineer',
      company: {
        name: 'Acme Corp',
        industry: 'Technology',
        size: 'medium'
      },
      description: 'Build modern web applications using React and JavaScript',
      location: {
        city: 'San Francisco',
        state: 'CA',
        remote: true
      },
      experienceLevel: 'mid',
      employmentType: 'full-time',
      skills: {
        required: [
          { name: 'JavaScript', level: 4 },
          { name: 'React', level: 4 }
        ],
        preferred: [
          { name: 'CSS', level: 3 },
          { name: 'TypeScript', level: 3 }
        ]
      },
      salary: {
        min: 90000,
        max: 130000,
        currency: 'USD'
      },
      postedDate: new Date(),
      source: 'manual'
    },
    {
      title: 'Full Stack Developer',
      company: {
        name: 'Globex Inc',
        industry: 'Technology', 
        size: 'large'
      },
      description: 'Work on both frontend and backend systems',
      location: {
        city: 'New York',
        state: 'NY',
        hybrid: true
      },
      experienceLevel: 'mid',
      employmentType: 'full-time',
      skills: {
        required: [
          { name: 'JavaScript', level: 4 },
          { name: 'Node.js', level: 4 }
        ],
        preferred: [
          { name: 'React', level: 3 },
          { name: 'MongoDB', level: 3 }
        ]
      },
      salary: {
        min: 100000,
        max: 140000,
        currency: 'USD'
      },
      postedDate: new Date(),
      source: 'manual'
    },
    {
      title: 'Senior React Developer',
      company: {
        name: 'TechStart LLC',
        industry: 'Technology',
        size: 'startup'
      },
      description: 'Lead frontend development for our flagship product',
      location: {
        city: 'Austin',
        state: 'TX',
        remote: false
      },
      experienceLevel: 'senior',
      employmentType: 'full-time',
      skills: {
        required: [
          { name: 'React', level: 5 },
          { name: 'JavaScript', level: 5 },
          { name: 'TypeScript', level: 4 }
        ],
        preferred: [
          { name: 'GraphQL', level: 3 },
          { name: 'AWS', level: 3 }
        ]
      },
      salary: {
        min: 120000,
        max: 160000,
        currency: 'USD'
      },
      postedDate: new Date(),
      source: 'manual'
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

