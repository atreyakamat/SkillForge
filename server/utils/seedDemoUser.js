import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { connectDb } from '../config/db.js'
import User from '../models/User.js'
import Assessment from '../models/Assessment.js'
import Skill from '../models/Skill.js'
import Job from '../models/Job.js'
import PeerReview from '../models/PeerReview.js'

dotenv.config()

async function createDemoUser() {
  await connectDb()
  
  console.log('🚀 Creating comprehensive demo user with rich skill data...')

  try {
    // Clear existing demo user
    await User.deleteOne({ email: 'demo@skillforge.com' })
    await Assessment.deleteMany({ /* we'll handle this after user creation */ })

    // Enhanced skills data with comprehensive coverage
    const skillsData = [
      // Frontend Technologies
      { name: 'JavaScript', category: 'Programming Languages', marketDemandScore: 95, description: 'Modern JavaScript ES6+, async/await, modules' },
      { name: 'React', category: 'Frontend Frameworks', marketDemandScore: 90, description: 'React hooks, context, state management' },
      { name: 'TypeScript', category: 'Programming Languages', marketDemandScore: 88, description: 'Type safety, interfaces, advanced types' },
      { name: 'Vue.js', category: 'Frontend Frameworks', marketDemandScore: 75, description: 'Vue 3 composition API, Vuex, router' },
      { name: 'HTML/CSS', category: 'Frontend', marketDemandScore: 85, description: 'Semantic HTML, CSS Grid, Flexbox, animations' },
      { name: 'Sass/SCSS', category: 'Frontend', marketDemandScore: 70, description: 'CSS preprocessing, mixins, variables' },
      
      // Backend Technologies
      { name: 'Node.js', category: 'Backend Frameworks', marketDemandScore: 88, description: 'Express.js, middleware, REST APIs' },
      { name: 'Python', category: 'Programming Languages', marketDemandScore: 92, description: 'Django, Flask, FastAPI, data processing' },
      { name: 'Java', category: 'Programming Languages', marketDemandScore: 85, description: 'Spring Boot, JPA, microservices' },
      { name: 'C#', category: 'Programming Languages', marketDemandScore: 78, description: '.NET Core, ASP.NET, Entity Framework' },
      { name: 'Go', category: 'Programming Languages', marketDemandScore: 80, description: 'Concurrency, web services, performance' },
      
      // Databases
      { name: 'MongoDB', category: 'Databases', marketDemandScore: 82, description: 'NoSQL, aggregation, indexing, replica sets' },
      { name: 'PostgreSQL', category: 'Databases', marketDemandScore: 85, description: 'Advanced SQL, JSONB, performance tuning' },
      { name: 'MySQL', category: 'Databases', marketDemandScore: 80, description: 'Relational design, optimization, replication' },
      { name: 'Redis', category: 'Databases', marketDemandScore: 75, description: 'Caching, pub/sub, data structures' },
      
      // Cloud & DevOps
      { name: 'AWS', category: 'Cloud Platforms', marketDemandScore: 95, description: 'EC2, S3, Lambda, RDS, CloudFormation' },
      { name: 'Docker', category: 'DevOps Tools', marketDemandScore: 90, description: 'Containerization, multi-stage builds, orchestration' },
      { name: 'Kubernetes', category: 'DevOps Tools', marketDemandScore: 85, description: 'Container orchestration, deployments, services' },
      { name: 'CI/CD', category: 'DevOps Tools', marketDemandScore: 88, description: 'GitHub Actions, Jenkins, automated testing' },
      { name: 'Terraform', category: 'DevOps Tools', marketDemandScore: 82, description: 'Infrastructure as code, state management' },
      
      // Data & Analytics
      { name: 'Machine Learning', category: 'Data', marketDemandScore: 92, description: 'Scikit-learn, TensorFlow, model deployment' },
      { name: 'Data Analysis', category: 'Data', marketDemandScore: 88, description: 'Pandas, NumPy, statistical analysis' },
      { name: 'SQL', category: 'Databases', marketDemandScore: 90, description: 'Complex queries, window functions, optimization' },
      { name: 'Data Visualization', category: 'Data', marketDemandScore: 78, description: 'D3.js, Tableau, matplotlib, interactive charts' },
      
      // Soft Skills
      { name: 'Project Management', category: 'Project Management', marketDemandScore: 85, description: 'Agile, Scrum, stakeholder management' },
      { name: 'Leadership', category: 'Soft Skills', marketDemandScore: 88, description: 'Team leadership, mentoring, strategic planning' },
      { name: 'Communication', category: 'Soft Skills', marketDemandScore: 95, description: 'Technical writing, presentations, cross-team collaboration' },
      { name: 'Problem Solving', category: 'Soft Skills', marketDemandScore: 90, description: 'Analytical thinking, debugging, architecture design' }
    ]

    // Create skills if they don't exist
    console.log('📝 Creating skills...')
    const skillPromises = skillsData.map(async (skillData) => {
      let skill = await Skill.findOne({ name: skillData.name })
      if (!skill) {
        skill = await Skill.create(skillData)
      }
      return skill
    })
    const skills = await Promise.all(skillPromises)
    console.log(`✅ Created/found ${skills.length} skills`)

    // Create the demo user with comprehensive profile
    console.log('👤 Creating demo user...')
    const hashedPassword = await bcrypt.hash('demo123', 12)
    
    const demoUser = await User.create({
      name: 'Alexandra Chen',
      email: 'demo@skillforge.com',
      passwordHash: hashedPassword,
      role: 'Developer',
      
      // Profile Details
      careerGoals: 'Transition to Senior Engineering Manager role, gain expertise in machine learning and AI, contribute to open source projects, and speak at major tech conferences.',
      experienceLevel: 'senior',
      industry: 'Technology',
      
      // Settings
      preferences: {
        notifications: true,
        privacy: 'public'
      },
      
      // Skills array (will be populated via assessments)
      skills: []
    })

    console.log(`✅ Created demo user: ${demoUser.email}`)

    // Create comprehensive assessments with realistic peer reviews
    console.log('📊 Creating skill assessments...')
    
    const assessmentData = [
      // Strong Frontend Skills
      { skill: 'JavaScript', selfRating: 9, confidence: 9, evidence: 'Built 15+ production apps, mentored junior developers, contributed to JS open source projects' },
      { skill: 'React', selfRating: 8, confidence: 8, evidence: 'Lead developer on 3 major React projects, implemented complex state management, performance optimization' },
      { skill: 'HTML/CSS', selfRating: 8, confidence: 9, evidence: 'Expert in responsive design, CSS Grid/Flexbox, accessibility best practices, created design system' },
      { skill: 'TypeScript', selfRating: 7, confidence: 7, evidence: 'Migrated 2 large codebases to TypeScript, implement complex type definitions, improved code quality' },
      
      // Solid Backend Skills  
      { skill: 'Node.js', selfRating: 8, confidence: 8, evidence: 'Built REST APIs serving 100k+ users, implemented microservices, performance optimization' },
      { skill: 'Python', selfRating: 6, confidence: 6, evidence: 'Data processing scripts, automation tools, learning Django for side projects' },
      { skill: 'MongoDB', selfRating: 7, confidence: 7, evidence: 'Database design for production apps, aggregation pipelines, performance tuning' },
      { skill: 'PostgreSQL', selfRating: 6, confidence: 6, evidence: 'Basic to intermediate SQL, used in 2 projects, learning advanced features' },
      
      // Growing Cloud & DevOps Skills
      { skill: 'AWS', selfRating: 7, confidence: 6, evidence: 'Deployed apps on EC2, S3, Lambda. Working toward Solutions Architect certification' },
      { skill: 'Docker', selfRating: 8, confidence: 8, evidence: 'Containerized all team projects, multi-stage builds, Docker Compose for development' },
      { skill: 'Kubernetes', selfRating: 5, confidence: 4, evidence: 'Recently started learning, deployed test clusters, working through tutorials' },
      { skill: 'CI/CD', selfRating: 7, confidence: 7, evidence: 'Set up GitHub Actions for 5+ repos, automated testing and deployment pipelines' },
      
      // Emerging Data Skills
      { skill: 'Machine Learning', selfRating: 4, confidence: 3, evidence: 'Completed online courses, built 2 demo projects, exploring integration with web apps' },
      { skill: 'Data Analysis', selfRating: 5, confidence: 5, evidence: 'User analytics for web apps, basic Pandas for data processing, creating dashboards' },
      { skill: 'SQL', selfRating: 7, confidence: 7, evidence: 'Complex queries for reporting, database optimization, working with analytics team' },
      
      // Strong Soft Skills
      { skill: 'Project Management', selfRating: 8, confidence: 8, evidence: 'Led 4 major projects, Scrum Master certification, stakeholder management' },
      { skill: 'Leadership', selfRating: 7, confidence: 7, evidence: 'Team lead for 4 developers, mentoring program, cross-functional collaboration' },
      { skill: 'Communication', selfRating: 8, confidence: 9, evidence: 'Technical blog with 10k+ views, internal tech talks, client presentations' },
      { skill: 'Problem Solving', selfRating: 9, confidence: 9, evidence: 'Complex debugging, system architecture design, innovative solutions' },
      
      // Skills to improve
      { skill: 'Vue.js', selfRating: 3, confidence: 2, evidence: 'Basic tutorial completion, need hands-on project experience' },
      { skill: 'Java', selfRating: 4, confidence: 3, evidence: 'College coursework, built small apps, need enterprise experience' },
      { skill: 'Go', selfRating: 3, confidence: 2, evidence: 'Reading documentation, completed basic tutorials, interested in microservices' },
      { skill: 'Terraform', selfRating: 3, confidence: 2, evidence: 'Started learning for infrastructure automation, basic configurations' }
    ]

    // Create assessments with peer reviews
    const assessmentPromises = assessmentData.map(async (assessment) => {
      const skill = skills.find(s => s.name === assessment.skill)
      if (!skill) return null

      // Generate realistic peer ratings (usually within 1-2 points of self-rating)
      const peerRatings = []
      const numPeers = Math.floor(Math.random() * 4) + 2 // 2-5 peer reviews
      
      for (let i = 0; i < numPeers; i++) {
        const variance = (Math.random() - 0.5) * 2 // -1 to +1 variance
        const peerRating = Math.max(1, Math.min(10, assessment.selfRating + variance))
        
        peerRatings.push({
          reviewerId: null, // We don't have other users, but this would be populated
          rating: Math.round(peerRating * 10) / 10, // Round to 1 decimal
          comment: generatePeerComment(assessment.skill, peerRating, assessment.selfRating),
          date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
          helpfulVotes: Math.floor(Math.random() * 5)
        })
      }

      const avgPeerRating = peerRatings.reduce((sum, p) => sum + p.rating, 0) / peerRatings.length

      const assessmentDoc = await Assessment.create({
        user: demoUser._id,
        skill: skill._id,
        selfRating: assessment.selfRating,
        peerRatings: peerRatings,
        averageRating: avgPeerRating,
        evidence: assessment.evidence,
        confidence: assessment.confidence,
        status: 'completed',
        lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      })

      // Update user's skills array
      await User.findByIdAndUpdate(demoUser._id, {
        $push: {
          skills: {
            skillId: skill._id,
            name: skill.name,
            selfRating: assessment.selfRating,
            peerRatings: peerRatings,
            averageRating: avgPeerRating,
            evidence: assessment.evidence,
            confidenceLevel: assessment.confidence >= 7 ? 'high' : assessment.confidence >= 4 ? 'medium' : 'low',
            lastUpdated: new Date()
          }
        }
      })

      return assessmentDoc
    })

    const assessments = await Promise.all(assessmentPromises.filter(Boolean))
    console.log(`✅ Created ${assessments.length} assessments with peer reviews`)

    // Create sample job postings for gap analysis
    console.log('💼 Creating sample job postings for gap analysis...')
    
    const jobPostings = [
      {
        title: 'Senior Full Stack Engineer',
        company: {
          name: 'TechFlow Inc',
          industry: 'Technology',
          size: '100-500',
          location: 'San Francisco, CA'
        },
        location: 'San Francisco, CA',
        type: 'Full-time',
        remote: 'Hybrid',
        salaryRange: '$140k - $180k',
        description: 'Join our engineering team building next-gen SaaS platform. Work with modern tech stack and lead architectural decisions.',
        skills: {
          required: [
            { name: 'JavaScript', level: 8, category: 'Programming Languages', importance: 'critical' },
            { name: 'React', level: 8, category: 'Frontend Frameworks', importance: 'critical' },
            { name: 'Node.js', level: 7, category: 'Backend Frameworks', importance: 'critical' },
            { name: 'TypeScript', level: 8, category: 'Programming Languages', importance: 'high' },
            { name: 'AWS', level: 7, category: 'Cloud Platforms', importance: 'high' },
            { name: 'PostgreSQL', level: 6, category: 'Databases', importance: 'medium' },
            { name: 'Docker', level: 6, category: 'DevOps Tools', importance: 'medium' },
            { name: 'Leadership', level: 7, category: 'Soft Skills', importance: 'high' }
          ],
          preferred: [
            { name: 'Kubernetes', level: 6, category: 'DevOps Tools', importance: 'nice-to-have' },
            { name: 'Machine Learning', level: 5, category: 'Data', importance: 'nice-to-have' },
            { name: 'Python', level: 6, category: 'Programming Languages', importance: 'nice-to-have' }
          ]
        },
        posted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        title: 'Engineering Manager',
        company: {
          name: 'InnovateCorp',
          industry: 'Technology',
          size: '500-1000',
          location: 'Remote'
        },
        location: 'Remote',
        type: 'Full-time',
        remote: 'Remote',
        salaryRange: '$160k - $220k',
        description: 'Lead a team of 8+ engineers building cloud-native applications. Drive technical strategy and team growth.',
        skills: {
          required: [
            { name: 'Leadership', level: 9, category: 'Soft Skills', importance: 'critical' },
            { name: 'Project Management', level: 8, category: 'Project Management', importance: 'critical' },
            { name: 'JavaScript', level: 7, category: 'Programming Languages', importance: 'high' },
            { name: 'AWS', level: 8, category: 'Cloud Platforms', importance: 'high' },
            { name: 'Communication', level: 9, category: 'Soft Skills', importance: 'critical' },
            { name: 'Problem Solving', level: 8, category: 'Soft Skills', importance: 'high' }
          ],
          preferred: [
            { name: 'Machine Learning', level: 6, category: 'Data', importance: 'nice-to-have' },
            { name: 'Kubernetes', level: 7, category: 'DevOps Tools', importance: 'medium' },
            { name: 'Python', level: 7, category: 'Programming Languages', importance: 'medium' }
          ]
        },
        posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        title: 'Full Stack Developer (AI/ML Focus)',
        company: {
          name: 'DataTech Solutions',
          industry: 'Technology',
          size: '50-100',
          location: 'Austin, TX'
        },
        location: 'Austin, TX',
        type: 'Full-time',
        remote: 'Hybrid',
        salaryRange: '$120k - $160k',
        description: 'Build ML-powered web applications. Bridge the gap between traditional web development and data science.',
        skills: {
          required: [
            { name: 'Python', level: 8, category: 'Programming Languages', importance: 'critical' },
            { name: 'Machine Learning', level: 7, category: 'Data', importance: 'critical' },
            { name: 'JavaScript', level: 7, category: 'Programming Languages', importance: 'high' },
            { name: 'Data Analysis', level: 7, category: 'Data', importance: 'high' },
            { name: 'SQL', level: 7, category: 'Databases', importance: 'high' }
          ],
          preferred: [
            { name: 'React', level: 6, category: 'Frontend Frameworks', importance: 'medium' },
            { name: 'AWS', level: 6, category: 'Cloud Platforms', importance: 'medium' },
            { name: 'Docker', level: 5, category: 'DevOps Tools', importance: 'nice-to-have' }
          ]
        },
        posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    ]

    const jobPromises = jobPostings.map(job => Job.create(job))
    const jobs = await Promise.all(jobPromises)
    console.log(`✅ Created ${jobs.length} job postings for gap analysis`)

    console.log('\n🎉 Demo user creation complete!')
    console.log('\n📊 Demo User Profile Summary:')
    console.log(`👤 Name: ${demoUser.firstName} ${demoUser.lastName}`)
    console.log(`📧 Email: ${demoUser.email}`)
    console.log(`🔑 Password: demo123`)
    console.log(`💼 Title: ${demoUser.title}`)
    console.log(`🏢 Company: ${demoUser.company}`)
    console.log(`📍 Location: ${demoUser.location}`)
    console.log(`📈 Skills: ${assessments.length} skills with peer reviews`)
    console.log(`💼 Available Jobs: ${jobs.length} relevant job postings`)
    console.log('\n🚀 Ready for comprehensive skill gap analysis demo!')

    process.exit(0)

  } catch (error) {
    console.error('❌ Error creating demo user:', error)
    process.exit(1)
  }
}

// Helper function to generate realistic peer comments
function generatePeerComment(skillName, peerRating, selfRating) {
  const comments = {
    high: [ // For ratings 8-10
      `Exceptional ${skillName} skills. Goes above and beyond expectations.`,
      `Consistently delivers high-quality work using ${skillName}. Great mentor to others.`,
      `Expert level ${skillName} knowledge. Often consulted by team members.`,
      `Outstanding ${skillName} implementation. Sets the standard for the team.`,
      `Demonstrates deep understanding of ${skillName}. Innovative problem solver.`
    ],
    good: [ // For ratings 6-7
      `Solid ${skillName} skills with room for growth in advanced areas.`,
      `Competent with ${skillName}. Reliable delivery and good problem solving.`,
      `Good grasp of ${skillName} fundamentals. Could benefit from more complex projects.`,
      `Effective use of ${skillName} in daily work. Shows continuous improvement.`,
      `Strong ${skillName} foundation. Ready for more challenging assignments.`
    ],
    developing: [ // For ratings 4-5
      `Developing ${skillName} skills. Shows good potential with proper guidance.`,
      `Basic ${skillName} knowledge. Would benefit from additional training.`,
      `Learning ${skillName} well. Needs more hands-on experience.`,
      `Good foundation in ${skillName}. Ready to take on more complex tasks.`,
      `Progressing well with ${skillName}. Eager to learn and improve.`
    ],
    beginner: [ // For ratings 1-3
      `New to ${skillName}. Shows enthusiasm and willingness to learn.`,
      `Just starting with ${skillName}. Recommend focused training.`,
      `Basic understanding of ${skillName}. Needs mentorship and practice.`,
      `Beginning ${skillName} journey. Good attitude and learning mindset.`,
      `Limited ${skillName} experience. Potential for growth with proper support.`
    ]
  }

  let category = 'beginner'
  if (peerRating >= 8) category = 'high'
  else if (peerRating >= 6) category = 'good'
  else if (peerRating >= 4) category = 'developing'

  const categoryComments = comments[category]
  return categoryComments[Math.floor(Math.random() * categoryComments.length)]
}

// Run the seeding
createDemoUser()