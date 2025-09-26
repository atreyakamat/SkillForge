import { Router } from 'express'
import { login, register } from '../controllers/auth.controller.js'
import { validate, commonRules } from '../middleware/validation.js'

const router = Router()

router.post('/register', validate([commonRules.name, commonRules.email, commonRules.password]), register)
router.post('/login', validate([commonRules.email, commonRules.password]), login)

export default router

