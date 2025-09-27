import { Router } from 'express'
import { login, register, logout, refreshToken, forgotPassword, resetPassword, verifyEmail, getProfile } from '../controllers/auth.controller.js'
import { authLimiter, loginLimiter } from '../middleware/rateLimit.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/register', authLimiter, register)
router.post('/login', loginLimiter, login)
router.post('/logout', authLimiter, logout)
router.post('/refresh', authLimiter, refreshToken)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password', authLimiter, resetPassword)
router.get('/verify-email/:token', verifyEmail)
router.get('/profile', requireAuth, getProfile)

export default router

