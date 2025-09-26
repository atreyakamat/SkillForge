import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getSkillDevelopmentPlan, getJobMatches, generateLearningPathController, getIndustryBenchmarks, getSkillTrends } from '../controllers/analytics.controller.js'

const router = Router()

router.get('/development-plan/:userId', requireAuth, getSkillDevelopmentPlan)
router.get('/jobs/matches/:userId', requireAuth, getJobMatches)
router.get('/learning-path/:userId', requireAuth, generateLearningPathController)
router.get('/benchmarks/:industry', getIndustryBenchmarks)
router.get('/trends/:skillName', getSkillTrends)

export default router

