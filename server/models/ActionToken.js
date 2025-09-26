import mongoose from 'mongoose'

const actionTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  purpose: { type: String, enum: ['password_reset', 'email_verify'], required: true },
  tokenHash: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true },
  consumedAt: { type: Date }
}, { timestamps: true })

export default mongoose.model('ActionToken', actionTokenSchema)

