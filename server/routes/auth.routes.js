import { Router } from 'express'
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

export default router

