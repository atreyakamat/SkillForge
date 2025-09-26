import express from 'express'
import { body, param, query } from 'express-validator'
import { 
  getJobMatches,
  getGapAnalysis,
  getLearningPath,
  searchJobs,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getJobDetails,
  getIndustryAnalytics,
  trackJobApplication
} from '../controllers/jobController.js'
import { requireAuth as auth } from '../middleware/auth.js'
import { authLimiter as rateLimit } from '../middleware/rateLimit.js'
// Legacy imports for backwards compatibility
import { requireAuth } from '../middleware/auth.js'
import { seedJobs, getAllJobs } from '../controllers/jobs.controller.js'

const router = express.Router()

// Legacy routes for backwards compatibility
router.post('/seed', requireAuth, seedJobs)
router.get('/legacy', getAllJobs)

// Rate limiting for job-related endpoints
const jobSearchLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many job search requests, please try again later'
})

const jobActionLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 actions per window
  message: 'Too many job actions, please try again later'
})

// Job Matching Routes

/**
 * GET /api/jobs/matches/:userId
 * Get matching jobs for a user based on their skills
 */
router.get('/matches/:userId', 
  jobSearchLimit,
  [
    param('userId').isMongoId().withMessage('Invalid user ID'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
    query('minMatchScore').optional().isInt({ min: 0, max: 100 }).withMessage('Match score must be between 0 and 100'),
    query('salaryMin').optional().isInt({ min: 0 }).withMessage('Minimum salary must be positive'),
    query('salaryMax').optional().isInt({ min: 0 }).withMessage('Maximum salary must be positive')
  ],
  getJobMatches
)

/**
 * GET /api/jobs/analytics/gaps/:userId
 * Get detailed skill gap analysis for a user
 */
router.get('/analytics/gaps/:userId',
  auth, // Require authentication for detailed analytics
  [
    param('userId').isMongoId().withMessage('Invalid user ID'),
    query('jobId').optional().isMongoId().withMessage('Invalid job ID'),
    query('industry').optional().isString().withMessage('Industry must be a string'),
    query('experienceLevel').optional().isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'])
      .withMessage('Invalid experience level')
  ],
  getGapAnalysis
)

/**
 * GET /api/jobs/analytics/learning-path/:userId
 * Get personalized learning path for a user
 */
router.get('/analytics/learning-path/:userId',
  auth,
  [
    param('userId').isMongoId().withMessage('Invalid user ID'),
    query('targetJobId').optional().isMongoId().withMessage('Invalid target job ID'),
    query('targetIndustry').optional().isString().withMessage('Target industry must be a string'),
    query('targetLevel').optional().isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'])
      .withMessage('Invalid target level'),
    query('timeframe').optional().isInt({ min: 1, max: 24 }).withMessage('Timeframe must be between 1 and 24 months')
  ],
  getLearningPath
)

// Job Search Routes

/**
 * GET /api/jobs/search
 * Search jobs by various criteria
 */
router.get('/search',
  jobSearchLimit,
  [
    query('q').optional().isString().withMessage('Search query must be a string'),
    query('skills').optional().isString().withMessage('Skills must be a string'),
    query('industry').optional().isString().withMessage('Industry must be a string'),
    query('experienceLevel').optional().isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'])
      .withMessage('Invalid experience level'),
    query('location').optional().isString().withMessage('Location must be a string'),
    query('remote').optional().isBoolean().withMessage('Remote must be a boolean'),
    query('salaryMin').optional().isInt({ min: 0 }).withMessage('Minimum salary must be positive'),
    query('salaryMax').optional().isInt({ min: 0 }).withMessage('Maximum salary must be positive'),
    query('employmentType').optional().isIn(['full-time', 'part-time', 'contract', 'internship', 'temporary'])
      .withMessage('Invalid employment type'),
    query('company').optional().isString().withMessage('Company must be a string'),
    query('postedSince').optional().isInt({ min: 1, max: 365 }).withMessage('Posted since must be between 1 and 365 days'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
    query('sortBy').optional().isIn(['relevance', 'date', 'salary']).withMessage('Invalid sort option')
  ],
  searchJobs
)

/**
 * GET /api/jobs/:jobId
 * Get detailed job information
 */
router.get('/:jobId',
  [
    param('jobId').isMongoId().withMessage('Invalid job ID')
  ],
  getJobDetails
)

// Job Bookmarking Routes

/**
 * POST /api/jobs/save
 * Save/bookmark a job
 */
router.post('/save',
  auth,
  jobActionLimit,
  [
    body('jobId').isMongoId().withMessage('Invalid job ID'),
    body('notes').optional().isString().trim().isLength({ max: 500 })
      .withMessage('Notes must be a string with maximum 500 characters')
  ],
  saveJob
)

/**
 * DELETE /api/jobs/save/:jobId
 * Remove a bookmarked job
 */
router.delete('/save/:jobId',
  auth,
  jobActionLimit,
  [
    param('jobId').isMongoId().withMessage('Invalid job ID')
  ],
  unsaveJob
)

/**
 * GET /api/jobs/saved
 * Get user's saved jobs
 */
router.get('/saved',
  auth,
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
  ],
  getSavedJobs
)

// Job Application Tracking Routes

/**
 * POST /api/jobs/apply
 * Track a job application
 */
router.post('/apply',
  auth,
  jobActionLimit,
  [
    body('jobId').isMongoId().withMessage('Invalid job ID'),
    body('applicationDate').optional().isISO8601().withMessage('Application date must be a valid date'),
    body('notes').optional().isString().trim().isLength({ max: 500 })
      .withMessage('Notes must be a string with maximum 500 characters')
  ],
  trackJobApplication
)

// Industry Analytics Routes

/**
 * GET /api/jobs/analytics/industry/:industry
 * Get job market analytics for a specific industry
 */
router.get('/analytics/industry/:industry',
  jobSearchLimit,
  [
    param('industry').isString().notEmpty().withMessage('Industry is required')
  ],
  getIndustryAnalytics
)

// Advanced Job Matching Routes

/**
 * POST /api/jobs/matches/advanced
 * Get advanced job matches with detailed analysis
 */
router.post('/matches/advanced',
  auth,
  jobSearchLimit,
  [
    body('skills').isArray().withMessage('Skills must be an array'),
    body('skills.*.name').isString().notEmpty().withMessage('Skill name is required'),
    body('skills.*.level').isInt({ min: 1, max: 5 }).withMessage('Skill level must be between 1 and 5'),
    body('preferences').optional().isObject().withMessage('Preferences must be an object')
  ],
  async (req, res, next) => {
    try {
      const { skills, preferences = {} } = req.body
      const userId = req.user.id

      // Import the job matching service
      const { jobMatchingService } = await import('../services/jobMatching.js')

      // Get advanced matches
      const matches = await jobMatchingService.findMatches(skills, {
        limit: preferences.limit || 20,
        offset: preferences.offset || 0,
        minMatchScore: preferences.minMatchScore || 0,
        filters: {
          industry: preferences.industries?.[0],
          experienceLevel: preferences.experienceLevels?.[0],
          location: preferences.locations?.[0],
          remote: preferences.remote,
          salaryMin: preferences.salaryRange?.min,
          salaryMax: preferences.salaryRange?.max
        }
      })

      // Get personalized recommendations
      const recommendations = await jobMatchingService.getPersonalizedRecommendations(userId, {
        limit: 10,
        diversify: true
      })

      res.json({
        success: true,
        data: {
          matches,
          recommendations,
          generatedAt: new Date()
        }
      })

    } catch (error) {
      next(error)
    }
  }
)

/**
 * POST /api/jobs/analyze/salary-impact
 * Analyze salary impact of acquiring specific skills
 */
router.post('/analyze/salary-impact',
  auth,
  jobActionLimit,
  [
    body('currentSkills').isArray().withMessage('Current skills must be an array'),
    body('targetSkills').isArray().withMessage('Target skills must be an array'),
    body('criteria').optional().isObject().withMessage('Criteria must be an object')
  ],
  async (req, res, next) => {
    try {
      const { currentSkills, targetSkills, criteria = {} } = req.body

      // Import the gap analysis service
      const { gapAnalysisService } = await import('../services/gapAnalysis.js')

      // Analyze salary impact
      const salaryAnalysis = await gapAnalysisService.analyzeSalaryImpact(
        currentSkills,
        targetSkills,
        criteria
      )

      res.json({
        success: true,
        data: salaryAnalysis
      })

    } catch (error) {
      next(error)
    }
  }
)

/**
 * GET /api/jobs/recommendations/:userId
 * Get personalized job recommendations
 */
router.get('/recommendations/:userId',
  auth,
  jobSearchLimit,
  [
    param('userId').isMongoId().withMessage('Invalid user ID'),
    query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20'),
    query('diversify').optional().isBoolean().withMessage('Diversify must be a boolean')
  ],
  async (req, res, next) => {
    try {
      const { userId } = req.params
      const { limit = 10, diversify = true } = req.query

      // Import the job matching service
      const { jobMatchingService } = await import('../services/jobMatching.js')

      // Get personalized recommendations
      const recommendations = await jobMatchingService.getPersonalizedRecommendations(userId, {
        limit: parseInt(limit),
        diversify: diversify === 'true'
      })

      res.json({
        success: true,
        data: {
          recommendations,
          userId,
          generatedAt: new Date()
        }
      })

    } catch (error) {
      next(error)
    }
  }
)

// Health check endpoint for job matching services
router.get('/health/matching',
  async (req, res) => {
    try {
      // Basic health check
      const { jobMatchingService } = await import('../services/jobMatching.js')
      const { gapAnalysisService } = await import('../services/gapAnalysis.js')

      res.json({
        success: true,
        services: {
          jobMatching: 'operational',
          gapAnalysis: 'operational'
        },
        timestamp: new Date()
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Job matching services unavailable',
        error: error.message
      })
    }
  }
)

export default router