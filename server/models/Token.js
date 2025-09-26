import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date }
}, { timestamps: true })

const blacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true })

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)
export const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema)

