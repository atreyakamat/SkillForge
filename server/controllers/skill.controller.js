import Skill from '../models/Skill.js'
import Assessment from '../models/Assessment.js'
import User from '../models/User.js'

export async function getAllSkills(req, res) {
  const skills = await Skill.find({}).lean()
  res.json({ success: true, skills })
}

export async function getCategories(req, res) {
  const categories = await Skill.distinct('category')
  res.json({ success: true, categories })
}

export async function getUserSkills(req, res) {
  const userId = req.params.userId || req.user.id // Use current user if no userId provided
  const assessments = await Assessment.find({ user: userId }).populate('skill').lean()
  const profile = assessments.map(a => ({
    skillId: a.skill?._id,
    skillName: a.skill?.name,
    category: a.skill?.category,
    selfRating: a.selfRating,
    averageRating: a.averageRating,
    validationStatus: a.validationStatus,
    confidence: a.confidence
  }))
  res.json({ success: true, skills: profile })
}

export async function addUserSkill(req, res) {
  try {
    const userId = req.user.id
    
    // Handle both single skill and skills array formats
    let skillsToAdd = []
    
    if (req.body.skills && Array.isArray(req.body.skills)) {
      // Array format: { skills: [{ skillId, selfRating, ... }] }
      skillsToAdd = req.body.skills
    } else if (req.body.skillId) {
      // Single skill format: { skillId, selfRating, ... }
      skillsToAdd = [req.body]
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide either skillId or skills array' 
      })
    }
    
    const assessments = []
    const userSkillsToAdd = []
    
    // Get user for updating skills array
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    for (const skillData of skillsToAdd) {
      const { skillId, selfRating, confidence, evidence } = skillData
      
      if (!skillId || !selfRating) {
        return res.status(400).json({
          success: false,
          message: 'skillId and selfRating are required for each skill'
        })
      }

      // Get skill details
      const skill = await Skill.findById(skillId)
      if (!skill) {
        return res.status(404).json({
          success: false,
          message: `Skill with ID ${skillId} not found`
        })
      }
      
      // Create or update assessment
      const assessment = await Assessment.findOneAndUpdate(
        { user: userId, skill: skillId },
        { 
          selfRating, 
          confidence: confidence || 5, 
          evidence: evidence || '',
          assessmentDate: new Date()
        },
        { upsert: true, new: true }
      )
      assessments.push(assessment)

      // Update or add to user skills array
      const existingSkillIndex = user.skills.findIndex(s => 
        s.skillId?.toString() === skillId || s.name === skill.name
      )

      const userSkill = {
        skillId: skill._id,
        name: skill.name,
        selfRating,
        evidence: evidence || '',
        confidenceLevel: confidence <= 3 ? 'low' : confidence <= 7 ? 'medium' : 'high',
        lastUpdated: new Date()
      }

      if (existingSkillIndex >= 0) {
        // Update existing skill
        user.skills[existingSkillIndex] = { ...user.skills[existingSkillIndex], ...userSkill }
      } else {
        // Add new skill
        user.skills.push(userSkill)
      }
      
      userSkillsToAdd.push(userSkill)
    }

    // Save updated user
    await user.save()
    
    res.status(201).json({ 
      success: true, 
      assessments,
      userSkills: userSkillsToAdd,
      message: 'Skills added successfully'
    })
  } catch (error) {
    console.error('Error adding user skill:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export async function updateSkillRating(req, res) {
  try {
    const { skillId } = req.params
    const { selfRating, confidence, evidence } = req.body
    const userId = req.user.id
    
    // Update assessment
    const assessment = await Assessment.findOneAndUpdate(
      { user: userId, skill: skillId },
      { $set: { selfRating, confidence, evidence, assessmentDate: new Date() } },
      { new: true }
    ).populate('skill')

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' })
    }

    // Update user.skills array
    const user = await User.findById(userId)
    if (user) {
      const skillIndex = user.skills.findIndex(s => 
        s.skillId?.toString() === skillId || s.name === assessment.skill.name
      )

      if (skillIndex >= 0) {
        user.skills[skillIndex].selfRating = selfRating
        user.skills[skillIndex].evidence = evidence || user.skills[skillIndex].evidence
        user.skills[skillIndex].confidenceLevel = confidence <= 3 ? 'low' : confidence <= 7 ? 'medium' : 'high'
        user.skills[skillIndex].lastUpdated = new Date()
        await user.save()
      }
    }

    res.json({ success: true, assessment })
  } catch (error) {
    console.error('Error updating skill rating:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export async function deleteUserSkill(req, res) {
  try {
    const { skillId } = req.params
    const userId = req.user.id
    
    // Delete assessment
    await Assessment.deleteOne({ user: userId, skill: skillId })
    
    // Remove from user.skills array
    const user = await User.findById(userId)
    if (user) {
      user.skills = user.skills.filter(s => 
        s.skillId?.toString() !== skillId && s.name !== skillId
      )
      await user.save()
    }
    
    res.json({ success: true, message: 'Skill removed successfully' })
  } catch (error) {
    console.error('Error deleting user skill:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

function jaccard(a, b) {
  const sa = new Set(a), sb = new Set(b)
  const inter = [...sa].filter(x => sb.has(x)).length
  const uni = new Set([...sa, ...sb]).size
  return uni === 0 ? 0 : inter / uni
}

export async function suggestSkills(req, res) {
  const { userId } = req.params
  const user = await User.findById(userId).lean()
  const userAssessments = await Assessment.find({ user: userId }).populate('skill').lean()
  const userSkillIds = new Set(userAssessments.map(a => String(a.skill?._id)))
  const userCategories = new Set(userAssessments.map(a => a.skill?.category).filter(Boolean))

  const allSkills = await Skill.find({}).lean()
  const scored = allSkills
    .filter(s => !userSkillIds.has(String(s._id)))
    .map(s => {
      const categoryScore = userCategories.has(s.category) ? 0.3 : 0
      const industryScore = (user?.industry && s.industryRelevance?.includes(user.industry)) ? 0.3 : 0
      const demandScore = (s.marketDemandScore || 0) / 100 * 0.4
      return { skill: s, score: categoryScore + industryScore + demandScore }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  res.json({ success: true, suggestions: scored.map(x => ({ ...x.skill, score: Math.round(x.score * 100) / 100 })) })
}

export async function getSkillDetails(req, res) {
  const { id } = req.params
  const skill = await Skill.findById(id).populate('relatedSkills prerequisites').lean()
  if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' })
  res.json({ success: true, skill })
}

export async function createSkill(req, res) {
  try {
    const { name, category, description, marketDemandScore } = req.body
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Skill name is required' 
      })
    }
    
    // Check if skill already exists
    const existingSkill = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
    if (existingSkill) {
      return res.status(409).json({ 
        success: false, 
        message: 'Skill already exists',
        skill: existingSkill
      })
    }
    
    const skill = await Skill.create({
      name,
      category: category || 'Other',
      description: description || `User-added skill: ${name}`,
      marketDemandScore: marketDemandScore || 50
    })
    
    res.status(201).json({ success: true, skill })
  } catch (error) {
    console.error('Error creating skill:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export async function getTrendingSkills(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10
    
    // Get skills with highest market demand or most assessments
    const trendingSkills = await Skill.find({})
      .sort({ marketDemandScore: -1 }) // Sort by market demand score descending
      .limit(limit)
      .lean()
    
    res.json({ 
      success: true, 
      skills: trendingSkills,
      message: 'Trending skills retrieved successfully'
    })
  } catch (error) {
    console.error('Error getting trending skills:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}


