import { Router } from 'express'
import { createAssessment, getMyAssessments, updateAssessment, getAssessmentHistory, getSkillProgression, generateAssessmentReport } from '../controllers/assessment.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/', requireAuth, createAssessment)
router.get('/me', requireAuth, getMyAssessments)
router.put('/:id', requireAuth, updateAssessment)
router.get('/history/:userId', requireAuth, getAssessmentHistory)
router.get('/progression/:userId', requireAuth, getSkillProgression)
router.get('/report/:userId', requireAuth, generateAssessmentReport)

export default router

