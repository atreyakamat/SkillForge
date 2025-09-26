import Job from '../models/Job.js'
import User from '../models/User.js'
import { jobMatchingService } from '../services/jobMatching.js'
import { gapAnalysisService } from '../services/gapAnalysis.js'
import { validationResult } from 'express-validator'

// GET /api/jobs/matches/:userId - Get matching jobs for a user
export const getJobMatches = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { 
      limit = 20, 
      offset = 0, 
      minMatchScore = 0,
      industry,
      experienceLevel,
      location,
      remote,
      salaryMin,
      salaryMax
    } = req.query

    // Get user's skills
    const user = await User.findById(userId).select('skills')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Use job matching service to find and score jobs
    const matchResults = await jobMatchingService.findMatches(user.skills, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      minMatchScore: parseInt(minMatchScore),
      filters: {
        industry,
        experienceLevel,
        location,
        remote: remote === 'true',
        salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
        salaryMax: salaryMax ? parseInt(salaryMax) : undefined
      }
    })

    res.json({
      success: true,
      data: {
        jobs: matchResults.jobs,
        totalCount: matchResults.totalCount,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: matchResults.hasMore
        },
        filters: {
          industry,
          experienceLevel,
          location,
          remote,
          salaryMin,
          salaryMax,
          minMatchScore
        }
      }
    })

  } catch (error) {
    next(error)
  }
}

// GET /api/analytics/gaps/:userId - Get detailed gap analysis
export const getGapAnalysis = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { jobId, industry, experienceLevel } = req.query

    // Get user's skills
    const user = await User.findById(userId).select('skills')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    let gapAnalysis

    if (jobId) {
      // Analyze gaps for a specific job
      const job = await Job.findById(jobId)
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        })
      }
      gapAnalysis = await gapAnalysisService.analyzeJobGaps(user.skills, job)
    } else {
      // Analyze gaps for industry/experience level
      gapAnalysis = await gapAnalysisService.analyzeIndustryGaps(user.skills, {
        industry,
        experienceLevel
      })
    }

    res.json({
      success: true,
      data: gapAnalysis
    })

  } catch (error) {
    next(error)
  }
}

// GET /api/analytics/learning-path/:userId - Get personalized learning path
export const getLearningPath = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { targetJobId, targetIndustry, targetLevel, timeframe = '6' } = req.query

    // Get user's skills and assessment history
    const user = await User.findById(userId).select('skills')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    let learningPath

    if (targetJobId) {
      // Generate learning path for a specific job
      const job = await Job.findById(targetJobId)
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Target job not found'
        })
      }
      learningPath = await gapAnalysisService.generateJobLearningPath(
        user.skills, 
        job, 
        parseInt(timeframe)
      )
    } else {
      // Generate learning path for industry/level
      learningPath = await gapAnalysisService.generateIndustryLearningPath(
        user.skills,
        {
          industry: targetIndustry,
          level: targetLevel,
          timeframe: parseInt(timeframe)
        }
      )
    }

    res.json({
      success: true,
      data: learningPath
    })

  } catch (error) {
    next(error)
  }
}

// GET /api/jobs/search - Search jobs by criteria
export const searchJobs = async (req, res, next) => {
  try {
    const {
      q, // search query
      skills,
      industry,
      experienceLevel,
      location,
      remote,
      salaryMin,
      salaryMax,
      employmentType,
      company,
      postedSince, // days
      limit = 20,
      offset = 0,
      sortBy = 'relevance' // relevance, date, salary
    } = req.query

    // Build search query
    let searchQuery = { 'application.status': 'active' }

    // Text search
    if (q) {
      searchQuery.$text = { $search: q }
    }

    // Skills filter
    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : skills.split(',')
      searchQuery.$or = [
        { 'skills.required.name': { $in: skillArray } },
        { 'skills.preferred.name': { $in: skillArray } }
      ]
    }

    // Industry filter
    if (industry) {
      searchQuery['company.industry'] = industry
    }

    // Experience level filter
    if (experienceLevel) {
      searchQuery.experienceLevel = experienceLevel
    }

    // Location filters
    if (location && location !== 'remote') {
      searchQuery['location.city'] = new RegExp(location, 'i')
    }
    if (remote === 'true') {
      searchQuery['location.remote'] = true
    }

    // Salary filters
    if (salaryMin || salaryMax) {
      searchQuery['salary.min'] = {}
      if (salaryMin) searchQuery['salary.min'].$gte = parseInt(salaryMin)
      if (salaryMax) searchQuery['salary.max'] = { $lte: parseInt(salaryMax) }
    }

    // Employment type filter
    if (employmentType) {
      searchQuery.employmentType = employmentType
    }

    // Company filter
    if (company) {
      searchQuery['company.name'] = new RegExp(company, 'i')
    }

    // Posted since filter
    if (postedSince) {
      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - parseInt(postedSince))
      searchQuery.postedDate = { $gte: daysAgo }
    }

    // Build sort criteria
    let sortCriteria = {}
    switch (sortBy) {
      case 'date':
        sortCriteria = { postedDate: -1 }
        break
      case 'salary':
        sortCriteria = { 'salary.max': -1, 'salary.min': -1 }
        break
      case 'relevance':
      default:
        if (q) {
          sortCriteria = { score: { $meta: 'textScore' } }
        } else {
          sortCriteria = { postedDate: -1 }
        }
        break
    }

    // Execute search with pagination
    const jobs = await Job.find(searchQuery)
      .sort(sortCriteria)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .populate('postedBy', 'name email')

    // Get total count
    const totalCount = await Job.countDocuments(searchQuery)

    // If user is authenticated, calculate match scores
    let jobsWithScores = jobs
    if (req.user && req.user.skills) {
      jobsWithScores = jobs.map(job => {
        const matchScore = job.calculateMatchScore(req.user.skills)
        return {
          ...job.toObject(),
          matchScore
        }
      })
      
      // Sort by match score if relevance and no text search
      if (sortBy === 'relevance' && !q) {
        jobsWithScores.sort((a, b) => b.matchScore - a.matchScore)
      }
    }

    res.json({
      success: true,
      data: {
        jobs: jobsWithScores,
        totalCount,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < totalCount
        },
        filters: {
          q, skills, industry, experienceLevel, location, remote,
          salaryMin, salaryMax, employmentType, company, postedSince, sortBy
        }
      }
    })

  } catch (error) {
    next(error)
  }
}

// POST /api/jobs/save - Bookmark/save a job
export const saveJob = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      })
    }

    const { jobId, notes } = req.body
    const userId = req.user.id

    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if job is already saved
    const existingSave = user.savedJobs?.find(save => 
      save.jobId.toString() === jobId
    )

    if (existingSave) {
      // Update existing save
      existingSave.notes = notes || existingSave.notes
      existingSave.updatedAt = new Date()
    } else {
      // Add new save
      if (!user.savedJobs) user.savedJobs = []
      user.savedJobs.push({
        jobId,
        notes,
        savedAt: new Date(),
        updatedAt: new Date()
      })
    }

    await user.save()

    // Increment job views
    await job.incrementViews()

    res.json({
      success: true,
      message: existingSave ? 'Job updated in saved list' : 'Job saved successfully',
      data: {
        jobId,
        savedAt: existingSave ? existingSave.savedAt : new Date(),
        notes: notes || existingSave?.notes
      }
    })

  } catch (error) {
    next(error)
  }
}

// DELETE /api/jobs/save/:jobId - Remove bookmarked job
export const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params
    const userId = req.user.id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Remove job from saved list
    if (user.savedJobs) {
      user.savedJobs = user.savedJobs.filter(save => 
        save.jobId.toString() !== jobId
      )
      await user.save()
    }

    res.json({
      success: true,
      message: 'Job removed from saved list'
    })

  } catch (error) {
    next(error)
  }
}

// GET /api/jobs/saved - Get user's saved jobs
export const getSavedJobs = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { limit = 20, offset = 0 } = req.query

    const user = await User.findById(userId)
      .populate({
        path: 'savedJobs.jobId',
        model: 'Job',
        match: { 'application.status': 'active' }
      })
      .select('savedJobs')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Filter out jobs that no longer exist or are inactive
    const validSavedJobs = user.savedJobs?.filter(save => save.jobId) || []

    // Apply pagination
    const paginatedJobs = validSavedJobs
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
      .map(save => ({
        ...save.jobId.toObject(),
        savedAt: save.savedAt,
        notes: save.notes,
        matchScore: save.jobId.calculateMatchScore(req.user.skills)
      }))

    res.json({
      success: true,
      data: {
        jobs: paginatedJobs,
        totalCount: validSavedJobs.length,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < validSavedJobs.length
        }
      }
    })

  } catch (error) {
    next(error)
  }
}

// GET /api/jobs/:jobId - Get job details
export const getJobDetails = async (req, res, next) => {
  try {
    const { jobId } = req.params

    const job = await Job.findById(jobId).populate('postedBy', 'name email')
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Increment views
    await job.incrementViews()

    // Calculate match score if user is authenticated
    let jobWithScore = job.toObject()
    if (req.user && req.user.skills) {
      jobWithScore.matchScore = job.calculateMatchScore(req.user.skills)
      jobWithScore.skillGaps = job.getSkillGaps(req.user.skills)
    }

    // Get similar jobs
    const similarJobs = await Job.findSimilar(jobId, 5)
    
    res.json({
      success: true,
      data: {
        job: jobWithScore,
        similarJobs: similarJobs.map(sJob => ({
          ...sJob.toObject(),
          matchScore: req.user ? sJob.calculateMatchScore(req.user.skills) : null
        }))
      }
    })

  } catch (error) {
    next(error)
  }
}

// GET /api/jobs/analytics/industry/:industry - Get industry job analytics
export const getIndustryAnalytics = async (req, res, next) => {
  try {
    const { industry } = req.params

    // Get job count by experience level
    const experienceLevelCounts = await Job.aggregate([
      { $match: { 'company.industry': industry, 'application.status': 'active' } },
      { $group: { _id: '$experienceLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // Get top skills in demand
    const topSkills = await Job.aggregate([
      { $match: { 'company.industry': industry, 'application.status': 'active' } },
      { $unwind: '$skills.required' },
      { $group: { 
        _id: '$skills.required.name', 
        count: { $sum: 1 },
        avgLevel: { $avg: '$skills.required.level' }
      }},
      { $sort: { count: -1 } },
      { $limit: 20 }
    ])

    // Get salary ranges by experience level
    const salaryRanges = await Job.aggregate([
      { 
        $match: { 
          'company.industry': industry, 
          'application.status': 'active',
          'salary.min': { $exists: true },
          'salary.max': { $exists: true }
        } 
      },
      { 
        $group: { 
          _id: '$experienceLevel',
          avgMin: { $avg: '$salary.min' },
          avgMax: { $avg: '$salary.max' },
          minSalary: { $min: '$salary.min' },
          maxSalary: { $max: '$salary.max' },
          count: { $sum: 1 }
        } 
      },
      { $sort: { avgMax: -1 } }
    ])

    // Get location distribution
    const locationCounts = await Job.aggregate([
      { $match: { 'company.industry': industry, 'application.status': 'active' } },
      { 
        $group: { 
          _id: {
            city: '$location.city',
            remote: '$location.remote'
          },
          count: { $sum: 1 }
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])

    res.json({
      success: true,
      data: {
        industry,
        experienceLevels: experienceLevelCounts,
        topSkills,
        salaryRanges,
        locations: locationCounts,
        generatedAt: new Date()
      }
    })

  } catch (error) {
    next(error)
  }
}

// POST /api/jobs/apply - Track job application
export const trackJobApplication = async (req, res, next) => {
  try {
    const { jobId, applicationDate, notes } = req.body
    const userId = req.user.id

    // Find the job and increment applications
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Update user's application tracking
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Add to applications array
    if (!user.jobApplications) user.jobApplications = []
    
    // Check if already applied
    const existingApplication = user.jobApplications.find(app => 
      app.jobId.toString() === jobId
    )

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Application already tracked for this job'
      })
    }

    user.jobApplications.push({
      jobId,
      appliedAt: applicationDate ? new Date(applicationDate) : new Date(),
      status: 'applied',
      notes
    })

    await user.save()
    await job.incrementApplications()

    res.json({
      success: true,
      message: 'Job application tracked successfully',
      data: {
        jobId,
        appliedAt: applicationDate ? new Date(applicationDate) : new Date(),
        status: 'applied'
      }
    })

  } catch (error) {
    next(error)
  }
}