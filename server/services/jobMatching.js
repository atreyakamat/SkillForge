// Job matching algorithm
// - Fit% based on covered required skills weighted by importance
// - Penalize for missing critical skills
export function computeJobFit(userSkills = {}, job) {
  const weights = { critical: 2, preferred: 1 }
  const reqs = job.requiredSkills || []
  let achieved = 0
  let total = 0
  let missingCritical = 0
  for (const req of reqs) {
    const w = weights[req.importance] || 1
    total += (req.level * w)
    const userLevel = Number(userSkills[req.name] ?? 0)
    achieved += Math.min(userLevel, req.level) * w
    if (userLevel <= 0 && req.importance === 'critical') missingCritical++
  }
  const base = total > 0 ? (achieved / total) : 0
  const penalty = Math.min(0.3, missingCritical * 0.1)
  const fit = Math.max(0, base - penalty)
  return { fitScore: Number((fit * 100).toFixed(1)), missingCritical }
}

export function rankJobs(userSkills, jobs = []) {
  return jobs.map(job => ({
    job,
    ...computeJobFit(userSkills, job)
  })).sort((a,b)=> b.fitScore - a.fitScore)
}

