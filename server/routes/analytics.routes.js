import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getSkillDevelopmentPlan, getJobMatches, generateLearningPathController, getIndustryBenchmarks, getSkillTrends, getSkillGapAnalysis } from '../controllers/analytics.controller.js'

const router = Router()

// User-specific routes (use current user from JWT)
router.get('/development-plan/me', requireAuth, getSkillDevelopmentPlan)
router.get('/jobs/matches/me', requireAuth, getJobMatches)
router.get('/learning-path/me', requireAuth, generateLearningPathController)
router.get('/skill-gap', requireAuth, getSkillGapAnalysis)

// Public routes (no authentication required)
router.get('/benchmarks', getIndustryBenchmarks)
router.get('/benchmarks/:industry', getIndustryBenchmarks)
router.get('/trends/:skillName', getSkillTrends)

// Legacy routes for backward compatibility (if needed)
router.get('/development-plan/:userId', requireAuth, getSkillDevelopmentPlan)
router.get('/jobs/matches/:userId', requireAuth, getJobMatches)
router.get('/learning-path/:userId', requireAuth, generateLearningPathController)

export default router

