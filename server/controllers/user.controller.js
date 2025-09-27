import User from '../models/User.js'

export async function me(req, res) {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ success: false, message: 'User not found' })
  res.json({ success: true, user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    industry: user.industry,
    experience: user.experience,
    skills: user.skills,
    careerGoals: user.careerGoals || [],
    preferences: user.preferences,
    createdAt: user.createdAt
  }})
}

export async function updateProfile(req, res) {
  const updates = {
    name: req.body.name,
    role: req.body.role,
    industry: req.body.industry,
    experience: req.body.experience,
    careerGoals: req.body.careerGoals,
    preferences: req.body.preferences
  }
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
  res.json({ success: true, message: 'Profile updated successfully', user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    experience: user.experience,
    careerGoals: user.careerGoals,
    preferences: user.preferences,
    updatedAt: user.updatedAt
  }})
}

export async function addSkills(req, res) {
  try {
    console.log('addSkills called with:', req.body)
    console.log('User ID:', req.user.id)
    
    const { skills } = req.body
    const user = await User.findById(req.user.id)
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ success: false, message: 'Skills array is required' })
    }
    
    // Import Skill model
    const Skill = (await import('../models/Skill.js')).default
    
    const processedSkills = []
    
    for (const skillData of skills) {
      const { name, selfRating, evidence, confidenceLevel } = skillData
      
      if (!name || !selfRating) {
        continue // Skip invalid skills
      }
      
      // Find or create the skill
      let skill = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
      
      if (!skill) {
        // Create new skill
        skill = await Skill.create({
          name: name,
          category: 'Programming Languages', // Default category
          description: `User-added skill: ${name}`,
          marketDemandScore: 50
        })
      }
      
      // Add skill to user's skills array
      const userSkill = {
        skillId: skill._id,
        name: name,
        selfRating: selfRating,
        peerRatings: [],
        averageRating: selfRating,
        evidence: evidence || '',
        confidenceLevel: confidenceLevel || 'medium',
        lastUpdated: new Date()
      }
      
      processedSkills.push(userSkill)
    }
    
    // Update user's skills array
    user.skills = processedSkills
    await user.save()
    
    console.log('Skills saved successfully:', processedSkills.length, 'skills')
    
    res.status(201).json({ 
      success: true, 
      message: 'Skills added successfully', 
      user: { id: user._id, skills: user.skills } 
    })
    
  } catch (error) {
    console.error('Error adding skills:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export async function getPublicProfile(req, res) {
  try {
    const { userId } = req.params
    
    // Get user basic info (excluding sensitive data)
    const user = await User.findById(userId)
      .select('name email role skills experienceLevel industry createdAt')
      .lean()
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    // Get user assessments to show skill levels
    const Assessment = (await import('../models/Assessment.js')).default
    const assessments = await Assessment.find({ user: userId })
      .populate('skill', 'name category')
      .select('skill selfRating averageRating validationStatus')
      .lean()
    
    // Format skills with assessments data
    const skillsWithRatings = assessments.map(assessment => ({
      name: assessment.skill?.name || 'Unknown Skill',
      category: assessment.skill?.category || 'Other',
      selfRating: assessment.selfRating || 0,
      averageRating: assessment.averageRating || assessment.selfRating || 0,
      validated: assessment.validationStatus === 'validated'
    }))
    
    // Get peer review stats
    const PeerReview = (await import('../models/PeerReview.js')).default
    const peerReviewStats = await PeerReview.aggregate([
      { $match: { reviewee: user._id, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageQuality: { $avg: '$qualityRating' }
        }
      }
    ])
    
    const stats = peerReviewStats[0] || { totalReviews: 0, averageQuality: 0 }
    
    // Build public profile response
    const publicProfile = {
      id: user._id,
      name: user.name,
      role: user.role || 'Professional',
      industry: user.industry,
      experienceLevel: user.experienceLevel,
      joinedDate: user.createdAt,
      skills: skillsWithRatings,
      stats: {
        skillsAssessed: skillsWithRatings.length,
        peerEndorsements: stats.totalReviews,
        averageRating: Number((stats.averageQuality || 0).toFixed(1)),
        profileViews: Math.floor(Math.random() * 2000) + 500 // Mock data for now
      },
      // Generate some mock achievements based on user data
      achievements: [
        ...(skillsWithRatings.length >= 5 ? [{ 
          title: 'Skill Collector', 
          description: `Assessed ${skillsWithRatings.length}+ skills` 
        }] : []),
        ...(stats.totalReviews >= 3 ? [{ 
          title: 'Peer Validated', 
          description: `Received ${stats.totalReviews} peer reviews` 
        }] : []),
        ...(stats.averageQuality >= 4 ? [{ 
          title: 'Quality Contributor', 
          description: 'High-quality peer review contributor' 
        }] : [])
      ]
    }
    
    res.json({ success: true, profile: publicProfile })
    
  } catch (error) {
    console.error('Error fetching public profile:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch profile' })
  }
}

