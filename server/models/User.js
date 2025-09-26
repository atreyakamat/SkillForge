import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const peerRatingSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 10 },
  comment: { type: String },
  date: { type: Date, default: Date.now },
  helpfulVotes: { type: Number, default: 0 }
}, { _id: false })

const skillSchema = new mongoose.Schema({
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  name: { type: String, required: true },
  selfRating: { type: Number, min: 1, max: 10, required: true },
  peerRatings: { type: [peerRatingSchema], default: [] },
  averageRating: { type: Number, min: 1, max: 10 },
  evidence: { type: String },
  confidenceLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  lastUpdated: { type: Date, default: Date.now }
}, { _id: false })

const preferencesSchema = new mongoose.Schema({
  notifications: { type: Boolean, default: true },
  privacy: { type: String, enum: ['public', 'private', 'friends'], default: 'private' }
}, { _id: false })

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profilePicture: { type: String },
  skills: { type: [skillSchema], default: [] },
  careerGoals: { type: String },
  experienceLevel: { type: String, enum: ['junior', 'mid', 'senior', 'lead'], default: 'junior' },
  industry: { type: String },
  preferences: { type: preferencesSchema, default: () => ({}) },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
}, { timestamps: true })

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash)
}

// Indexes
// Unique email is already set via schema field
userSchema.index({ 'skills.name': 1 })

export default mongoose.model('User', userSchema)

