import express from 'express'
import { body } from 'express-validator'
import { requireAuth } from '../middleware/auth.js'
import { authLimiter as rateLimit } from '../middleware/rateLimit.js'
import { 
  chatWithCoach, 
  getChatHistory, 
  saveChatMessage 
} from '../controllers/chatController.js'

const router = express.Router()

// Validation middleware
const validateChatMessage = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('history')
    .optional()
    .isArray()
    .withMessage('History must be an array')
]

// Chat endpoints
router.post('/chat', 
  requireAuth,
  rateLimit({ windowMs: 60000, max: 10 }), // 10 requests per minute
  validateChatMessage,
  chatWithCoach
)

router.get('/history',
  requireAuth,
  getChatHistory
)

router.post('/save',
  requireAuth,
  rateLimit({ windowMs: 60000, max: 20 }), // 20 saves per minute
  [
    body('message')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message must be between 1 and 1000 characters'),
    body('reply')
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Reply must be between 1 and 2000 characters')
  ],
  saveChatMessage
)

export default router
