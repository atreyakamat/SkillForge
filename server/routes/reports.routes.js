import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { generateSkillReport, exportSkillData, getProgressReport, generateGapAnalysis, createTeamReport } from '../controllers/report.controller.js'

const router = Router()

router.get('/skills/:userId', requireAuth, generateSkillReport)
router.get('/export/:userId', requireAuth, exportSkillData)
router.get('/progress/:userId', requireAuth, getProgressReport)
router.get('/gaps/:userId', requireAuth, generateGapAnalysis)
router.get('/team/:managerId', requireAuth, createTeamReport)

export default router

