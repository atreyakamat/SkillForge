import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { seedJobs, getAllJobs } from '../controllers/jobs.controller.js'

const router = Router()

router.post('/', requireAuth, seedJobs)
router.get('/', getAllJobs)

export default router