// Gap analysis algorithm
// - answers/self-reported levels are on 1-10 scale
// - deficiency score = (requiredLevel - currentLevel) * importanceWeight
// - importance: critical=1.5, preferred=1.0
export function analyzeSkills(answers, requiredSkills = []) {
  const currentLevels = answers || {}
  const importanceWeight = (importance) => importance === 'critical' ? 1.5 : 1.0
  const gaps = requiredSkills.map(req => {
    const level = Number(currentLevels[req.name] ?? 0)
    const gap = Math.max(0, req.level - level)
    const score = gap * importanceWeight(req.importance)
    return { skill: req.name, required: req.level, current: level, gap, importance: req.importance, score }
  }).sort((a,b)=> b.score - a.score)
  const totalScore = gaps.reduce((s,g)=> s + g.score, 0)
  return { gaps, totalScore }
}

export function prioritizeGapsByImpact(gaps, marketDemand = {}) {
  return gaps.map(g => ({
    ...g,
    impact: g.score * (marketDemand[g.skill]?.demandWeight ?? 1)
  })).sort((a,b)=> b.impact - a.impact)
}

