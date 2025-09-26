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
  const { userId } = req.params
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
    
    for (const skillData of skillsToAdd) {
      const { skillId, selfRating, confidence, evidence } = skillData
      
      if (!skillId || !selfRating) {
        return res.status(400).json({
          success: false,
          message: 'skillId and selfRating are required for each skill'
        })
      }
      
      const assessment = await Assessment.create({ 
        user: userId, 
        skill: skillId, 
        selfRating, 
        confidence: confidence || 5, 
        evidence: evidence || '' 
      })
      assessments.push(assessment)
    }
    
    res.status(201).json({ success: true, assessments })
  } catch (error) {
    console.error('Error adding user skill:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export async function updateSkillRating(req, res) {
  const { skillId } = req.params
  const { selfRating, confidence, evidence } = req.body
  const userId = req.user.id
  const doc = await Assessment.findOneAndUpdate(
    { user: userId, skill: skillId },
    { $set: { selfRating, confidence, evidence, assessmentDate: new Date() } },
    { new: true }
  )
  res.json({ success: true, assessment: doc })
}

export async function deleteUserSkill(req, res) {
  const { skillId } = req.params
  const userId = req.user.id
  await Assessment.deleteOne({ user: userId, skill: skillId })
  res.json({ success: true, message: 'Skill removed' })
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


