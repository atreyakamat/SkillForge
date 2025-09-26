import Assessment from '../models/Assessment.js'
import { analyzeSkills } from '../services/skillAnalysis.js'

export async function createAssessment(req, res) {
  const { answers } = req.body
  const result = analyzeSkills(answers)
  const doc = await Assessment.create({ user: req.user.id, answers, result })
  res.status(201).json(doc)
}

export async function getMyAssessments(req, res) {
  const docs = await Assessment.find({ user: req.user.id }).sort({ createdAt: -1 })
  res.json(docs)
}

