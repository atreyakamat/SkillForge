import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { connectDb } from '../config/db.js'
import User from '../models/User.js'
import Assessment from '../models/Assessment.js'
import Skill from '../models/Skill.js'

dotenv.config()

async function createIdealDemoUser() {
  await connectDb()
  
  console.log('🚀 Creating IDEAL demo user with comprehensive skill portfolio...')

  try {
    // Clear existing demo user
    await User.deleteOne({ email: 'demo@skillforge.com' })
    
    // Delete existing assessments for clean slate
    const existingUser = await User.findOne({ email: 'demo@skillforge.com' })
    if (existingUser) {
      await Assessment.deleteMany({ user: existingUser._id })
    }

    // Create/verify skills exist with proper categories
    const skillsData = [
      // Frontend Excellence
      { name: 'JavaScript', category: 'Programming Languages', marketDemandScore: 95 },
      { name: 'React', category: 'Frontend', marketDemandScore: 90 },
      { name: 'TypeScript', category: 'Programming Languages', marketDemandScore: 88 },
      { name: 'HTML/CSS', category: 'Frontend', marketDemandScore: 85 },
      { name: 'Vue.js', category: 'Frontend', marketDemandScore: 75 },
      
      // Backend Mastery
      { name: 'Node.js', category: 'Backend', marketDemandScore: 88 },
      { name: 'Python', category: 'Programming Languages', marketDemandScore: 92 },
      { name: 'Java', category: 'Programming Languages', marketDemandScore: 85 },
      { name: 'Go', category: 'Programming Languages', marketDemandScore: 80 },
      
      // Database Expertise
      { name: 'MongoDB', category: 'Databases', marketDemandScore: 82 },
      { name: 'PostgreSQL', category: 'Databases', marketDemandScore: 85 },
      { name: 'Redis', category: 'Databases', marketDemandScore: 75 },
      { name: 'SQL', category: 'Databases', marketDemandScore: 90 },
      
      // Cloud & DevOps
      { name: 'AWS', category: 'Cloud Platforms', marketDemandScore: 95 },
      { name: 'Docker', category: 'DevOps Tools', marketDemandScore: 90 },
      { name: 'Kubernetes', category: 'DevOps Tools', marketDemandScore: 85 },
      { name: 'CI/CD', category: 'DevOps Tools', marketDemandScore: 88 },
      { name: 'Terraform', category: 'DevOps Tools', marketDemandScore: 82 },
      
      // Emerging Tech
      { name: 'Machine Learning', category: 'Data', marketDemandScore: 92 },
      { name: 'Data Analysis', category: 'Data', marketDemandScore: 88 },
      
      // Leadership & Soft Skills
      { name: 'Project Management', category: 'Project Management', marketDemandScore: 85 },
      { name: 'Leadership', category: 'Soft Skills', marketDemandScore: 88 },
      { name: 'Communication', category: 'Soft Skills', marketDemandScore: 95 },
      { name: 'Problem Solving', category: 'Soft Skills', marketDemandScore: 90 }
    ]

    console.log('📝 Creating/verifying skills...')
    const skillPromises = skillsData.map(async (skillData) => {
      let skill = await Skill.findOne({ name: skillData.name })
      if (!skill) {
        skill = await Skill.create({
          name: skillData.name,
          category: skillData.category,
          marketDemandScore: skillData.marketDemandScore,
          description: `Professional ${skillData.name} expertise`,
          industryRelevance: 8,
          marketDemand: 8
        })
      }
      return skill
    })
    const skills = await Promise.all(skillPromises)
    console.log(`✅ Created/verified ${skills.length} skills`)

    // Create the IDEAL demo user
    console.log('👤 Creating ideal demo user profile...')
    const hashedPassword = await bcrypt.hash('demo123', 12)
    
    const demoUser = await User.create({
      name: 'Alexandra Chen',
      email: 'demo@skillforge.com',
      passwordHash: hashedPassword,
      role: 'Developer',
      careerGoals: 'Become a Senior Engineering Manager and lead AI/ML initiatives. Build scalable systems that impact millions of users while mentoring the next generation of developers.',
      experienceLevel: 'senior',
      industry: 'Technology',
      preferences: {
        notifications: true,
        privacy: 'public'
      },
      skills: [] // Will be populated via assessments
    })

    console.log(`✅ Created demo user: ${demoUser.email}`)

    // Create comprehensive skill assessments with realistic progression
    console.log('📊 Creating comprehensive skill assessments...')
    
    const idealSkillAssessments = [
      // === EXPERT LEVEL SKILLS (9-10) ===
      { 
        skill: 'JavaScript', 
        selfRating: 10, 
        confidence: 10,
        evidence: '8+ years experience. Built 20+ production applications serving millions of users. Core contributor to open source React ecosystem. Mentored 15+ junior developers. Expert in ES6+, async patterns, performance optimization, and modern tooling.',
        peerCount: 5,
        peerRange: [9, 10]
      },
      { 
        skill: 'Problem Solving', 
        selfRating: 10, 
        confidence: 10,
        evidence: 'Consistently solve complex architectural challenges. Led incident response for critical production issues. Designed scalable solutions handling 1M+ concurrent users. Known for innovative debugging approaches and system design expertise.',
        peerCount: 4,
        peerRange: [9, 10]
      },
      { 
        skill: 'React', 
        selfRating: 9, 
        confidence: 9,
        evidence: 'Lead React developer for 6 years. Built complex SPAs with advanced state management (Redux, Context). Performance optimization expert (code splitting, memoization). Created reusable component libraries used across 10+ teams.',
        peerCount: 5,
        peerRange: [8, 10]
      },
      
      // === ADVANCED LEVEL SKILLS (7-8) ===
      { 
        skill: 'Node.js', 
        selfRating: 8, 
        confidence: 8,
        evidence: 'Built 15+ production APIs serving 500K+ daily active users. Microservices architecture expert. Performance optimization (caching, database optimization). Experienced with Express, Fastify, and serverless functions.',
        peerCount: 4,
        peerRange: [7, 9]
      },
      { 
        skill: 'AWS', 
        selfRating: 8, 
        confidence: 7,
        evidence: 'AWS Solutions Architect Associate certified. Deployed and managed production infrastructure (EC2, S3, Lambda, RDS, CloudFormation). Cost optimization saved company $50K annually. Serverless architecture expertise.',
        peerCount: 3,
        peerRange: [7, 8]
      },
      { 
        skill: 'TypeScript', 
        selfRating: 8, 
        confidence: 8,
        evidence: 'Migrated 5 large codebases to TypeScript. Expert in advanced type patterns, generics, and conditional types. Improved code quality metrics by 40%. Built type-safe API layers and complex domain models.',
        peerCount: 4,
        peerRange: [7, 8]
      },
      { 
        skill: 'HTML/CSS', 
        selfRating: 8, 
        confidence: 9,
        evidence: 'Expert in modern CSS (Grid, Flexbox, CSS-in-JS). Accessibility advocate (WCAG 2.1 compliant applications). Created design system used by 50+ developers. Responsive design expert for mobile-first applications.',
        peerCount: 3,
        peerRange: [8, 9]
      },
      { 
        skill: 'Docker', 
        selfRating: 8, 
        confidence: 8,
        evidence: 'Containerized 20+ applications. Expert in multi-stage builds, Docker Compose orchestration. Reduced deployment time by 70%. Built CI/CD pipelines with automated testing and deployment.',
        peerCount: 4,
        peerRange: [7, 8]
      },
      { 
        skill: 'Communication', 
        selfRating: 8, 
        confidence: 9,
        evidence: 'Technical blog with 25K+ monthly readers. Speaker at 5 major tech conferences. Led cross-functional teams of 12+ people. Excellent at translating technical concepts to stakeholders.',
        peerCount: 5,
        peerRange: [8, 9]
      },
      { 
        skill: 'Project Management', 
        selfRating: 8, 
        confidence: 8,
        evidence: 'Scrum Master certified. Led 8 major product launches. Managed budgets up to $2M. Expert in Agile methodologies, stakeholder management, and risk mitigation. 95% on-time delivery rate.',
        peerCount: 4,
        peerRange: [7, 8]
      },
      
      // === PROFICIENT LEVEL SKILLS (6-7) ===
      { 
        skill: 'Leadership', 
        selfRating: 7, 
        confidence: 7,
        evidence: 'Team lead for 8 developers across 3 time zones. Mentoring program graduate. Led technical decision-making for critical product features. Strong in talent development and performance management.',
        peerCount: 4,
        peerRange: [6, 8]
      },
      { 
        skill: 'Python', 
        selfRating: 7, 
        confidence: 6,
        evidence: 'Built data processing pipelines handling 1TB+ daily. Flask/Django applications for internal tools. Machine learning model deployment. Strong in automation scripting and API integration.',
        peerCount: 3,
        peerRange: [6, 7]
      },
      { 
        skill: 'MongoDB', 
        selfRating: 7, 
        confidence: 7,
        evidence: 'Designed schemas for applications with 10M+ records. Aggregation pipeline expert. Performance tuning and indexing strategies. Replica set configuration and sharding experience.',
        peerCount: 3,
        peerRange: [6, 8]
      },
      { 
        skill: 'CI/CD', 
        selfRating: 7, 
        confidence: 7,
        evidence: 'Built automated pipelines for 15+ repositories. GitHub Actions, Jenkins, and GitLab CI expertise. Implemented deployment strategies (blue-green, canary). Reduced deployment time from hours to minutes.',
        peerCount: 4,
        peerRange: [6, 8]
      },
      { 
        skill: 'SQL', 
        selfRating: 7, 
        confidence: 8,
        evidence: 'Complex query optimization for analytics dashboards. Database design and normalization. Performance tuning (indexing, query plans). Experience with PostgreSQL, MySQL, and SQL Server.',
        peerCount: 3,
        peerRange: [7, 8]
      },
      { 
        skill: 'PostgreSQL', 
        selfRating: 6, 
        confidence: 6,
        evidence: 'Production database administration. JSONB operations and advanced SQL features. Backup and recovery procedures. Performance monitoring and optimization.',
        peerCount: 2,
        peerRange: [6, 7]
      },
      
      // === DEVELOPING SKILLS (4-5) ===
      { 
        skill: 'Kubernetes', 
        selfRating: 5, 
        confidence: 4,
        evidence: 'Deployed applications to production K8s clusters. Understanding of pods, services, and deployments. Learning advanced concepts like operators and custom resources. Helm chart creation.',
        peerCount: 3,
        peerRange: [4, 6]
      },
      { 
        skill: 'Machine Learning', 
        selfRating: 5, 
        confidence: 4,
        evidence: 'Completed Stanford ML course and built 4 demo projects. Scikit-learn and TensorFlow experience. Deployed ML models to production. Currently learning MLOps and model versioning.',
        peerCount: 2,
        peerRange: [4, 5]
      },
      { 
        skill: 'Data Analysis', 
        selfRating: 5, 
        confidence: 5,
        evidence: 'Pandas and NumPy for data processing. Built analytics dashboards with Plotly. Statistical analysis for A/B testing. Learning advanced visualization techniques.',
        peerCount: 3,
        peerRange: [4, 6]
      },
      { 
        skill: 'Java', 
        selfRating: 4, 
        confidence: 3,
        evidence: 'University coursework and 2 small commercial projects. Spring Boot applications. Understanding of OOP principles and design patterns. Need more enterprise-level experience.',
        peerCount: 2,
        peerRange: [3, 5]
      },
      { 
        skill: 'Terraform', 
        selfRating: 4, 
        confidence: 3,
        evidence: 'Infrastructure as Code for AWS resources. Basic module creation and state management. Deployed staging environments. Learning advanced patterns and best practices.',
        peerCount: 2,
        peerRange: [3, 4]
      },
      
      // === LEARNING SKILLS (2-3) ===
      { 
        skill: 'Go', 
        selfRating: 3, 
        confidence: 2,
        evidence: 'Completed Go tour and built 2 CLI tools. Understanding goroutines and channels. Interested in microservices development. Need more hands-on project experience.',
        peerCount: 2,
        peerRange: [2, 4]
      },
      { 
        skill: 'Vue.js', 
        selfRating: 3, 
        confidence: 2,
        evidence: 'Built 1 small application for learning. Understanding of Vue 3 Composition API. Comparing with React for potential adoption. Need production experience.',
        peerCount: 1,
        peerRange: [2, 3]
      },
      { 
        skill: 'Redis', 
        selfRating: 3, 
        confidence: 3,
        evidence: 'Used for session storage and basic caching. Understanding of data structures and pub/sub. Learning advanced patterns like distributed caching and rate limiting.',
        peerCount: 2,
        peerRange: [3, 4]
      }
    ]

    // Create assessments with realistic peer reviews
    const assessmentPromises = idealSkillAssessments.map(async (assessment) => {
      const skill = skills.find(s => s.name === assessment.skill)
      if (!skill) return null

      // Generate realistic peer ratings
      const peerRatings = []
      for (let i = 0; i < assessment.peerCount; i++) {
        const peerRating = assessment.peerRange[0] + Math.random() * (assessment.peerRange[1] - assessment.peerRange[0])
        peerRatings.push({
          reviewerId: null,
          rating: Math.round(peerRating * 10) / 10,
          comment: generateRealisticComment(assessment.skill, peerRating, assessment.selfRating),
          date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Last 60 days
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
        lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      })

      // Add to user's skills array
      await User.findByIdAndUpdate(demoUser._id, {
        $push: {
          skills: {
            skillId: skill._id,
            name: skill.name,
            selfRating: assessment.selfRating,
            peerRatings: peerRatings,
            averageRating: avgPeerRating,
            evidence: assessment.evidence,
            confidenceLevel: assessment.confidence >= 8 ? 'high' : assessment.confidence >= 5 ? 'medium' : 'low',
            lastUpdated: new Date()
          }
        }
      })

      return assessmentDoc
    })

    const assessments = await Promise.all(assessmentPromises.filter(Boolean))
    console.log(`✅ Created ${assessments.length} comprehensive assessments`)

    // Final user summary
    console.log('\n🎉 IDEAL DEMO USER CREATED SUCCESSFULLY!')
    console.log('\n' + '='.repeat(60))
    console.log('👤 DEMO USER PROFILE SUMMARY')
    console.log('='.repeat(60))
    console.log(`📧 Email: ${demoUser.email}`)
    console.log(`🔑 Password: demo123`)
    console.log(`👤 Name: ${demoUser.name}`)
    console.log(`💼 Role: Senior Full Stack Developer`)
    console.log(`📈 Experience: ${demoUser.experienceLevel}`)
    console.log(`🏢 Industry: ${demoUser.industry}`)
    
    console.log('\n📊 SKILL PORTFOLIO BREAKDOWN:')
    console.log('─'.repeat(40))
    console.log('🥇 EXPERT LEVEL (9-10):')
    console.log('   • JavaScript (10/10) - 8+ years, open source contributor')
    console.log('   • Problem Solving (10/10) - System architecture expert')
    console.log('   • React (9/10) - Lead developer, 6 years experience')
    
    console.log('\n🥈 ADVANCED LEVEL (7-8):')
    console.log('   • Node.js (8/10) - Production APIs, microservices')
    console.log('   • AWS (8/10) - Solutions Architect certified')
    console.log('   • TypeScript (8/10) - Migrated 5 large codebases')
    console.log('   • HTML/CSS (8/10) - Design system creator')
    console.log('   • Docker (8/10) - Containerization expert')
    console.log('   • Communication (8/10) - Tech blogger, conference speaker')
    console.log('   • Project Management (8/10) - Scrum Master, $2M budget')
    
    console.log('\n🥉 PROFICIENT LEVEL (6-7):')
    console.log('   • Leadership (7/10) - Team lead, 8 developers')
    console.log('   • Python (7/10) - Data pipelines, 1TB+ daily')
    console.log('   • MongoDB (7/10) - 10M+ records, aggregation expert')
    console.log('   • CI/CD (7/10) - Automated 15+ repositories')
    console.log('   • SQL (7/10) - Query optimization, analytics')
    console.log('   • PostgreSQL (6/10) - Production DBA experience')
    
    console.log('\n📈 DEVELOPING SKILLS (4-5):')
    console.log('   • Kubernetes (5/10) - Production deployments, learning advanced')
    console.log('   • Machine Learning (5/10) - Stanford course, 4 projects')
    console.log('   • Data Analysis (5/10) - Pandas, A/B testing')
    console.log('   • Java (4/10) - Spring Boot, need enterprise experience')
    console.log('   • Terraform (4/10) - IaC basics, learning patterns')
    
    console.log('\n🌱 LEARNING SKILLS (2-3):')
    console.log('   • Go (3/10) - CLI tools, goroutines')
    console.log('   • Vue.js (3/10) - 1 project, comparing with React')
    console.log('   • Redis (3/10) - Caching, learning advanced patterns')
    
    console.log('\n🎯 IDEAL FOR DEMONSTRATING:')
    console.log('─'.repeat(40))
    console.log('✅ Complete skill journey from beginner to expert')
    console.log('✅ Realistic career progression and gaps')
    console.log('✅ Rich peer feedback and evidence')
    console.log('✅ Clear strengths and improvement areas')
    console.log('✅ Professional development trajectory')
    console.log('✅ Pentagon chart with meaningful data')
    console.log('✅ Comprehensive analytics and insights')
    
    console.log('\n🚀 READY TO DEMO!')
    console.log('Login at http://localhost:5174 with the credentials above')

    process.exit(0)

  } catch (error) {
    console.error('❌ Error creating ideal demo user:', error)
    process.exit(1)
  }
}

// Helper function to generate realistic peer comments
function generateRealisticComment(skillName, peerRating, selfRating) {
  const ratingLevel = Math.floor(peerRating)
  
  const expertComments = [
    `${skillName} expertise is exceptional. Sets the technical standard for our entire team.`,
    `Industry-leading ${skillName} skills. Consistently delivers innovative solutions.`,
    `${skillName} mastery is evident in every project. Mentor to senior developers.`,
    `Outstanding ${skillName} architect. Complex problems become elegant solutions.`,
    `World-class ${skillName} expertise. Drives technical excellence across organization.`
  ]
  
  const advancedComments = [
    `Strong ${skillName} skills with deep technical understanding. Reliable for complex features.`,
    `Excellent ${skillName} implementation. Goes beyond requirements with quality solutions.`,
    `Solid ${skillName} expertise. Trusted with critical production systems.`,
    `Advanced ${skillName} knowledge. Effective technical leadership in this area.`,
    `Impressive ${skillName} skills. Consistently delivers high-quality implementations.`
  ]
  
  const proficientComments = [
    `Good ${skillName} foundation with room for advanced concepts. Shows steady improvement.`,
    `Competent ${skillName} skills. Handles most requirements effectively with minimal guidance.`,
    `Solid ${skillName} understanding. Ready for more complex challenges in this area.`,
    `Effective ${skillName} usage in daily work. Continues learning advanced patterns.`,
    `Reliable ${skillName} implementation. Good grasp of fundamentals and best practices.`
  ]
  
  const developingComments = [
    `Developing ${skillName} skills show good potential. Benefits from code reviews and guidance.`,
    `Learning ${skillName} well with proper mentorship. Eager to take on new challenges.`,
    `Good progress in ${skillName}. Needs more hands-on experience with complex scenarios.`,
    `Growing ${skillName} expertise. Shows commitment to continuous improvement.`,
    `Promising ${skillName} development. Ready for intermediate-level tasks with support.`
  ]
  
  const beginnerComments = [
    `Early ${skillName} journey shows enthusiasm. Recommend focused training and practice.`,
    `Basic ${skillName} understanding with good learning attitude. Needs structured development.`,
    `Starting ${skillName} development. Shows potential with proper guidance and patience.`,
    `Beginner-level ${skillName} with willingness to learn. Pair programming recommended.`,
    `New to ${skillName} but demonstrates strong problem-solving approach.`
  ]
  
  let comments = beginnerComments
  if (ratingLevel >= 9) comments = expertComments
  else if (ratingLevel >= 7) comments = advancedComments
  else if (ratingLevel >= 5) comments = proficientComments
  else if (ratingLevel >= 3) comments = developingComments
  
  return comments[Math.floor(Math.random() * comments.length)]
}

// Run the ideal demo user creation
createIdealDemoUser()