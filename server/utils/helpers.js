export function formatApiResponse(success, message, data = {}) {
  return { success, message, ...data }
}

export function calculateAverageRating(selfRating = 0, peerRatings = []) {
  const peerAvg = peerRatings.length ? (peerRatings.reduce((s,r)=> s + (r.rating || 0), 0) / peerRatings.length) : 0
  // weight self 40%, peers 60%
  return Number(((selfRating * 0.4) + (peerAvg * 0.6)).toFixed(2))
}

export function normalizeSkillLevel(value, fromScale = 5, toScale = 10) {
  if (!fromScale || !toScale) return 0
  const clamped = Math.max(0, Math.min(fromScale, Number(value) || 0))
  return Number(((clamped / fromScale) * toScale).toFixed(2))
}

export function calculateSkillGrowth(history = []) {
  // history: [{ date, level }]
  if (!history.length) return { delta: 0, percent: 0 }
  const sorted = [...history].sort((a,b)=> new Date(a.date) - new Date(b.date))
  const start = sorted[0].level || 0
  const end = sorted[sorted.length - 1].level || 0
  const delta = end - start
  const percent = start ? Number(((delta / start) * 100).toFixed(2)) : 0
  return { delta, percent }
}

export function generateSkillMatrix(users = []) {
  // returns { skills: [name], rows: [{ userId, levels: { [skill]: level } }] }
  const skillSet = new Set()
  users.forEach(u => (u.skills || []).forEach(s => skillSet.add(s.name)))
  const skills = Array.from(skillSet)
  const rows = users.map(u => ({
    userId: u._id || u.id,
    levels: Object.fromEntries(skills.map(name => {
      const skill = (u.skills || []).find(s => s.name === name)
      return [name, skill ? (skill.selfRating || 0) : 0]
    }))
  }))
  return { skills, rows }
}

