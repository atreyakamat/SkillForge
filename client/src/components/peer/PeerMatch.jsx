import { useMemo } from 'react'

export default function PeerMatch({ mySkills = ['JavaScript','React'], colleagues = [] }) {
  if (colleagues.length === 0) {
    colleagues = [
      { id: '1', name: 'Alex', skills: ['React','Node.js'] },
      { id: '2', name: 'Sam', skills: ['UX','JavaScript'] },
      { id: '3', name: 'Jamie', skills: ['Data','Python'] },
    ]
  }

  const suggestions = useMemo(() => {
    return colleagues.map(c => ({
      ...c,
      overlap: c.skills.filter(s => mySkills.includes(s)).length
    })).sort((a,b)=>b.overlap-a.overlap)
  }, [colleagues, mySkills])

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="font-semibold mb-3">Suggested Reviewers</div>
      <div className="grid sm:grid-cols-2 gap-3">
        {suggestions.map(s => (
          <div key={s.id} className="border rounded-lg p-3">
            <div className="font-medium">{s.name}</div>
            <div className="text-sm text-gray-600">Overlap: {s.overlap}</div>
            <div className="mt-2 text-xs text-gray-600">Skills: {s.skills.join(', ')}</div>
            <button className="mt-2 px-3 py-1 rounded bg-primary-600 text-white text-sm">Request Review</button>
          </div>
        ))}
      </div>
    </div>
  )
}


