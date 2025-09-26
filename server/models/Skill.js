import mongoose from 'mongoose'

const proficiencyLevelSchema = new mongoose.Schema({
  level: { type: Number, required: true, min: 1, max: 10 },
  description: { type: String, required: true }
}, { _id: false })

const validationCriteriaSchema = new mongoose.Schema({
  criterion: { type: String, required: true },
  evidenceTypes: [{ type: String }]
}, { _id: false })

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true, unique: true },
  category: { type: String, index: true, required: true },
  subcategory: { type: String, index: true },
  description: { type: String },
  proficiencyLevels: { type: [proficiencyLevelSchema], default: [] },
  industryRelevance: { type: [String], default: [] },
  marketDemandScore: { type: Number, min: 0, max: 100, default: 50 },
  relatedSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  validationCriteria: { type: [validationCriteriaSchema], default: [] }
}, { timestamps: true })

export default mongoose.model('Skill', skillSchema)

