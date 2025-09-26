import mongoose from 'mongoose'

const peerReviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: String, required: true },
  ratings: { type: Object, default: {} }
}, { timestamps: true })

export default mongoose.model('PeerReview', peerReviewSchema)

