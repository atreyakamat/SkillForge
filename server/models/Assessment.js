import mongoose from 'mongoose'

const peerReviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 10, required: true },
  comment: { type: String },
  helpfulVotes: { type: Number, min: 0, default: 0 },
  date: { type: Date, default: Date.now }
}, { _id: true })

const assessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true, index: true },
  selfRating: { type: Number, min: 1, max: 10, required: true },
  confidence: { type: Number, min: 1, max: 10 },
  evidence: { type: String },
  assessmentDate: { type: Date, default: Date.now },
  peerReviews: { type: [peerReviewSchema], default: [] },
  averageRating: { type: Number, min: 1, max: 10, default: null },
  validationStatus: { type: String, enum: ['unvalidated', 'partially_validated', 'validated'], default: 'unvalidated' },
  gaps: { type: [String], default: [] },
  recommendations: { type: [String], default: [] }
}, { timestamps: true })

assessmentSchema.pre('save', function computeAverage(next) {
  if (this.peerReviews && this.peerReviews.length > 0) {
    const sum = this.peerReviews.reduce((acc, r) => acc + (r.rating || 0), 0)
    const avg = sum / this.peerReviews.length
    this.averageRating = Math.round(avg * 10) / 10
    this.validationStatus = avg >= 6 ? 'validated' : avg >= 4 ? 'partially_validated' : 'unvalidated'
  } else {
    this.averageRating = this.selfRating
    this.validationStatus = 'unvalidated'
  }
  next()
})

// Compound index for user + skill
assessmentSchema.index({ user: 1, skill: 1 }, { unique: false })

export default mongoose.model('Assessment', assessmentSchema)

