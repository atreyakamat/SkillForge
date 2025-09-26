import User from '../models/User.js'
import Assessment from '../models/Assessment.js'

function scoreCandidate(candidate, targetSkills, userIndustry) {
  const skills = (candidate.skills || []).map(s => (typeof s === 'string' ? s : s.name)).filter(Boolean)
  const overlap = skills.filter(s => targetSkills.includes(s)).length
  const overlapScore = Math.min(overlap / Math.max(targetSkills.length, 1), 1) * 0.5
  const industryScore = candidate.industry && userIndustry && candidate.industry === userIndustry ? 0.2 : 0
  const experienceScore = Math.min((candidate.experience || 0) / 10, 1) * 0.3
  return overlapScore + industryScore + experienceScore
}

export async function suggestReviewers(userId, targetSkills = []) {
  const me = await User.findById(userId).lean()
  const candidates = await User.find({ _id: { $ne: userId } }).lean()
  const scored = candidates
    .map(c => ({ user: c, score: scoreCandidate(c, targetSkills, me?.industry) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
  return scored.map(s => ({ id: s.user._id, name: s.user.name, email: s.user.email, score: Math.round(s.score * 100) / 100 }))
}


