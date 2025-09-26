import User from '../models/User.js'
import Job from '../models/Job.js'
import { analyzeSkills, prioritizeGapsByImpact } from '../services/skillAnalysis.js'
import { rankJobs } from '../services/jobMatching.js'
import { generateLearningPath } from '../services/recommendations.js'

export async function getSkillDevelopmentPlan(req, res) {
  const user = await User.findById(req.params.userId)
  if (!user) return res.status(404).json({ success: false, message: 'User not found' })
  const userLevels = Object.fromEntries((user.skills || []).map(s => [s.name, s.selfRating || 0]))
  const jobs = await Job.find({ industry: user.industry }).limit(20)
  const required = Array.from(new Set(jobs.flatMap(j => (j.skills?.required || []).map(r => r.name)))).map(name => ({
    name,
    level: Math.round(jobs.reduce((sum,j)=> sum + ((j.skills?.required || []).find(r => r.name === name)?.level || 0), 0) / Math.max(1, jobs.length)),
    importance: 'preferred'
  }))
  const { gaps } = analyzeSkills(userLevels, required)
  const prioritized = prioritizeGapsByImpact(gaps)
  res.json({ success: true, developmentPlan: prioritized, skillAnalysis: gaps })
}

export async function getJobMatches(req, res) {
  const user = await User.findById(req.params.userId)
  if (!user) return res.status(404).json({ success: false, message: 'User not found' })
  const userLevels = Object.fromEntries((user.skills || []).map(s => [s.name, s.selfRating || 0]))
  const jobs = await Job.find({ industry: user.industry }).limit(50)
  const ranked = rankJobs(userLevels, jobs)
  res.json({ success: true, matches: ranked.map(r => ({
    jobId: r.job._id,
    title: r.job.title,
    company: r.job.company,
    fitScore: r.fitScore,
    missingCritical: r.missingCritical
  })) })
}

export async function generateLearningPathController(req, res) {
  const user = await User.findById(req.params.userId)
  if (!user) return res.status(404).json({ success: false, message: 'User not found' })
  const userLevels = Object.fromEntries((user.skills || []).map(s => [s.name, s.selfRating || 0]))
  const jobs = await Job.find({ industry: user.industry }).limit(20)
  const required = Array.from(new Set(jobs.flatMap(j => (j.skills?.required || []).map(r => r.name)))).map(name => ({
    name,
    level: Math.round(jobs.reduce((sum,j)=> sum + ((j.skills?.required || []).find(r => r.name === name)?.level || 0), 0) / Math.max(1, jobs.length)),
    importance: 'preferred'
  }))
  const { gaps } = analyzeSkills(userLevels, required)
  const learning = generateLearningPath(gaps)
  res.json({ success: true, learningPath: learning })
}

export async function getIndustryBenchmarks(req, res) {
  const { industry } = req.params
  const jobs = await Job.find({ industry }).limit(50)
  const skills = {}
  for (const job of jobs) {
    for (const r of (job.skills?.required || [])) {
      skills[r.name] = skills[r.name] || { total: 0, count: 0 }
      skills[r.name].total += r.level
      skills[r.name].count += 1
    }
  }
  const benchmarks = Object.entries(skills).map(([name, v]) => ({ name, avgRequiredLevel: Number((v.total / v.count).toFixed(1)) }))
  res.json({ success: true, industry, benchmarks })
}

export async function getSkillTrends(req, res) {
  const { skillName } = req.params
  // Mock trend data
  res.json({ success: true, skill: skillName, trend: {
    demandIndex: 78,
    growthYoY: 12.4,
    salaryPremiumPct: 8.5,
    forecast12m: 'rising'
  }})
}

