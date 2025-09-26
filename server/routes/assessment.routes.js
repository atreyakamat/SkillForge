import { Router } from 'express'
import { createAssessment, getMyAssessments } from '../controllers/assessment.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/', requireAuth, createAssessment)
router.get('/me', requireAuth, getMyAssessments)

export default router

