import { Router } from 'express'
import { me, updateProfile, addSkills } from '../controllers/user.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/profile', requireAuth, me)
router.put('/profile', requireAuth, updateProfile)
router.post('/skills', requireAuth, addSkills)

export default router

