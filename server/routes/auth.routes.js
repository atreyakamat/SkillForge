import { Router } from 'express'
<<<<<<< HEAD
import { login, register, logout, refreshToken, forgotPassword, resetPassword, verifyEmail } from '../controllers/auth.controller.js'
import { authLimiter, loginLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.post('/register', authLimiter, register)
router.post('/login', loginLimiter, login)
router.post('/logout', authLimiter, logout)
router.post('/refresh', authLimiter, refreshToken)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password', authLimiter, resetPassword)
router.get('/verify-email/:token', verifyEmail)
=======
import { login, register } from '../controllers/auth.controller.js'
import { validate, commonRules } from '../middleware/validation.js'

const router = Router()

router.post('/register', validate([commonRules.name, commonRules.email, commonRules.password]), register)
router.post('/login', validate([commonRules.email, commonRules.password]), login)
>>>>>>> c593d28860cafaaa1fa204e9e0aa564e2e246775

export default router

