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
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true,
    index: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter valid email']
  },
  passwordHash: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: { 
    type: String, 
    required: true,
    enum: ['Developer', 'Designer', 'Manager', 'Analyst', 'Other', 'user', 'admin'], 
    default: 'user' 
  },
  industry: { 
    type: String, 
    required: true,
    enum: ['Technology', 'Finance', 'Healthcare', 'Education', 'Other']
  },
  profilePicture: { type: String },
  skills: { type: [skillSchema], default: [] },
  careerGoals: { type: [String], default: [] },
  experienceLevel: { type: String, enum: ['junior', 'mid', 'senior', 'lead'], default: 'junior' },
  preferences: { type: preferencesSchema, default: () => ({}) },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
}, { timestamps: true })

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash password if it was modified and it's a plain password (not already hashed)
  if (!this.isModified('passwordHash') || this.passwordHash.startsWith('$2')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password (maintain existing functionality)
userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash)
}

// Alternative method name for compatibility
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
}

// Calculate average rating for skills
userSchema.methods.updateSkillAverages = function() {
  this.skills.forEach(skill => {
    if (skill.peerRatings.length > 0) {
      const peerAverage = skill.peerRatings.reduce((sum, rating) => sum + rating.rating, 0) / skill.peerRatings.length;
      skill.averageRating = (skill.selfRating * 0.3) + (peerAverage * 0.7); // 30% self, 70% peer
    } else {
      skill.averageRating = skill.selfRating;
    }
    skill.lastUpdated = new Date();
  });
}

// Indexes
// Unique email is already set via schema field
userSchema.index({ 'skills.name': 1 })
userSchema.index({ 'skills.skillId': 1 })

export default mongoose.model('User', userSchema)

