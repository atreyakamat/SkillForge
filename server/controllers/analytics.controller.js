import User from '../models/User.js'
import Job from '../models/Job.js'
import Assessment from '../models/Assessment.js'
import { analyzeSkills, prioritizeGapsByImpact } from '../services/skillAnalysis.js'
import { rankJobs } from '../services/jobMatching.js'
import { generateLearningPath } from '../services/recommendations.js'

export async function getSkillDevelopmentPlan(req, res) {
  try {
    // Use current user from JWT if no userId provided, otherwise use the provided userId
    const userId = req.params.userId || req.user.id
    const user = await User.findById(userId)
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    // Fetch user skills from assessments
    const assessments = await Assessment.find({ user: userId }).populate('skill').lean()
    const userLevels = Object.fromEntries(assessments.map(a => [a.skill?.name, a.selfRating || 0]))
    
    const jobs = await Job.find({ 'company.industry': user.industry || 'Technology' }).limit(20)
    const required = Array.from(new Set(jobs.flatMap(j => (j.skills?.required || []).map(r => r.name)))).map(name => ({
      name,
      level: Math.round(jobs.reduce((sum,j)=> sum + ((j.skills?.required || []).find(r => r.name === name)?.level || 0), 0) / Math.max(1, jobs.length)),
      importance: 'preferred'
    }))
    const { gaps } = analyzeSkills(userLevels, required)
    const prioritized = prioritizeGapsByImpact(gaps)
    
    res.json({ 
      success: true, 
      developmentPlan: prioritized, 
      skillAnalysis: gaps,
      user: {
        id: user._id,
        name: user.name,
        industry: user.industry
      }
    })
  } catch (error) {
    console.error('Error in getSkillDevelopmentPlan:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export async function getJobMatches(req, res) {
  try {
    // Use current user from JWT if no userId provided, otherwise use the provided userId
    const userId = req.params.userId || req.user.id
    const user = await User.findById(userId)
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    // Fetch user skills from assessments
    const assessments = await Assessment.find({ user: userId }).populate('skill').lean()
    const userLevels = Object.fromEntries(assessments.map(a => [a.skill?.name, a.selfRating || 0]))
    
    const jobs = await Job.find({ 'company.industry': user.industry || 'Technology' }).limit(50)
    const ranked = rankJobs(userLevels, jobs)
    
    res.json({ 
      success: true, 
      matches: ranked.map(r => ({
        jobId: r.job._id,
        title: r.job.title,
        company: r.job.company,
        fitScore: r.fitScore,
        missingCritical: r.missingCritical
      })),
      user: {
        id: user._id,
        name: user.name,
        industry: user.industry
      }
    })
  } catch (error) {
    console.error('Error in getJobMatches:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export async function generateLearningPathController(req, res) {
  try {
    // Use current user from JWT if no userId provided, otherwise use the provided userId
    const userId = req.params.userId || req.user.id
    const user = await User.findById(userId)
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    // Fetch user skills from assessments
    const assessments = await Assessment.find({ user: userId }).populate('skill').lean()
    const userLevels = Object.fromEntries(assessments.map(a => [a.skill?.name, a.selfRating || 0]))
    
    const jobs = await Job.find({ 'company.industry': user.industry || 'Technology' }).limit(20)
    const required = Array.from(new Set(jobs.flatMap(j => (j.skills?.required || []).map(r => r.name)))).map(name => ({
      name,
      level: Math.round(jobs.reduce((sum,j)=> sum + ((j.skills?.required || []).find(r => r.name === name)?.level || 0), 0) / Math.max(1, jobs.length)),
      importance: 'preferred'
    }))
    const { gaps } = analyzeSkills(userLevels, required)
    const learning = generateLearningPath(gaps)
    
    res.json({ 
      success: true, 
      learningPath: learning,
      user: {
        id: user._id,
        name: user.name,
        industry: user.industry
      }
    })
  } catch (error) {
    console.error('Error in generateLearningPathController:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export async function getIndustryBenchmarks(req, res) {
  try {
    // Accept industry from either path params or query params
    const industry = req.params.industry || req.query.industry || 'Technology'
    
    console.log('🔍 Getting benchmarks for industry:', industry)
    
    // Since we don't have jobs with industry field, let's create mock benchmarks based on our skills
    const mockBenchmarks = [
      { name: 'JavaScript', avgRequiredLevel: 8.5 },
      { name: 'React', avgRequiredLevel: 8.0 },
      { name: 'Node.js', avgRequiredLevel: 7.5 },
      { name: 'TypeScript', avgRequiredLevel: 7.8 },
      { name: 'Python', avgRequiredLevel: 7.2 },
      { name: 'AWS', avgRequiredLevel: 7.0 },
      { name: 'Docker', avgRequiredLevel: 6.8 },
      { name: 'MongoDB', avgRequiredLevel: 6.5 },
      { name: 'SQL', avgRequiredLevel: 7.5 },
      { name: 'Machine Learning', avgRequiredLevel: 6.0 },
      { name: 'Kubernetes', avgRequiredLevel: 6.2 },
      { name: 'Leadership', avgRequiredLevel: 7.8 },
      { name: 'Communication', avgRequiredLevel: 8.2 },
      { name: 'Problem Solving', avgRequiredLevel: 9.0 },
      { name: 'Project Management', avgRequiredLevel: 7.5 }
    ]
    
    console.log('📊 Returning benchmarks:', mockBenchmarks.length, 'skills')
    
    res.json({ 
      success: true, 
      industry, 
      benchmarks: mockBenchmarks,
      message: `Industry benchmarks for ${industry}`
    })
  } catch (error) {
    console.error('Error in getIndustryBenchmarks:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve industry benchmarks',
      error: error.message 
    })
  }
}

export async function getSkillTrends(req, res) {
  const { skillName } = req.params
  // Mock trend data
  res.json({ success: true, skill: skillName, trend: {
    demandIndex: 78,
    growthYoY: 12.4,
    salaryPremiumPct: 8.5,
    forecast12m: 'rising'
  }})
}

export async function getSkillGapAnalysis(req, res) {
  try {
    const userId = req.user.id
    const { targetRole, industry, requiredSkills } = req.query
    
    // Get user data and skills
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Get user assessments
    const assessments = await Assessment.find({ user: userId }).populate('skill').lean()
    const userSkills = assessments.map(a => ({
      name: a.skill?.name,
      category: a.skill?.category,
      selfRating: a.selfRating || 0,
      averageRating: a.averageRating || a.selfRating || 0,
      confidence: a.confidence || 5
    }))

    // Get target job requirements
    let targetSkills = []
    if (targetRole || industry) {
      const jobQuery = {}
      if (targetRole) jobQuery['title'] = new RegExp(targetRole, 'i')
      if (industry) jobQuery['company.industry'] = industry

      const jobs = await Job.find(jobQuery).limit(10).lean()
      
      if (jobs.length > 0) {
        const skillRequirements = {}
        jobs.forEach(job => {
          (job.skills?.required || []).forEach(skill => {
            if (skillRequirements[skill.name]) {
              skillRequirements[skill.name].totalLevel += skill.level || 5
              skillRequirements[skill.name].count += 1
            } else {
              skillRequirements[skill.name] = { 
                totalLevel: skill.level || 5, 
                count: 1,
                category: skill.category || 'General'
              }
            }
          })
        })

        targetSkills = Object.entries(skillRequirements).map(([name, data]) => ({
          name,
          category: data.category,
          requiredLevel: Math.round(data.totalLevel / data.count),
          importance: 'required'
        }))
      }
    }

    // If specific required skills provided, add them
    if (requiredSkills) {
      const reqSkillsArray = Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills]
      reqSkillsArray.forEach(skillName => {
        if (!targetSkills.find(s => s.name === skillName)) {
          targetSkills.push({
            name: skillName,
            category: 'General',
            requiredLevel: 7, // Default required level
            importance: 'required'
          })
        }
      })
    }

    // If no target skills found from jobs or requirements, use industry benchmarks for user's skills
    if (targetSkills.length === 0 && userSkills.length > 0) {
      // Create default industry benchmarks for user's existing skills
      targetSkills = userSkills.map(skill => ({
        name: skill.name,
        category: skill.category,
        requiredLevel: Math.min(10, (skill.selfRating || 0) + 2), // Set target slightly higher than current
        importance: 'recommended'
      }))
    }

    // Calculate gaps
    const gaps = []
    const strengths = []
    
    targetSkills.forEach(targetSkill => {
      const userSkill = userSkills.find(us => us.name === targetSkill.name)
      const userLevel = userSkill ? userSkill.selfRating : 0
      const gap = Math.max(0, targetSkill.requiredLevel - userLevel)
      
      if (gap > 0) {
        gaps.push({
          skill: targetSkill.name,
          category: targetSkill.category,
          currentLevel: userLevel,
          requiredLevel: targetSkill.requiredLevel,
          gap,
          priority: gap >= 3 ? 'critical' : gap >= 2 ? 'high' : 'medium',
          estimatedLearningTime: `${Math.max(1, gap * 2)} weeks`,
          salaryImpact: gap * 5000, // Mock salary impact
          learningResources: [
            'Online courses',
            'Practice projects',
            'Industry certifications'
          ]
        })
      } else {
        strengths.push({
          skill: targetSkill.name,
          category: targetSkill.category,
          currentLevel: userLevel,
          advantage: userLevel - targetSkill.requiredLevel
        })
      }
    })

    // Calculate overall metrics
    const criticalGaps = gaps.filter(g => g.priority === 'critical')
    const overallScore = targetSkills.length > 0 
      ? Math.round(((targetSkills.length - gaps.length) / targetSkills.length) * 100)
      : 100

    const analysis = {
      overallScore,
      totalGaps: gaps.length,
      criticalGaps: criticalGaps.length,
      strengths: strengths.length,
      gaps: gaps.sort((a, b) => b.gap - a.gap), // Sort by gap size
      strengths: strengths.sort((a, b) => b.advantage - a.advantage),
      recommendations: [
        'Focus on critical skills first',
        'Consider online courses for quick wins', 
        'Practice with real projects',
        'Join professional communities'
      ],
      learningPath: {
        totalEstimatedTime: `${gaps.reduce((sum, gap) => sum + parseInt(gap.estimatedLearningTime), 0)} weeks`,
        phases: [
          {
            name: 'Foundation Building',
            skills: gaps.filter(g => g.priority === 'critical').map(g => g.skill),
            duration: '4-6 weeks'
          },
          {
            name: 'Skill Enhancement',
            skills: gaps.filter(g => g.priority === 'high').map(g => g.skill),
            duration: '6-8 weeks'
          },
          {
            name: 'Advanced Development',
            skills: gaps.filter(g => g.priority === 'medium').map(g => g.skill),
            duration: '4-6 weeks'
          }
        ]
      }
    }

    res.json({ 
      success: true, 
      analysis,
      targetRole,
      industry,
      userSkillsCount: userSkills.length,
      targetSkillsCount: targetSkills.length
    })

  } catch (error) {
    console.error('Error in getSkillGapAnalysis:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

