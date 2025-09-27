import { Router } from 'express'
import { me, updateProfile, addSkills, getPublicProfile } from '../controllers/user.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/profile', requireAuth, me)
router.put('/profile', requireAuth, updateProfile)
router.post('/skills', requireAuth, addSkills)
router.get('/profile/public/:userId', getPublicProfile) // Public endpoint, no auth required

export default router

