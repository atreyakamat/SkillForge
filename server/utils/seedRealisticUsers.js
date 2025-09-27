import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { connectDb } from '../config/db.js'
import User from '../models/User.js'
import Assessment from '../models/Assessment.js'
import Skill from '../models/Skill.js'

dotenv.config()

async function seedUsersWithSkills() {
  await connectDb()
  
  // Enhanced skills data
  const skillsData = [
    // Frontend
    { name: 'JavaScript', category: 'Frontend', marketDemandScore: 95 },
    { name: 'React', category: 'Frontend', marketDemandScore: 90 },
    { name: 'Vue.js', category: 'Frontend', marketDemandScore: 75 },
    { name: 'Angular', category: 'Frontend', marketDemandScore: 70 },
    { name: 'HTML/CSS', category: 'Frontend', marketDemandScore: 85 },
    { name: 'TypeScript', category: 'Programming Languages', marketDemandScore: 88 },
    
    // Backend
    { name: 'Node.js', category: 'Backend', marketDemandScore: 88 },
    { name: 'Python', category: 'Programming Languages', marketDemandScore: 92 },
    { name: 'Java', category: 'Programming Languages', marketDemandScore: 85 },
    { name: 'C#', category: 'Programming Languages', marketDemandScore: 78 },
    { name: 'Go', category: 'Programming Languages', marketDemandScore: 80 },
    { name: 'PHP', category: 'Programming Languages', marketDemandScore: 65 },
    
    // Database
    { name: 'MongoDB', category: 'Databases', marketDemandScore: 82 },
    { name: 'PostgreSQL', category: 'Databases', marketDemandScore: 85 },
    { name: 'MySQL', category: 'Databases', marketDemandScore: 80 },
    { name: 'Redis', category: 'Databases', marketDemandScore: 75 },
    
    // DevOps
    { name: 'Docker', category: 'DevOps Tools', marketDemandScore: 90 },
    { name: 'Kubernetes', category: 'DevOps Tools', marketDemandScore: 85 },
    { name: 'AWS', category: 'Cloud Platforms', marketDemandScore: 95 },
    { name: 'Azure', category: 'Cloud Platforms', marketDemandScore: 80 },
    { name: 'CI/CD', category: 'DevOps Tools', marketDemandScore: 88 },
    
    // Data Science
    { name: 'Machine Learning', category: 'Data', marketDemandScore: 92 },
    { name: 'Data Analysis', category: 'Data', marketDemandScore: 88 },
    { name: 'SQL', category: 'Databases', marketDemandScore: 90 },
    { name: 'R', category: 'Programming Languages', marketDemandScore: 70 },
    { name: 'Pandas', category: 'Data', marketDemandScore: 75 },
    
    // Mobile
    { name: 'React Native', category: 'Frontend', marketDemandScore: 82 },
    { name: 'Flutter', category: 'Frontend', marketDemandScore: 78 },
    { name: 'iOS Development', category: 'Programming Languages', marketDemandScore: 80 },
    { name: 'Android Development', category: 'Programming Languages', marketDemandScore: 82 },
    
    // Design
    { name: 'UI/UX Design', category: 'Design', marketDemandScore: 85 },
    { name: 'Figma', category: 'Design Tools', marketDemandScore: 80 },
    { name: 'Adobe Creative Suite', category: 'Design Tools', marketDemandScore: 75 },
    
    // Soft Skills
    { name: 'Project Management', category: 'Project Management', marketDemandScore: 88 },
    { name: 'Team Leadership', category: 'Soft Skills', marketDemandScore: 90 },
    { name: 'Agile/Scrum', category: 'Project Management', marketDemandScore: 85 },
    { name: 'Communication', category: 'Soft Skills', marketDemandScore: 95 }
  ]

  // User profiles with realistic skill combinations
  const usersData = [
    {
      name: 'Alex Chen',
      email: 'alex.chen@skillforge.dev',
      password: 'password123',
      role: 'user',
      industry: 'Technology',
      experienceLevel: 'senior',
      skills: [
        { name: 'JavaScript', selfRating: 9, confidence: 9 },
        { name: 'React', selfRating: 8, confidence: 8 },
        { name: 'Node.js', selfRating: 8, confidence: 7 },
        { name: 'TypeScript', selfRating: 7, confidence: 8 },
        { name: 'AWS', selfRating: 6, confidence: 6 },
        { name: 'Docker', selfRating: 7, confidence: 7 },
        { name: 'MongoDB', selfRating: 6, confidence: 6 },
        { name: 'Team Leadership', selfRating: 7, confidence: 8 }
      ]
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@skillforge.dev',
      password: 'password123',
      role: 'user',
      industry: 'Technology',
      experienceLevel: 'mid',
      skills: [
        { name: 'Python', selfRating: 8, confidence: 8 },
        { name: 'Machine Learning', selfRating: 7, confidence: 7 },
        { name: 'Data Analysis', selfRating: 8, confidence: 9 },
        { name: 'SQL', selfRating: 9, confidence: 9 },
        { name: 'Pandas', selfRating: 7, confidence: 8 },
        { name: 'PostgreSQL', selfRating: 6, confidence: 6 },
        { name: 'R', selfRating: 5, confidence: 5 },
        { name: 'Communication', selfRating: 8, confidence: 8 }
      ]
    },
    {
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@skillforge.dev',
      password: 'password123',
      role: 'user',
      industry: 'Technology',
      experienceLevel: 'senior',
      skills: [
        { name: 'Java', selfRating: 9, confidence: 9 },
        { name: 'C#', selfRating: 8, confidence: 8 },
        { name: 'Kubernetes', selfRating: 8, confidence: 7 },
        { name: 'Docker', selfRating: 9, confidence: 8 },
        { name: 'AWS', selfRating: 7, confidence: 7 },
        { name: 'CI/CD', selfRating: 8, confidence: 8 },
        { name: 'PostgreSQL', selfRating: 7, confidence: 7 },
        { name: 'Project Management', selfRating: 8, confidence: 8 },
        { name: 'Agile/Scrum', selfRating: 9, confidence: 9 }
      ]
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@skillforge.dev',
      password: 'password123',
      role: 'user',
      industry: 'Design',
      experienceLevel: 'mid',
      skills: [
        { name: 'UI/UX Design', selfRating: 8, confidence: 9 },
        { name: 'Figma', selfRating: 9, confidence: 9 },
        { name: 'Adobe Creative Suite', selfRating: 7, confidence: 8 },
        { name: 'HTML/CSS', selfRating: 6, confidence: 6 },
        { name: 'JavaScript', selfRating: 4, confidence: 4 },
        { name: 'React', selfRating: 3, confidence: 3 },
        { name: 'Communication', selfRating: 9, confidence: 9 },
        { name: 'Project Management', selfRating: 6, confidence: 6 }
      ]
    },
    {
      name: 'David Kim',
      email: 'david.kim@skillforge.dev',
      password: 'password123',
      role: 'user',
      industry: 'Technology',
      experienceLevel: 'junior',
      skills: [
        { name: 'React Native', selfRating: 6, confidence: 6 },
        { name: 'Flutter', selfRating: 5, confidence: 5 },
        { name: 'JavaScript', selfRating: 6, confidence: 7 },
        { name: 'React', selfRating: 5, confidence: 6 },
        { name: 'iOS Development', selfRating: 4, confidence: 4 },
        { name: 'Android Development', selfRating: 4, confidence: 4 },
        { name: 'Node.js', selfRating: 3, confidence: 3 },
        { name: 'Communication', selfRating: 7, confidence: 7 }
      ]
    },
    {
      name: 'Lisa Wang',
      email: 'lisa.wang@skillforge.dev',
      password: 'password123',
      role: 'user',
      industry: 'Technology',
      experienceLevel: 'senior',
      skills: [
        { name: 'Python', selfRating: 9, confidence: 9 },
        { name: 'Go', selfRating: 7, confidence: 7 },
        { name: 'Docker', selfRating: 8, confidence: 8 },
        { name: 'Kubernetes', selfRating: 8, confidence: 7 },
        { name: 'AWS', selfRating: 8, confidence: 8 },
        { name: 'Azure', selfRating: 6, confidence: 6 },
        { name: 'CI/CD', selfRating: 9, confidence: 9 },
        { name: 'MongoDB', selfRating: 7, confidence: 7 },
        { name: 'Redis', selfRating: 6, confidence: 6 },
        { name: 'Team Leadership', selfRating: 8, confidence: 8 }
      ]
    },
    {
      name: 'James Thompson',
      email: 'james.thompson@skillforge.dev',
      password: 'password123',
      role: 'user',
      industry: 'Technology',
      experienceLevel: 'mid',
      skills: [
        { name: 'Vue.js', selfRating: 8, confidence: 8 },
        { name: 'Angular', selfRating: 6, confidence: 6 },
        { name: 'JavaScript', selfRating: 7, confidence: 8 },
        { name: 'TypeScript', selfRating: 6, confidence: 6 },
        { name: 'PHP', selfRating: 7, confidence: 7 },
        { name: 'MySQL', selfRating: 6, confidence: 6 },
        { name: 'HTML/CSS', selfRating: 8, confidence: 8 },
        { name: 'Communication', selfRating: 6, confidence: 6 }
      ]
    }
  ]

  try {
    // Remove existing test users and their assessments
    const testEmails = usersData.map(u => u.email)
    const existingUsers = await User.find({ email: { $in: testEmails } })
    const userIds = existingUsers.map(u => u._id)
    
    await Assessment.deleteMany({ user: { $in: userIds } })
    await User.deleteMany({ email: { $in: testEmails } })

    // Clear existing skills and create new ones
    await Skill.deleteMany({})
    
    console.log('🔄 Creating skills...')
    const createdSkills = await Skill.insertMany(skillsData)
    const skillMap = {}
    createdSkills.forEach(skill => {
      skillMap[skill.name] = skill._id
    })

    console.log('👥 Creating users with skills...')
    
    for (const userData of usersData) {
      // Create user
      const passwordHash = await bcrypt.hash(userData.password, 10)
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        passwordHash,
        role: userData.role,
        industry: userData.industry,
        experienceLevel: userData.experienceLevel,
        isEmailVerified: true
      })

      console.log(`✅ Created user: ${userData.name}`)

      // Create skill assessments for this user
      for (const skillData of userData.skills) {
        const skillId = skillMap[skillData.name]
        if (skillId) {
          await Assessment.create({
            user: user._id,
            skill: skillId,
            selfRating: skillData.selfRating,
            confidence: skillData.confidence,
            validationStatus: 'unvalidated'
          })
        }
      }

      console.log(`  📊 Added ${userData.skills.length} skills for ${userData.name}`)
    }

    console.log('\n✅ Test users with skills created successfully!')
    console.log('\n👤 Available Test Users:')
    console.log('=' .repeat(60))
    
    usersData.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`)
      console.log(`   📧 Email: ${user.email}`)
      console.log(`   🔑 Password: ${user.password}`)
      console.log(`   🏢 Industry: ${user.industry}`)
      console.log(`   📈 Experience: ${user.experienceLevel}`)
      console.log(`   🛠️  Top Skills: ${user.skills.slice(0, 3).map(s => `${s.name} (${s.selfRating}/10)`).join(', ')}`)
      console.log(`   📊 Total Skills: ${user.skills.length}`)
      console.log('')
    })

    console.log('🎯 Test Scenarios:')
    console.log('- Alex Chen: Senior Full-Stack Developer (React/Node.js)')
    console.log('- Sarah Johnson: Data Scientist (Python/ML)')
    console.log('- Mike Rodriguez: DevOps Engineer (Java/Kubernetes)')
    console.log('- Emily Davis: UI/UX Designer (Figma/Design)')
    console.log('- David Kim: Junior Mobile Developer (React Native/Flutter)')
    console.log('- Lisa Wang: Senior Backend/DevOps (Python/AWS)')
    console.log('- James Thompson: Frontend Developer (Vue.js/Angular)')
    
  } catch (error) {
    console.error('❌ Error creating test users:', error)
  }

  process.exit(0)
}

seedUsersWithSkills().catch(console.error)