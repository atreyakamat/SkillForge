import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: String },
  description: { type: String }
}, { timestamps: true })

export default mongoose.model('Skill', skillSchema)

