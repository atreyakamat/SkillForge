import PeerReview from '../models/PeerReview.js'
import User from '../models/User.js'
import { suggestReviewers } from '../services/peerMatching.js'

export async function requestReview(req, res) {
  const { revieweeId, requestedSkills, deadline, message, anonymous } = req.body
  const reviewerId = req.user.id
  const doc = await PeerReview.create({ reviewer: reviewerId, reviewee: revieweeId, requestedSkills, deadline, message, anonymous })
  res.status(201).json({ success: true, request: doc })
}

export async function getPendingRequests(req, res) {
  const userId = req.user.id
  const docs = await PeerReview.find({ reviewer: userId, status: 'pending' }).sort({ createdAt: -1 })
  res.json({ success: true, pending: docs })
}

export async function getReceivedRequests(req, res) {
  const userId = req.user.id
  const docs = await PeerReview.find({ reviewee: userId, status: 'pending' }).sort({ createdAt: -1 })
  res.json({ success: true, received: docs })
}

export async function submitReview(req, res) {
  const { requestId } = req.params
  const { reviews } = req.body
  const userId = req.user.id
  const doc = await PeerReview.findOneAndUpdate(
    { _id: requestId, reviewer: userId, status: 'pending' },
    { $set: { reviews, status: 'completed', completedAt: new Date() } },
    { new: true }
  )
  if (!doc) return res.status(404).json({ success: false, message: 'Request not found' })
  res.json({ success: true, message: 'Review submitted', review: doc })
}

export async function getReviewHistory(req, res) {
  const { userId } = req.params
  const docs = await PeerReview.find({ $or: [{ reviewer: userId }, { reviewee: userId }] }).sort({ createdAt: -1 })
  res.json({ success: true, history: docs })
}

export async function updateReviewQuality(req, res) {
  const { reviewId } = req.params
  const { qualityRating, qualityFeedback } = req.body
  const userId = req.user.id
  const doc = await PeerReview.findOneAndUpdate(
    { _id: reviewId, reviewee: userId },
    { $set: { qualityRating, qualityFeedback } },
    { new: true }
  )
  if (!doc) return res.status(404).json({ success: false, message: 'Review not found' })
  res.json({ success: true, review: doc })
}

export async function recommendReviewers(req, res) {
  const userId = req.user.id
  const { skills } = req.body
  const candidates = await suggestReviewers(userId, skills)
  res.json({ success: true, reviewers: candidates })
}


