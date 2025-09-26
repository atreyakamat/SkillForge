export function generateLearningPath(gaps = []) {
  const ordered = gaps.filter(g => g.gap > 0).sort((a,b)=> b.score - a.score)
  return ordered.map((g, idx) => ({
    step: idx + 1,
    skill: g.skill,
    recommendation: `Focus on ${g.skill} to reach level ${g.required}.`,
    resources: [
      { type: 'course', title: `${g.skill} Fundamentals`, url: 'https://example.com/course' },
      { type: 'project', title: `Build a ${g.skill} mini project`, url: 'https://example.com/project' }
    ],
    estimatedTimeWeeks: Math.max(1, Math.ceil(g.gap / 2)),
    difficulty: g.importance === 'critical' ? 'high' : 'medium'
  }))
}

