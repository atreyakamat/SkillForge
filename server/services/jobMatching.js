import Job from '../models/Job.js'
import User from '../models/User.js'

/**
 * Job Matching Service
 * Implements intelligent job matching algorithms based on skill fit percentage
 */
class JobMatchingService {
  
  /**
   * Find matching jobs for a user based on their skills
   * @param {Array} userSkills - User's skills with levels
   * @param {Object} options - Search and filter options
   * @returns {Object} Matching jobs with scores
   */
  async findMatches(userSkills, options = {}) {
    const {
      limit = 20,
      offset = 0,
      minMatchScore = 0,
      filters = {}
    } = options

    try {
      // Build base query
      let query = this._buildBaseQuery(filters)
      
      // Get jobs that match basic criteria
      const jobs = await Job.find(query)
        .sort({ postedDate: -1 })
        .limit(limit * 3) // Get more than needed for scoring
        .populate('postedBy', 'name email')

      // Calculate match scores and filter
      const jobsWithScores = jobs
        .map(job => this._calculateJobMatch(job, userSkills))
        .filter(jobMatch => jobMatch.matchScore >= minMatchScore)
        .sort((a, b) => b.matchScore - a.matchScore)

      // Apply pagination to scored results
      const paginatedJobs = jobsWithScores.slice(offset, offset + limit)

      // Get total count for pagination
      const totalMatches = await this._getTotalMatchCount(userSkills, filters, minMatchScore)

      return {
        jobs: paginatedJobs,
        totalCount: totalMatches,
        hasMore: offset + limit < totalMatches,
        averageMatchScore: this._calculateAverageScore(jobsWithScores),
        matchDistribution: this._getMatchDistribution(jobsWithScores)
      }

    } catch (error) {
      console.error('Error in findMatches:', error)
      throw new Error('Failed to find job matches')
    }
  }

  /**
   * Find jobs similar to a given job
   * @param {String} jobId - Target job ID
   * @param {Array} userSkills - User's skills for scoring
   * @param {Number} limit - Number of similar jobs to return
   * @returns {Array} Similar jobs with match scores
   */
  async findSimilarJobs(jobId, userSkills, limit = 5) {
    try {
      const targetJob = await Job.findById(jobId)
      if (!targetJob) {
        throw new Error('Target job not found')
      }

      // Extract skills and company info from target job
      const targetSkills = [
        ...(targetJob.skills.required || []),
        ...(targetJob.skills.preferred || [])
      ].map(s => s.name)

      // Find jobs with similar skills and industry
      const similarJobs = await Job.find({
        _id: { $ne: jobId },
        'application.status': 'active',
        $or: [
          { 'skills.required.name': { $in: targetSkills } },
          { 'skills.preferred.name': { $in: targetSkills } },
          { 'company.industry': targetJob.company.industry }
        ]
      })
      .limit(limit * 2)
      .sort({ postedDate: -1 })

      // Calculate similarity scores
      const jobsWithSimilarity = similarJobs.map(job => {
        const similarityScore = this._calculateSimilarityScore(targetJob, job)
        const matchScore = userSkills ? job.calculateMatchScore(userSkills) : 0
        
        return {
          ...job.toObject(),
          similarityScore,
          matchScore,
          combinedScore: (similarityScore * 0.6) + (matchScore * 0.4)
        }
      })

      return jobsWithSimilarity
        .sort((a, b) => b.combinedScore - a.combinedScore)
        .slice(0, limit)

    } catch (error) {
      console.error('Error in findSimilarJobs:', error)
      throw new Error('Failed to find similar jobs')
    }
  }

  /**
   * Get personalized job recommendations based on user's profile and activity
   * @param {String} userId - User ID
   * @param {Object} options - Recommendation options
   * @returns {Array} Recommended jobs
   */
  async getPersonalizedRecommendations(userId, options = {}) {
    const { limit = 10, diversify = true } = options

    try {
      // This would typically involve more complex ML algorithms
      // For now, implementing a rule-based recommendation system
      
      const user = await User.findById(userId).select('skills savedJobs jobApplications')
      if (!user) {
        throw new Error('User not found')
      }

      // Get user's skill profile
      const userSkills = user.skills || []
      const skillNames = userSkills.map(s => s.name)
      
      // Get industries from saved/applied jobs
      const jobIds = [
        ...(user.savedJobs || []).map(s => s.jobId),
        ...(user.jobApplications || []).map(a => a.jobId)
      ]
      
      const userJobHistory = await Job.find({ _id: { $in: jobIds } })
        .select('company.industry experienceLevel')
      
      const preferredIndustries = [...new Set(
        userJobHistory.map(j => j.company.industry).filter(Boolean)
      )]
      
      const preferredLevels = [...new Set(
        userJobHistory.map(j => j.experienceLevel).filter(Boolean)
      )]

      // Build recommendation query
      let query = {
        'application.status': 'active',
        _id: { $nin: jobIds } // Exclude already saved/applied jobs
      }

      // Prefer jobs with matching skills or industries
      if (skillNames.length > 0 || preferredIndustries.length > 0) {
        query.$or = []
        
        if (skillNames.length > 0) {
          query.$or.push(
            { 'skills.required.name': { $in: skillNames } },
            { 'skills.preferred.name': { $in: skillNames } }
          )
        }
        
        if (preferredIndustries.length > 0) {
          query.$or.push({ 'company.industry': { $in: preferredIndustries } })
        }
      }

      // Get candidate jobs
      let candidateJobs = await Job.find(query)
        .limit(limit * 3)
        .sort({ postedDate: -1 })

      // Score and rank jobs
      const scoredJobs = candidateJobs.map(job => {
        const matchScore = job.calculateMatchScore(userSkills)
        const industryBonus = preferredIndustries.includes(job.company.industry) ? 10 : 0
        const levelBonus = preferredLevels.includes(job.experienceLevel) ? 5 : 0
        const recencyBonus = this._calculateRecencyBonus(job.postedDate)
        
        return {
          ...job.toObject(),
          matchScore,
          recommendationScore: matchScore + industryBonus + levelBonus + recencyBonus,
          reasons: this._getRecommendationReasons(job, userSkills, preferredIndustries)
        }
      })

      // Sort by recommendation score
      scoredJobs.sort((a, b) => b.recommendationScore - a.recommendationScore)

      // Apply diversification if requested
      if (diversify) {
        return this._diversifyRecommendations(scoredJobs, limit)
      }

      return scoredJobs.slice(0, limit)

    } catch (error) {
      console.error('Error in getPersonalizedRecommendations:', error)
      throw new Error('Failed to get personalized recommendations')
    }
  }

  /**
   * Calculate advanced job matching metrics
   * @param {Object} job - Job object
   * @param {Array} userSkills - User's skills
   * @returns {Object} Detailed match analysis
   */
  calculateAdvancedMatch(job, userSkills) {
    const analysis = {
      overallScore: 0,
      skillMatch: {
        required: { matched: 0, total: 0, percentage: 0, gaps: [] },
        preferred: { matched: 0, total: 0, percentage: 0, gaps: [] }
      },
      salaryFit: null,
      experienceFit: null,
      locationFit: null,
      recommendations: []
    }

    try {
      // Skill matching analysis
      if (job.skills.required) {
        analysis.skillMatch.required = this._analyzeSkillMatch(
          job.skills.required, 
          userSkills, 
          'required'
        )
      }

      if (job.skills.preferred) {
        analysis.skillMatch.preferred = this._analyzeSkillMatch(
          job.skills.preferred, 
          userSkills, 
          'preferred'
        )
      }

      // Calculate overall skill score
      const requiredWeight = 0.8
      const preferredWeight = 0.2
      
      const skillScore = (
        (analysis.skillMatch.required.percentage * requiredWeight) +
        (analysis.skillMatch.preferred.percentage * preferredWeight)
      )

      analysis.overallScore = Math.round(skillScore)

      // Generate recommendations
      analysis.recommendations = this._generateMatchRecommendations(analysis, job)

      return analysis

    } catch (error) {
      console.error('Error in calculateAdvancedMatch:', error)
      return analysis
    }
  }

  // Private helper methods

  _buildBaseQuery(filters) {
    let query = { 'application.status': 'active' }

    if (filters.industry) {
      query['company.industry'] = filters.industry
    }

    if (filters.experienceLevel) {
      query.experienceLevel = filters.experienceLevel
    }

    if (filters.location) {
      if (filters.location === 'remote' || filters.remote) {
        query['location.remote'] = true
      } else {
        query['location.city'] = new RegExp(filters.location, 'i')
      }
    }

    if (filters.salaryMin || filters.salaryMax) {
      query.salary = {}
      if (filters.salaryMin) {
        query['salary.min'] = { $gte: filters.salaryMin }
      }
      if (filters.salaryMax) {
        query['salary.max'] = { $lte: filters.salaryMax }
      }
    }

    if (filters.employmentType) {
      query.employmentType = filters.employmentType
    }

    return query
  }

  _calculateJobMatch(job, userSkills) {
    const matchScore = job.calculateMatchScore(userSkills)
    const skillGaps = job.getSkillGaps(userSkills)
    
    return {
      ...job.toObject(),
      matchScore,
      skillGaps,
      matchDetails: {
        strongMatches: this._getStrongMatches(job, userSkills),
        missingSkills: skillGaps.filter(gap => gap.type === 'missing'),
        improvementAreas: skillGaps.filter(gap => gap.type === 'insufficient')
      }
    }
  }

  _getStrongMatches(job, userSkills) {
    const matches = []
    
    if (job.skills.required) {
      job.skills.required.forEach(requiredSkill => {
        const userSkill = userSkills.find(us => 
          us.name.toLowerCase() === requiredSkill.name.toLowerCase()
        )
        
        if (userSkill && userSkill.level >= requiredSkill.level) {
          matches.push({
            skill: requiredSkill.name,
            userLevel: userSkill.level,
            requiredLevel: requiredSkill.level,
            strength: 'strong'
          })
        }
      })
    }

    return matches
  }

  _calculateSimilarityScore(job1, job2) {
    let score = 0
    
    // Industry match
    if (job1.company.industry === job2.company.industry) {
      score += 30
    }

    // Experience level match
    if (job1.experienceLevel === job2.experienceLevel) {
      score += 20
    }

    // Skill overlap
    const job1Skills = [...(job1.skills.required || []), ...(job1.skills.preferred || [])]
      .map(s => s.name.toLowerCase())
    const job2Skills = [...(job2.skills.required || []), ...(job2.skills.preferred || [])]
      .map(s => s.name.toLowerCase())
    
    const overlap = job1Skills.filter(skill => job2Skills.includes(skill))
    const skillSimilarity = overlap.length / Math.max(job1Skills.length, job2Skills.length, 1)
    score += skillSimilarity * 50

    return Math.min(score, 100)
  }

  async _getTotalMatchCount(userSkills, filters, minMatchScore) {
    // This is a simplified implementation
    // In a production environment, you might want to implement more efficient counting
    const query = this._buildBaseQuery(filters)
    const allJobs = await Job.find(query).select('skills')
    
    return allJobs.filter(job => 
      job.calculateMatchScore(userSkills) >= minMatchScore
    ).length
  }

  _calculateAverageScore(jobsWithScores) {
    if (jobsWithScores.length === 0) return 0
    
    const total = jobsWithScores.reduce((sum, job) => sum + job.matchScore, 0)
    return Math.round(total / jobsWithScores.length)
  }

  _getMatchDistribution(jobsWithScores) {
    const distribution = {
      excellent: 0,  // 80-100%
      good: 0,       // 60-79%
      fair: 0,       // 40-59%
      poor: 0        // 0-39%
    }

    jobsWithScores.forEach(job => {
      if (job.matchScore >= 80) distribution.excellent++
      else if (job.matchScore >= 60) distribution.good++
      else if (job.matchScore >= 40) distribution.fair++
      else distribution.poor++
    })

    return distribution
  }

  _calculateRecencyBonus(postedDate) {
    const daysSincePosted = (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysSincePosted <= 7) return 10      // Very recent
    if (daysSincePosted <= 30) return 5      // Recent
    if (daysSincePosted <= 90) return 2      // Somewhat recent
    return 0                                 // Old
  }

  _getRecommendationReasons(job, userSkills, preferredIndustries) {
    const reasons = []

    // Skill match reasons
    const matchingSkills = []
    if (job.skills.required) {
      job.skills.required.forEach(skill => {
        const userSkill = userSkills.find(us => 
          us.name.toLowerCase() === skill.name.toLowerCase()
        )
        if (userSkill) {
          matchingSkills.push(skill.name)
        }
      })
    }

    if (matchingSkills.length > 0) {
      reasons.push(`Matches your skills: ${matchingSkills.slice(0, 3).join(', ')}`)
    }

    // Industry match
    if (preferredIndustries.includes(job.company.industry)) {
      reasons.push(`Industry you've shown interest in: ${job.company.industry}`)
    }

    // Recent posting
    const daysSincePosted = (Date.now() - job.postedDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSincePosted <= 7) {
      reasons.push('Recently posted')
    }

    return reasons
  }

  _diversifyRecommendations(scoredJobs, limit) {
    const diversified = []
    const usedIndustries = new Set()
    const usedCompanies = new Set()

    // First pass: Take highest scoring jobs from different industries/companies
    for (const job of scoredJobs) {
      if (diversified.length >= limit) break

      const industry = job.company.industry
      const company = job.company.name

      if (!usedIndustries.has(industry) || !usedCompanies.has(company)) {
        diversified.push(job)
        usedIndustries.add(industry)
        usedCompanies.add(company)
      }
    }

    // Second pass: Fill remaining slots with highest scoring jobs
    for (const job of scoredJobs) {
      if (diversified.length >= limit) break
      if (!diversified.find(d => d._id.toString() === job._id.toString())) {
        diversified.push(job)
      }
    }

    return diversified.slice(0, limit)
  }

  _analyzeSkillMatch(requiredSkills, userSkills, type) {
    const analysis = {
      matched: 0,
      total: requiredSkills.length,
      percentage: 0,
      gaps: []
    }

    requiredSkills.forEach(reqSkill => {
      const userSkill = userSkills.find(us => 
        us.name.toLowerCase() === reqSkill.name.toLowerCase()
      )

      if (userSkill) {
        if (userSkill.level >= reqSkill.level) {
          analysis.matched++
        } else {
          analysis.gaps.push({
            skill: reqSkill.name,
            required: reqSkill.level,
            current: userSkill.level,
            gap: reqSkill.level - userSkill.level
          })
        }
      } else {
        analysis.gaps.push({
          skill: reqSkill.name,
          required: reqSkill.level,
          current: 0,
          gap: reqSkill.level
        })
      }
    })

    analysis.percentage = analysis.total > 0 
      ? Math.round((analysis.matched / analysis.total) * 100)
      : 0

    return analysis
  }

  _generateMatchRecommendations(analysis, job) {
    const recommendations = []

    // Skills to improve
    const highPriorityGaps = analysis.skillMatch.required.gaps
      .filter(gap => gap.gap >= 2)
      .slice(0, 3)

    if (highPriorityGaps.length > 0) {
      recommendations.push({
        type: 'skill_development',
        priority: 'high',
        message: `Consider improving: ${highPriorityGaps.map(g => g.skill).join(', ')}`,
        skills: highPriorityGaps
      })
    }

    // Strong matches to highlight
    if (analysis.skillMatch.required.matched > 0) {
      recommendations.push({
        type: 'strength',
        priority: 'medium',
        message: `Strong match - you meet ${analysis.skillMatch.required.matched} of ${analysis.skillMatch.required.total} required skills`
      })
    }

    return recommendations
  }
}

// Legacy functions for backward compatibility
export function computeJobFit(userSkills = {}, job) {
  const weights = { critical: 2, preferred: 1 }
  const reqs = job.requiredSkills || []
  let achieved = 0
  let total = 0
  let missingCritical = 0
  for (const req of reqs) {
    const w = weights[req.importance] || 1
    total += (req.level * w)
    const userLevel = Number(userSkills[req.name] ?? 0)
    achieved += Math.min(userLevel, req.level) * w
    if (userLevel <= 0 && req.importance === 'critical') missingCritical++
  }
  const base = total > 0 ? (achieved / total) : 0
  const penalty = Math.min(0.3, missingCritical * 0.1)
  const fit = Math.max(0, base - penalty)
  return { fitScore: Number((fit * 100).toFixed(1)), missingCritical }
}

export function rankJobs(userSkills, jobs = []) {
  return jobs.map(job => ({
    job,
    ...computeJobFit(userSkills, job)
  })).sort((a,b)=> b.fitScore - a.fitScore)
}

export const jobMatchingService = new JobMatchingService()

