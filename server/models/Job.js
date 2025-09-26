import mongoose from 'mongoose'

const skillRequirementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  category: {
    type: String,
    enum: ['technical', 'soft', 'language', 'certification'],
    default: 'technical'
  },
  weight: {
    type: Number,
    min: 0,
    max: 1,
    default: 1 // Importance weight for matching algorithm
  }
}, { _id: false })

const jobSchema = new mongoose.Schema({
  // Basic Job Information
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  company: {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    logo: String,
    website: String,
    description: String,
    size: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise']
    },
    industry: {
      type: String,
      required: true,
      index: true
    }
  },
  
  // Job Details
  description: {
    type: String,
    required: true
  },
  responsibilities: [String],
  qualifications: [String],
  
  // Location and Work Type
  location: {
    city: String,
    state: String,
    country: {
      type: String,
      default: 'US'
    },
    remote: {
      type: Boolean,
      default: false
    },
    hybrid: {
      type: Boolean,
      default: false
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Employment Details
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
    required: true,
    index: true
  },
  
  // Salary Information
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'annual'],
      default: 'annual'
    },
    equity: {
      offered: Boolean,
      range: String // e.g., "0.1% - 0.5%"
    }
  },
  
  // Skills and Requirements
  skills: {
    required: [skillRequirementSchema],
    preferred: [skillRequirementSchema]
  },
  
  // Benefits and Perks
  benefits: {
    health: Boolean,
    dental: Boolean,
    vision: Boolean,
    retirement: Boolean,
    vacation: String, // e.g., "Unlimited PTO", "25 days"
    professional_development: Boolean,
    remote_work: Boolean,
    flexible_hours: Boolean,
    other: [String]
  },
  
  // Application Process
  application: {
    url: String,
    email: String,
    instructions: String,
    deadline: Date,
    status: {
      type: String,
      enum: ['active', 'closed', 'filled', 'paused'],
      default: 'active'
    }
  },
  
  // Metadata
  source: {
    type: String,
    enum: ['company', 'job_board', 'referral', 'linkedin', 'indeed', 'glassdoor', 'manual'],
    required: true,
    default: 'manual'
  },
  externalId: String, // ID from external job board
  externalUrl: String,
  
  // Engagement Metrics
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  },
  
  // AI/ML Features
  tags: [String], // Auto-generated tags for better matching
  matchingKeywords: [String], // Keywords extracted for matching
  difficultyScore: {
    type: Number,
    min: 0,
    max: 10 // Calculated based on skill requirements
  },
  
  // Relationships
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Timestamps
  postedDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  
  // Analytics
  analytics: {
    averageMatchScore: Number,
    topMatchingSkills: [String],
    applicationRate: Number,
    viewToApplicationRatio: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for performance
jobSchema.index({ 'company.industry': 1, experienceLevel: 1 })
jobSchema.index({ 'location.city': 1, 'location.remote': 1 })
jobSchema.index({ 'skills.required.name': 1 })
jobSchema.index({ postedDate: -1 })
jobSchema.index({ 'application.status': 1 })
jobSchema.index({ tags: 1 })

// Compound indexes for complex queries
jobSchema.index({ 
  'company.industry': 1, 
  experienceLevel: 1, 
  'location.remote': 1,
  'application.status': 1 
})

// Text index for search functionality
jobSchema.index({
  title: 'text',
  description: 'text',
  'company.name': 'text',
  'company.description': 'text',
  responsibilities: 'text',
  qualifications: 'text',
  tags: 'text'
})

// Virtual for total required skills count
jobSchema.virtual('totalRequiredSkills').get(function() {
  return this.skills.required?.length || 0
})

// Virtual for total preferred skills count  
jobSchema.virtual('totalPreferredSkills').get(function() {
  return this.skills.preferred?.length || 0
})

// Virtual for combined skills
jobSchema.virtual('allSkills').get(function() {
  return [...(this.skills.required || []), ...(this.skills.preferred || [])]
})

// Virtual for salary range display
jobSchema.virtual('salaryRange').get(function() {
  if (!this.salary?.min && !this.salary?.max) return null
  
  const format = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount}`
  }
  
  if (this.salary.min && this.salary.max) {
    return `${format(this.salary.min)} - ${format(this.salary.max)}`
  } else if (this.salary.min) {
    return `${format(this.salary.min)}+`
  } else if (this.salary.max) {
    return `Up to ${format(this.salary.max)}`
  }
  return null
})

// Virtual for location display
jobSchema.virtual('locationDisplay').get(function() {
  if (this.location?.remote) return 'Remote'
  if (this.location?.hybrid) return `${this.location.city || 'Hybrid'} (Hybrid)`
  return `${this.location?.city || ''}, ${this.location?.state || ''}`.replace(/^,\s*|,\s*$/g, '')
})

// Pre-save middleware to update timestamps and calculate derived fields
jobSchema.pre('save', function(next) {
  this.updatedDate = new Date()
  
  // Calculate difficulty score based on required skills
  if (this.skills.required && this.skills.required.length > 0) {
    const avgLevel = this.skills.required.reduce((sum, skill) => sum + skill.level, 0) / this.skills.required.length
    const skillCount = this.skills.required.length
    this.difficultyScore = Math.min(10, (avgLevel * 2) + (skillCount * 0.5))
  }
  
  // Extract keywords for matching
  const keywords = new Set()
  
  // Add skill names
  if (this.skills.required) {
    this.skills.required.forEach(skill => keywords.add(skill.name.toLowerCase()))
  }
  if (this.skills.preferred) {
    this.skills.preferred.forEach(skill => keywords.add(skill.name.toLowerCase()))
  }
  
  // Add title words
  this.title.toLowerCase().split(/\s+/).forEach(word => {
    if (word.length > 2) keywords.add(word)
  })
  
  // Add company industry
  if (this.company?.industry) {
    keywords.add(this.company.industry.toLowerCase())
  }
  
  this.matchingKeywords = Array.from(keywords)
  
  next()
})

// Static methods for querying
jobSchema.statics.findBySkills = function(skillNames, options = {}) {
  const query = {
    'application.status': 'active',
    $or: [
      { 'skills.required.name': { $in: skillNames } },
      { 'skills.preferred.name': { $in: skillNames } }
    ]
  }
  
  if (options.experienceLevel) {
    query.experienceLevel = options.experienceLevel
  }
  
  if (options.location) {
    if (options.location === 'remote') {
      query['location.remote'] = true
    } else {
      query['location.city'] = new RegExp(options.location, 'i')
    }
  }
  
  if (options.industry) {
    query['company.industry'] = options.industry
  }
  
  return this.find(query).sort({ postedDate: -1 })
}

jobSchema.statics.findSimilar = function(jobId, limit = 5) {
  return this.findById(jobId).then(job => {
    if (!job) return []
    
    const skillNames = job.allSkills.map(s => s.name)
    
    return this.find({
      _id: { $ne: jobId },
      'application.status': 'active',
      $or: [
        { 'skills.required.name': { $in: skillNames } },
        { 'skills.preferred.name': { $in: skillNames } },
        { 'company.industry': job.company.industry }
      ]
    }).limit(limit).sort({ postedDate: -1 })
  })
}

// Instance methods
jobSchema.methods.calculateMatchScore = function(userSkills) {
  if (!userSkills || userSkills.length === 0) return 0
  
  let totalScore = 0
  let totalWeight = 0
  
  // Calculate score for required skills
  if (this.skills.required) {
    this.skills.required.forEach(requiredSkill => {
      const userSkill = userSkills.find(us => 
        us.name.toLowerCase() === requiredSkill.name.toLowerCase()
      )
      
      if (userSkill) {
        const skillScore = Math.min(userSkill.level / requiredSkill.level, 1) * 100
        totalScore += skillScore * requiredSkill.weight
      } else {
        // Penalty for missing required skills
        totalScore += 0 * requiredSkill.weight
      }
      
      totalWeight += requiredSkill.weight
    })
  }
  
  // Calculate score for preferred skills (bonus points)
  if (this.skills.preferred) {
    this.skills.preferred.forEach(preferredSkill => {
      const userSkill = userSkills.find(us => 
        us.name.toLowerCase() === preferredSkill.name.toLowerCase()
      )
      
      if (userSkill) {
        const skillScore = Math.min(userSkill.level / preferredSkill.level, 1) * 100
        totalScore += skillScore * preferredSkill.weight * 0.5 // Preferred skills worth 50%
        totalWeight += preferredSkill.weight * 0.5
      }
    })
  }
  
  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0
}

jobSchema.methods.getSkillGaps = function(userSkills) {
  const gaps = []
  
  if (this.skills.required) {
    this.skills.required.forEach(requiredSkill => {
      const userSkill = userSkills.find(us => 
        us.name.toLowerCase() === requiredSkill.name.toLowerCase()
      )
      
      if (!userSkill) {
        gaps.push({
          skill: requiredSkill.name,
          required: requiredSkill.level,
          current: 0,
          gap: requiredSkill.level,
          priority: 'high',
          type: 'missing'
        })
      } else if (userSkill.level < requiredSkill.level) {
        gaps.push({
          skill: requiredSkill.name,
          required: requiredSkill.level,
          current: userSkill.level,
          gap: requiredSkill.level - userSkill.level,
          priority: requiredSkill.level - userSkill.level > 2 ? 'high' : 'medium',
          type: 'insufficient'
        })
      }
    })
  }
  
  return gaps.sort((a, b) => b.gap - a.gap)
}

jobSchema.methods.incrementViews = function() {
  this.views += 1
  return this.save()
}

jobSchema.methods.incrementApplications = function() {
  this.applications += 1
  return this.save()
}

export default mongoose.model('Job', jobSchema)

