import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requestReview, getPendingRequests, getReceivedRequests, submitReview, getReviewHistory, updateReviewQuality, recommendReviewers } from '../controllers/peer.controller.js'

const router = Router()

router.post('/request', requireAuth, requestReview)
router.get('/pending', requireAuth, getPendingRequests)
router.get('/received', requireAuth, getReceivedRequests)
router.post('/submit/:requestId', requireAuth, submitReview)
router.get('/history/:userId', requireAuth, getReviewHistory)
router.put('/quality/:reviewId', requireAuth, updateReviewQuality)
router.post('/recommend', requireAuth, recommendReviewers)
router.get('/suggest/:userId', requireAuth, recommendReviewers)

export default router


