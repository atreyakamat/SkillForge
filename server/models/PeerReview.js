import mongoose from 'mongoose'

const reviewItemSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 10, required: true },
  comment: { type: String },
  confidence: { type: Number, min: 1, max: 10 }
}, { _id: false })

const peerReviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'completed', 'expired'], default: 'pending' },
  requestedSkills: { type: [String], default: [] },
  deadline: { type: Date },
  message: { type: String },
  reviews: { type: [reviewItemSchema], default: [] },
  anonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  qualityRating: { type: Number, min: 1, max: 5 },
  qualityFeedback: { type: String }
}, { timestamps: true })

// Compound indexes for efficient querying
peerReviewSchema.index({ reviewer: 1, reviewee: 1, status: 1 })
<<<<<<< HEAD
peerReviewSchema.index({ reviewer: 1 })
peerReviewSchema.index({ reviewee: 1 })
peerReviewSchema.index({ status: 1 })
=======
peerReviewSchema.index({ reviewee: 1, createdAt: -1 })
peerReviewSchema.index({ reviewer: 1, createdAt: -1 })
>>>>>>> 1d3b6a9f1ea76a99356112c0b3479ac218972df2

export default mongoose.model('PeerReview', peerReviewSchema)

