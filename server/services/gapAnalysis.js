import Job from '../models/Job.js'
import User from '../models/User.js'
import Skill from '../models/Skill.js'

/**
 * Gap Analysis Service
 * Implements ML algorithms for skill gap calculation and priority scoring
 */
class GapAnalysisService {

  /**
   * Analyze skill gaps for a specific job
   * @param {Array} userSkills - User's current skills
   * @param {Object} job - Target job object
   * @returns {Object} Detailed gap analysis
   */
  async analyzeJobGaps(userSkills, job) {
    try {
      const analysis = {
        jobId: job._id,
        jobTitle: job.title,
        company: job.company.name,
        overallMatch: 0,
        gaps: {
          critical: [],
          moderate: [],
          minor: []
        },
        strengths: [],
        recommendations: [],
        learningPath: [],
        timeEstimate: 0,
        difficultyScore: 0,
        priorityScore: 0
      }

      // Calculate overall match score
      analysis.overallMatch = job.calculateMatchScore(userSkills)

      // Analyze required skills gaps
      const requiredGaps = await this._analyzeSkillGaps(
        job.skills.required || [], 
        userSkills, 
        'required'
      )

      // Analyze preferred skills gaps
      const preferredGaps = await this._analyzeSkillGaps(
        job.skills.preferred || [], 
        userSkills, 
        'preferred'
      )

      // Combine and categorize gaps
      const allGaps = [...requiredGaps, ...preferredGaps]
      this._categorizeGaps(allGaps, analysis.gaps)

      // Identify strengths
      analysis.strengths = this._identifyStrengths(job, userSkills)

      // Calculate difficulty and priority scores
      analysis.difficultyScore = this._calculateDifficultyScore(allGaps)
      analysis.priorityScore = this._calculatePriorityScore(job, allGaps, analysis.overallMatch)

      // Generate learning path
      analysis.learningPath = await this._generateLearningPath(allGaps, analysis.priorityScore)
      analysis.timeEstimate = this._estimateLearningTime(analysis.learningPath)

      // Generate recommendations
      analysis.recommendations = this._generateGapRecommendations(analysis)

      return analysis

    } catch (error) {
      console.error('Error in analyzeJobGaps:', error)
      throw new Error('Failed to analyze job gaps')
    }
  }

  /**
   * Analyze skill gaps for an industry/experience level
   * @param {Array} userSkills - User's current skills
   * @param {Object} criteria - Industry and experience level criteria
   * @returns {Object} Industry gap analysis
   */
  async analyzeIndustryGaps(userSkills, criteria) {
    try {
      const { industry, experienceLevel } = criteria

      // Get representative jobs from the industry/level
      const sampleJobs = await Job.find({
        'company.industry': industry,
        experienceLevel: experienceLevel || { $exists: true },
        'application.status': 'active'
      })
      .limit(50)
      .select('skills title company')

      if (sampleJobs.length === 0) {
        throw new Error('No jobs found for the specified criteria')
      }

      // Aggregate skill requirements across jobs
      const skillDemand = this._aggregateSkillDemand(sampleJobs)

      // Analyze gaps against industry standards
      const industryAnalysis = {
        industry,
        experienceLevel,
        sampleSize: sampleJobs.length,
        skillDemand,
        gaps: {
          critical: [],
          moderate: [],
          minor: []
        },
        strengths: [],
        marketReadiness: 0,
        competitiveAdvantage: [],
        learningPriorities: [],
        careerRecommendations: []
      }

      // Analyze user's position in the market
      const gaps = this._analyzeIndustryPosition(userSkills, skillDemand)
      this._categorizeGaps(gaps, industryAnalysis.gaps)

      // Calculate market readiness score
      industryAnalysis.marketReadiness = this._calculateMarketReadiness(userSkills, skillDemand)

      // Identify competitive advantages
      industryAnalysis.competitiveAdvantage = this._identifyCompetitiveAdvantage(userSkills, skillDemand)

      // Generate learning priorities
      industryAnalysis.learningPriorities = await this._generateIndustryLearningPriorities(gaps, skillDemand)

      // Generate career recommendations
      industryAnalysis.careerRecommendations = this._generateCareerRecommendations(industryAnalysis)

      return industryAnalysis

    } catch (error) {
      console.error('Error in analyzeIndustryGaps:', error)
      throw new Error('Failed to analyze industry gaps')
    }
  }

  /**
   * Generate personalized learning path for a specific job
   * @param {Array} userSkills - User's current skills
   * @param {Object} job - Target job
   * @param {Number} timeframe - Learning timeframe in months
   * @returns {Object} Personalized learning path
   */
  async generateJobLearningPath(userSkills, job, timeframe = 6) {
    try {
      const gaps = job.getSkillGaps(userSkills)
      
      const learningPath = {
        jobId: job._id,
        jobTitle: job.title,
        timeframe,
        totalGaps: gaps.length,
        phases: [],
        milestones: [],
        resources: [],
        estimatedHours: 0,
        successMetrics: []
      }

      // Sort gaps by priority and learning efficiency
      const prioritizedGaps = this._prioritizeGapsForLearning(gaps, timeframe)

      // Create learning phases
      learningPath.phases = await this._createLearningPhases(prioritizedGaps, timeframe)

      // Set milestones
      learningPath.milestones = this._createMilestones(learningPath.phases)

      // Recommend resources
      learningPath.resources = await this._recommendLearningResources(prioritizedGaps)

      // Calculate time estimate
      learningPath.estimatedHours = this._calculateTotalLearningHours(learningPath.phases)

      // Define success metrics
      learningPath.successMetrics = this._defineSuccessMetrics(job, gaps)

      return learningPath

    } catch (error) {
      console.error('Error in generateJobLearningPath:', error)
      throw new Error('Failed to generate job learning path')
    }
  }

  /**
   * Generate learning path for industry transition
   * @param {Array} userSkills - User's current skills
   * @param {Object} target - Target industry and level
   * @returns {Object} Industry transition learning path
   */
  async generateIndustryLearningPath(userSkills, target) {
    try {
      const { industry, level, timeframe = 12 } = target

      // Analyze current position vs target
      const gapAnalysis = await this.analyzeIndustryGaps(userSkills, { industry, experienceLevel: level })

      const transitionPath = {
        currentIndustry: this._inferCurrentIndustry(userSkills),
        targetIndustry: industry,
        targetLevel: level,
        timeframe,
        readinessScore: gapAnalysis.marketReadiness,
        phases: [],
        keySkillsToAcquire: [],
        skillsToImprove: [],
        transferableSkills: [],
        networkingStrategy: [],
        careerMilestones: []
      }

      // Identify transferable skills
      transitionPath.transferableSkills = this._identifyTransferableSkills(userSkills, industry)

      // Plan skill acquisition
      const allGaps = [...gapAnalysis.gaps.critical, ...gapAnalysis.gaps.moderate]
      transitionPath.phases = await this._createTransitionPhases(allGaps, timeframe)

      // Key skills to acquire
      transitionPath.keySkillsToAcquire = gapAnalysis.gaps.critical
        .slice(0, 5)
        .map(gap => ({
          skill: gap.skill,
          importance: gap.priority,
          timeToLearn: gap.estimatedTime,
          resources: gap.recommendedResources || []
        }))

      // Skills to improve
      transitionPath.skillsToImprove = gapAnalysis.gaps.moderate
        .slice(0, 5)
        .map(gap => ({
          skill: gap.skill,
          currentLevel: gap.current,
          targetLevel: gap.required,
          improvement: gap.gap
        }))

      // Networking strategy
      transitionPath.networkingStrategy = this._generateNetworkingStrategy(industry, level)

      // Career milestones
      transitionPath.careerMilestones = this._generateCareerMilestones(transitionPath)

      return transitionPath

    } catch (error) {
      console.error('Error in generateIndustryLearningPath:', error)
      throw new Error('Failed to generate industry learning path')
    }
  }

  /**
   * Get salary impact analysis for skill improvements
   * @param {Array} userSkills - User's current skills
   * @param {Array} targetSkills - Skills to potentially acquire
   * @param {Object} criteria - Industry and location criteria
   * @returns {Object} Salary impact analysis
   */
  async analyzeSalaryImpact(userSkills, targetSkills, criteria = {}) {
    try {
      const { industry, location, experienceLevel } = criteria

      // Get baseline salary for current skills
      const baselineSalary = await this._estimateCurrentSalary(userSkills, criteria)

      // Calculate potential salary with target skills
      const projectedSalary = await this._estimateProjectedSalary(
        [...userSkills, ...targetSkills], 
        criteria
      )

      const analysis = {
        baseline: baselineSalary,
        projected: projectedSalary,
        increase: {
          absolute: projectedSalary.median - baselineSalary.median,
          percentage: ((projectedSalary.median - baselineSalary.median) / baselineSalary.median) * 100
        },
        skillImpacts: [],
        industryBenchmarks: {},
        recommendations: []
      }

      // Analyze individual skill impacts
      for (const skill of targetSkills) {
        const skillImpact = await this._calculateSkillSalaryImpact(skill, criteria)
        analysis.skillImpacts.push({
          skill: skill.name,
          impact: skillImpact,
          roi: this._calculateSkillROI(skill, skillImpact)
        })
      }

      // Get industry benchmarks
      analysis.industryBenchmarks = await this._getIndustryBenchmarks(industry, experienceLevel)

      // Generate salary optimization recommendations
      analysis.recommendations = this._generateSalaryRecommendations(analysis)

      return analysis

    } catch (error) {
      console.error('Error in analyzeSalaryImpact:', error)
      throw new Error('Failed to analyze salary impact')
    }
  }

  // Private helper methods

  async _analyzeSkillGaps(requiredSkills, userSkills, type) {
    const gaps = []

    for (const reqSkill of requiredSkills) {
      const userSkill = userSkills.find(us => 
        us.name.toLowerCase() === reqSkill.name.toLowerCase()
      )

      const gap = {
        skill: reqSkill.name,
        category: reqSkill.category || 'technical',
        required: reqSkill.level,
        current: userSkill ? userSkill.level : 0,
        gap: reqSkill.level - (userSkill ? userSkill.level : 0),
        type: type,
        weight: reqSkill.weight || 1,
        priority: 'medium',
        estimatedTime: 0,
        difficulty: 'medium'
      }

      // Calculate priority based on gap size and importance
      if (gap.gap >= 3 || (gap.gap > 0 && type === 'required')) {
        gap.priority = 'high'
      } else if (gap.gap >= 2) {
        gap.priority = 'medium'
      } else {
        gap.priority = 'low'
      }

      // Estimate learning time (simplified model)
      gap.estimatedTime = this._estimateSkillLearningTime(gap)

      // Determine difficulty
      gap.difficulty = this._assessSkillDifficulty(reqSkill.name, gap.gap)

      if (gap.gap > 0) {
        gaps.push(gap)
      }
    }

    return gaps
  }

  _categorizeGaps(gaps, categories) {
    gaps.forEach(gap => {
      if (gap.priority === 'high' || (gap.type === 'required' && gap.gap >= 2)) {
        categories.critical.push(gap)
      } else if (gap.priority === 'medium' || gap.gap >= 1) {
        categories.moderate.push(gap)
      } else {
        categories.minor.push(gap)
      }
    })
  }

  _identifyStrengths(job, userSkills) {
    const strengths = []

    if (job.skills.required) {
      job.skills.required.forEach(reqSkill => {
        const userSkill = userSkills.find(us => 
          us.name.toLowerCase() === reqSkill.name.toLowerCase()
        )

        if (userSkill && userSkill.level >= reqSkill.level) {
          strengths.push({
            skill: reqSkill.name,
            userLevel: userSkill.level,
            requiredLevel: reqSkill.level,
            advantage: userSkill.level - reqSkill.level
          })
        }
      })
    }

    return strengths.sort((a, b) => b.advantage - a.advantage)
  }

  _calculateDifficultyScore(gaps) {
    if (gaps.length === 0) return 0

    const difficultyWeights = { easy: 1, medium: 2, hard: 3 }
    const totalDifficulty = gaps.reduce((sum, gap) => {
      return sum + (difficultyWeights[gap.difficulty] || 2) * gap.gap
    }, 0)

    return Math.min(10, totalDifficulty / gaps.length)
  }

  _calculatePriorityScore(job, gaps, matchScore) {
    // Higher priority for jobs with higher match but significant gaps
    const gapPenalty = gaps.filter(g => g.priority === 'high').length * 10
    const opportunityScore = Math.max(0, matchScore - gapPenalty)
    
    // Consider job attractiveness factors
    const salaryBonus = job.salary?.max ? Math.min(20, job.salary.max / 100000 * 10) : 0
    const recencyBonus = this._calculateRecencyBonus(job.postedDate)
    
    return Math.min(100, opportunityScore + salaryBonus + recencyBonus)
  }

  async _generateLearningPath(gaps, priorityScore) {
    // Sort gaps by learning efficiency (impact vs time)
    const sortedGaps = gaps.sort((a, b) => {
      const aEfficiency = (a.weight * a.gap) / Math.max(a.estimatedTime, 1)
      const bEfficiency = (b.weight * b.gap) / Math.max(b.estimatedTime, 1)
      return bEfficiency - aEfficiency
    })

    const pathItems = await Promise.all(
      sortedGaps.slice(0, 8).map(async (gap, index) => ({
        order: index + 1,
        skill: gap.skill,
        currentLevel: gap.current,
        targetLevel: gap.required,
        estimatedTime: gap.estimatedTime,
        difficulty: gap.difficulty,
        priority: gap.priority,
        resources: await this._getSkillResources(gap.skill)
      }))
    )

    return pathItems
  }

  _generateGapRecommendations(analysis) {
    const recommendations = []

    // High-priority gaps
    if (analysis.gaps.critical.length > 0) {
      recommendations.push({
        type: 'critical_skills',
        priority: 'high',
        message: `Focus on ${analysis.gaps.critical.length} critical skill gaps`,
        skills: analysis.gaps.critical.slice(0, 3).map(g => g.skill),
        estimatedTime: analysis.gaps.critical.reduce((sum, g) => sum + g.estimatedTime, 0)
      })
    }

    // Learning efficiency
    const quickWins = analysis.gaps.moderate
      .filter(g => g.estimatedTime <= 20) // 20 hours or less
      .slice(0, 3)

    if (quickWins.length > 0) {
      recommendations.push({
        type: 'quick_wins',
        priority: 'medium',
        message: `Quick improvements possible in: ${quickWins.map(g => g.skill).join(', ')}`,
        skills: quickWins.map(g => g.skill)
      })
    }

    // Strengths to leverage
    if (analysis.strengths.length > 0) {
      recommendations.push({
        type: 'leverage_strengths',
        priority: 'medium',
        message: `Highlight your strong skills: ${analysis.strengths.slice(0, 3).map(s => s.skill).join(', ')}`
      })
    }

    return recommendations
  }

  _aggregateSkillDemand(jobs) {
    const skillCounts = {}
    const skillLevels = {}
    const skillWeights = {}

    jobs.forEach(job => {
      const allSkills = [...(job.skills.required || []), ...(job.skills.preferred || [])]
      
      allSkills.forEach(skill => {
        const skillName = skill.name.toLowerCase()
        
        if (!skillCounts[skillName]) {
          skillCounts[skillName] = 0
          skillLevels[skillName] = []
          skillWeights[skillName] = 0
        }
        
        skillCounts[skillName]++
        skillLevels[skillName].push(skill.level)
        skillWeights[skillName] += skill.weight || 1
      })
    })

    // Convert to demand metrics
    const skillDemand = {}
    Object.keys(skillCounts).forEach(skill => {
      skillDemand[skill] = {
        demand: skillCounts[skill] / jobs.length, // 0-1 demand frequency
        averageLevel: skillLevels[skill].reduce((a, b) => a + b, 0) / skillLevels[skill].length,
        importance: skillWeights[skill] / skillCounts[skill]
      }
    })

    return skillDemand
  }

  _analyzeIndustryPosition(userSkills, skillDemand) {
    const gaps = []

    Object.entries(skillDemand).forEach(([skillName, demand]) => {
      const userSkill = userSkills.find(us => 
        us.name.toLowerCase() === skillName
      )

      const current = userSkill?.level || 0
      const required = Math.ceil(demand.averageLevel)
      const gap = Math.max(0, required - current)

      if (gap > 0) {
        gaps.push({
          skill: skillName,
          current,
          required,
          gap,
          marketDemand: demand.demand,
          importance: demand.importance,
          priority: this._calculateIndustryGapPriority(gap, demand),
          estimatedTime: this._estimateSkillLearningTime({ gap, skill: skillName })
        })
      }
    })

    return gaps.sort((a, b) => b.marketDemand * b.importance - a.marketDemand * a.importance)
  }

  _calculateMarketReadiness(userSkills, skillDemand) {
    const topSkills = Object.entries(skillDemand)
      .sort((a, b) => b[1].demand * b[1].importance - a[1].demand * a[1].importance)
      .slice(0, 10)

    let readinessScore = 0
    let totalWeight = 0

    topSkills.forEach(([skillName, demand]) => {
      const userSkill = userSkills.find(us => 
        us.name.toLowerCase() === skillName
      )
      
      const skillScore = userSkill 
        ? Math.min(userSkill.level / demand.averageLevel, 1) * 100
        : 0
      
      const weight = demand.demand * demand.importance
      readinessScore += skillScore * weight
      totalWeight += weight
    })

    return totalWeight > 0 ? Math.round(readinessScore / totalWeight) : 0
  }

  _identifyCompetitiveAdvantage(userSkills, skillDemand) {
    const advantages = []

    userSkills.forEach(userSkill => {
      const demand = skillDemand[userSkill.name.toLowerCase()]
      
      if (demand && userSkill.level > demand.averageLevel) {
        advantages.push({
          skill: userSkill.name,
          userLevel: userSkill.level,
          marketAverage: demand.averageLevel,
          advantage: userSkill.level - demand.averageLevel,
          marketDemand: demand.demand
        })
      }
    })

    return advantages
      .sort((a, b) => b.advantage * b.marketDemand - a.advantage * a.marketDemand)
      .slice(0, 5)
  }

  async _generateIndustryLearningPriorities(gaps, skillDemand) {
    return gaps
      .slice(0, 10)
      .map(gap => ({
        skill: gap.skill,
        priority: gap.priority,
        marketDemand: gap.marketDemand,
        timeToLearn: gap.estimatedTime,
        impact: gap.marketDemand * gap.importance,
        phase: gap.estimatedTime <= 40 ? 'Phase 1 (0-3 months)' : 
               gap.estimatedTime <= 80 ? 'Phase 2 (3-6 months)' : 
               'Phase 3 (6+ months)'
      }))
  }

  _generateCareerRecommendations(analysis) {
    const recommendations = []

    // Readiness assessment
    if (analysis.marketReadiness >= 80) {
      recommendations.push({
        type: 'ready',
        message: 'You\'re well-positioned for this industry. Consider applying to roles now.',
        action: 'Start job searching and networking'
      })
    } else if (analysis.marketReadiness >= 60) {
      recommendations.push({
        type: 'almost_ready',
        message: 'You\'re close to being market-ready. Focus on top skill gaps.',
        action: 'Complete 2-3 critical skills training'
      })
    } else {
      recommendations.push({
        type: 'preparation_needed',
        message: 'Significant preparation needed. Consider a structured learning plan.',
        action: 'Enroll in comprehensive training program'
      })
    }

    // Skill-specific recommendations
    if (analysis.gaps.critical.length > 0) {
      recommendations.push({
        type: 'critical_skills',
        message: `Prioritize learning: ${analysis.gaps.critical.slice(0, 3).map(g => g.skill).join(', ')}`,
        action: 'Focus on high-demand skills first'
      })
    }

    return recommendations
  }

  _estimateSkillLearningTime(gap) {
    // Base time estimates (in hours) - simplified model
    const baseHours = {
      1: 20,  // 1 level improvement
      2: 45,  // 2 levels
      3: 80,  // 3 levels
      4: 120, // 4 levels
      5: 200  // 5 levels (complete beginner)
    }

    const gapSize = Math.min(gap.gap || 1, 5)
    let hours = baseHours[gapSize] || baseHours[5]

    // Adjust based on skill category
    const categoryMultipliers = {
      'technical': 1.2,
      'soft': 0.8,
      'language': 1.5,
      'certification': 0.6
    }

    const multiplier = categoryMultipliers[gap.category] || 1
    return Math.round(hours * multiplier)
  }

  _assessSkillDifficulty(skillName, gap) {
    // This would typically use a more sophisticated model
    // For now, using simple heuristics
    
    const hardSkills = ['machine learning', 'kubernetes', 'system design', 'blockchain']
    const easySkills = ['excel', 'powerpoint', 'basic html', 'email communication']
    
    const skillLower = skillName.toLowerCase()
    
    if (hardSkills.some(hs => skillLower.includes(hs))) {
      return 'hard'
    } else if (easySkills.some(es => skillLower.includes(es))) {
      return 'easy'
    } else if (gap >= 3) {
      return 'hard'
    } else if (gap <= 1) {
      return 'easy'
    }
    
    return 'medium'
  }

  async _getSkillResources(skillName) {
    // This would typically connect to a learning resources database
    // For now, returning mock data
    return [
      {
        type: 'course',
        title: `Complete ${skillName} Course`,
        provider: 'Online Learning Platform',
        duration: '4-6 weeks',
        cost: 'Free/Paid'
      },
      {
        type: 'practice',
        title: `${skillName} Practice Projects`,
        provider: 'Coding Platform',
        duration: 'Ongoing',
        cost: 'Free'
      }
    ]
  }

  _calculateRecencyBonus(postedDate) {
    const daysSincePosted = (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysSincePosted <= 7) return 10
    if (daysSincePosted <= 30) return 5
    if (daysSincePosted <= 90) return 2
    return 0
  }

  _calculateIndustryGapPriority(gap, demand) {
    const priorityScore = gap * demand.demand * demand.importance
    
    if (priorityScore > 2) return 'high'
    if (priorityScore > 1) return 'medium'
    return 'low'
  }

  async _estimateCurrentSalary(userSkills, criteria) {
    // This would typically use salary data APIs or databases
    // For now, returning estimated ranges based on simplified model
    
    const baseSalary = 70000 // Base software developer salary
    const skillBonuses = userSkills.reduce((bonus, skill) => {
      const skillValue = this._getSkillMarketValue(skill.name)
      return bonus + (skillValue * skill.level * 1000)
    }, 0)

    const total = baseSalary + skillBonuses
    
    return {
      min: Math.round(total * 0.8),
      median: Math.round(total),
      max: Math.round(total * 1.3)
    }
  }

  async _estimateProjectedSalary(allSkills, criteria) {
    return this._estimateCurrentSalary(allSkills, criteria)
  }

  _getSkillMarketValue(skillName) {
    // Simplified skill market values
    const values = {
      'react': 8,
      'node.js': 7,
      'python': 6,
      'javascript': 5,
      'machine learning': 12,
      'kubernetes': 10,
      'aws': 9,
      'typescript': 7
    }
    
    return values[skillName.toLowerCase()] || 5
  }

  async _calculateSkillSalaryImpact(skill, criteria) {
    const baseValue = this._getSkillMarketValue(skill.name)
    return {
      annual: baseValue * skill.level * 1000,
      percentage: baseValue * 2
    }
  }

  _calculateSkillROI(skill, impact) {
    const learningCost = 500 // Estimated cost to learn skill
    const annualBenefit = impact.annual
    return {
      months: learningCost / (annualBenefit / 12),
      percentage: (annualBenefit - learningCost) / learningCost * 100
    }
  }

  async _getIndustryBenchmarks(industry, experienceLevel) {
    // Mock industry benchmark data
    return {
      averageSalary: 95000,
      salaryRange: { min: 75000, max: 130000 },
      topSkills: ['React', 'Node.js', 'AWS', 'TypeScript'],
      growthRate: '12% annually'
    }
  }

  _generateSalaryRecommendations(analysis) {
    const recommendations = []

    // High-impact skills
    const highImpactSkills = analysis.skillImpacts
      .filter(si => si.impact.annual > 5000)
      .slice(0, 3)

    if (highImpactSkills.length > 0) {
      recommendations.push({
        type: 'high_impact',
        message: `Focus on high-value skills: ${highImpactSkills.map(s => s.skill).join(', ')}`,
        potentialIncrease: highImpactSkills.reduce((sum, s) => sum + s.impact.annual, 0)
      })
    }

    return recommendations
  }

  // Additional helper methods for learning path generation...
  
  async _createLearningPhases(gaps, timeframe) {
    const phases = []
    const totalTime = timeframe * 4 * 10 // weeks * hours per week
    let currentTime = 0
    let phaseNumber = 1

    const sortedGaps = gaps.sort((a, b) => {
      // Sort by priority and learning efficiency
      const aPriority = a.priority === 'high' ? 3 : a.priority === 'medium' ? 2 : 1
      const bPriority = b.priority === 'high' ? 3 : b.priority === 'medium' ? 2 : 1
      const aEfficiency = aPriority / a.estimatedTime
      const bEfficiency = bPriority / b.estimatedTime
      return bEfficiency - aEfficiency
    })

    let currentPhase = {
      phase: phaseNumber,
      duration: '0-2 months',
      skills: [],
      totalHours: 0,
      focus: 'Foundation'
    }

    for (const gap of sortedGaps) {
      if (currentTime + gap.estimatedTime > totalTime) break

      if (currentPhase.totalHours + gap.estimatedTime > totalTime / 3) {
        phases.push(currentPhase)
        phaseNumber++
        currentPhase = {
          phase: phaseNumber,
          duration: phaseNumber === 2 ? '2-4 months' : '4-6 months',
          skills: [],
          totalHours: 0,
          focus: phaseNumber === 2 ? 'Intermediate' : 'Advanced'
        }
      }

      currentPhase.skills.push({
        name: gap.skill,
        targetLevel: gap.required,
        estimatedHours: gap.estimatedTime,
        priority: gap.priority
      })
      currentPhase.totalHours += gap.estimatedTime
      currentTime += gap.estimatedTime
    }

    if (currentPhase.skills.length > 0) {
      phases.push(currentPhase)
    }

    return phases
  }

  _createMilestones(phases) {
    const milestones = []
    
    phases.forEach((phase, index) => {
      milestones.push({
        milestone: `Phase ${phase.phase} Completion`,
        timeline: phase.duration,
        criteria: `Complete ${phase.skills.length} skills`,
        skills: phase.skills.map(s => s.name)
      })
    })

    return milestones
  }

  async _recommendLearningResources(gaps) {
    const resources = []
    
    for (const gap of gaps.slice(0, 5)) {
      const skillResources = await this._getSkillResources(gap.skill)
      resources.push({
        skill: gap.skill,
        resources: skillResources
      })
    }

    return resources
  }

  _calculateTotalLearningHours(phases) {
    return phases.reduce((total, phase) => total + phase.totalHours, 0)
  }

  _defineSuccessMetrics(job, gaps) {
    return [
      {
        metric: 'Skill Gap Reduction',
        target: `Close ${Math.min(gaps.length, 5)} critical gaps`,
        measurement: 'Skills assessment scores'
      },
      {
        metric: 'Job Match Score',
        target: 'Achieve 80%+ match score',
        measurement: 'Automated job matching algorithm'
      },
      {
        metric: 'Application Readiness',
        target: 'Ready to apply for target role',
        measurement: 'Portfolio and resume review'
      }
    ]
  }
}

export const gapAnalysisService = new GapAnalysisService()