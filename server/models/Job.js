import mongoose from 'mongoose'

const requiredSkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 1, max: 10, required: true },
  importance: { type: String, enum: ['critical', 'preferred'], default: 'preferred' }
}, { _id: false })

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  type: { type: String, enum: ['remote', 'onsite', 'hybrid'], default: 'remote' },
  requiredSkills: { type: [requiredSkillSchema], default: [] },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  experience: { type: String },
  source: { type: String, enum: ['scraped', 'manual'], default: 'manual' },
  postDate: { type: Date, default: Date.now },
  expiry: { type: Date },
  industry: { type: String },
  department: { type: String },
  careerLevel: { type: String, enum: ['junior', 'mid', 'senior', 'lead'], default: 'mid' }
}, { timestamps: true })

jobSchema.index({ industry: 1 })
jobSchema.index({ 'requiredSkills.name': 1, industry: 1 })
jobSchema.index({ postDate: -1 })

export default mongoose.model('Job', jobSchema)

