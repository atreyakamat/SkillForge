// Very simple placeholder algorithm that compares answers to a target level
export function analyzeSkills(answers) {
  const target = 4
  const gaps = Object.entries(answers || {}).map(([skill, level]) => ({
    skill,
    level: Number(level) || 0,
    gap: Math.max(0, target - (Number(level) || 0))
  }))
  const recommendations = gaps
    .filter(g => g.gap > 0)
    .map(g => ({ skill: g.skill, action: `Study ${g.skill} to reach level ${target}` }))
  return { target, gaps, recommendations }
}

