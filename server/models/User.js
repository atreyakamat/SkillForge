import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const peerRatingSchema = new mongoose.Schema({
  raterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  date: { type: Date, default: Date.now }
}, { _id: false })

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  selfRating: { type: Number, min: 1, max: 5 },
  peerRatings: { type: [peerRatingSchema], default: [] },
  averagePeerRating: { type: Number, min: 0, max: 5, default: 0 }
}, { _id: false })

const preferencesSchema = new mongoose.Schema({
  notifications: { type: Boolean, default: true },
  privacy: { type: String, enum: ['public', 'private', 'friends'], default: 'private' }
}, { _id: false })

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true, match: /.+@.+\..+/ },
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

userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ 'skills.name': 1 })

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash)
}

export default mongoose.model('User', userSchema)

