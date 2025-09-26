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
  name: { 
    type: String, 
    required: true, 
    index: true, 
    unique: true,
    trim: true 
  },
  category: { 
    type: String, 
    index: true, 
    required: true,
    enum: [
      'Programming Languages',
      'Frontend Frameworks', 
      'Backend Frameworks',
      'Databases',
      'Cloud Platforms',
      'DevOps Tools',
      'Soft Skills',
      'Project Management',
      'Design Tools',
      'Programming', // Keep existing categories for backward compatibility
      'Frontend',
      'Backend',
      'Design',
      'Product',
      'Data'
    ]
  },
  subcategory: { type: String, index: true },
  description: { type: String },
  proficiencyLevels: { 
    type: Map,
    of: String,
    default: {
      '1-2': 'Beginner - Basic understanding',
      '3-4': 'Novice - Some experience', 
      '5-6': 'Intermediate - Comfortable usage',
      '7-8': 'Advanced - Deep expertise',
      '9-10': 'Expert - Mastery level'
    }
  },
  industryRelevance: { 
    type: Number,
    min: 1,
    max: 10,
    default: 5 // Make optional with default to not break existing data
  },
  marketDemand: { 
    type: Number,
    min: 1,
    max: 10,
    default: 5 // Make optional with default to not break existing data
  },
  // Keep existing fields for backward compatibility
  marketDemandScore: { type: Number, min: 0, max: 100, default: 50 },
  relatedSkills: [{ type: String }], // Changed to String array for simplicity
  prerequisites: [{ type: String }], // Changed to String array for simplicity
  validationCriteria: { type: [validationCriteriaSchema], default: [] },
  evidenceTypes: [{ type: String }] // New field for evidence types
}, { timestamps: true })

// Index for searching
skillSchema.index({ name: 1, category: 1 })
skillSchema.index({ category: 1, marketDemand: -1 })

export default mongoose.model('Skill', skillSchema)

