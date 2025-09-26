import Assessment from '../models/Assessment.js'
import { analyzeSkills } from '../services/skillAnalysis.js'
import mongoose from 'mongoose'

export async function createAssessment(req, res) {
  const { skillId, selfRating, confidence, evidence } = req.body
  const doc = await Assessment.create({ user: req.user.id, skill: skillId, selfRating, confidence, evidence })
  res.status(201).json({ success: true, assessment: doc })
}

export async function getMyAssessments(req, res) {
  const docs = await Assessment.find({ user: req.user.id }).populate('skill').sort({ createdAt: -1 })
  res.json({ success: true, assessments: docs })
}

export async function updateAssessment(req, res) {
  const { id } = req.params
  const { selfRating, confidence, evidence } = req.body
  const doc = await Assessment.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id), user: req.user.id },
    { $set: { selfRating, confidence, evidence, assessmentDate: new Date() } },
    { new: true }
  )
  if (!doc) return res.status(404).json({ success: false, message: 'Assessment not found' })
  res.json({ success: true, assessment: doc })
}

export async function getAssessmentHistory(req, res) {
  const { userId } = req.params
  const docs = await Assessment.find({ user: userId }).populate('skill').sort({ assessmentDate: 1 })
  res.json({ success: true, history: docs })
}

export async function getSkillProgression(req, res) {
  const { userId } = req.params
  const pipeline = [
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $sort: { assessmentDate: 1 } },
    { $group: { _id: '$skill', points: { $push: { date: '$assessmentDate', selfRating: '$selfRating', avg: '$averageRating' } } } }
  ]
  const data = await Assessment.aggregate(pipeline)
  res.json({ success: true, progression: data })
}

export async function generateAssessmentReport(req, res) {
  const { userId } = req.params
  const assessments = await Assessment.find({ user: userId }).populate('skill').lean()
  const summary = assessments.map(a => ({
    skill: a.skill?.name,
    category: a.skill?.category,
    selfRating: a.selfRating,
    averageRating: a.averageRating,
    validationStatus: a.validationStatus,
    gaps: a.gaps,
    recommendations: a.recommendations
  }))
  const gaps = assessments.flatMap(a => a.gaps || [])
  const recs = assessments.flatMap(a => a.recommendations || [])
  res.json({ success: true, report: { count: assessments.length, items: summary, gaps, recommendations: recs } })
}

