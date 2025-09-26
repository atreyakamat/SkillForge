import mongoose from 'mongoose'

const assessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: Object, default: {} },
  result: { type: Object, default: {} }
}, { timestamps: true })

export default mongoose.model('Assessment', assessmentSchema)

