import { useMemo, useState } from 'react'

function levelColor(level) {
  if (level >= 4) return 'text-green-600'
  if (level >= 2.5) return 'text-yellow-600'
  return 'text-red-600'
}

export default function SkillOverview({ skills = [] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = useMemo(() => ['All', ...Array.from(new Set(skills.map(s => s.category || 'General')))], [skills])

  const filtered = useMemo(() => {
    return skills.filter(s =>
      (category === 'All' || (s.category || 'General') === category) &&
      (s.name.toLowerCase().includes(query.toLowerCase()))
    )
  }, [skills, query, category])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input className="flex-1 border rounded-lg px-3 py-2" placeholder="Search skills..." value={query} onChange={(e)=>setQuery(e.target.value)} />
        <select className="border rounded-lg px-3 py-2" value={category} onChange={(e)=>setCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <button className="bg-primary-600 text-white rounded-lg px-4">Add Skill</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div key={s.id || s.name} className="bg-white border rounded-xl p-4 hover:shadow-sm transition">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-gray-500">{s.category || 'General'}</div>
              </div>
              <div className={`text-sm font-medium ${levelColor(s.peer || s.self)}`}>{s.level || (s.peer || s.self) >= 4 ? 'Strong' : (s.peer || s.self) >= 2.5 ? 'Developing' : 'Needs work'}</div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="text-sm text-gray-600">Self rating</div>
              <div className="h-2 bg-gray-100 rounded">
                <div className="h-2 bg-primary-500 rounded" style={{ width: `${(s.self || 0) / 5 * 100}%` }} />
              </div>
              <div className="text-sm text-gray-600">Peer rating</div>
              <div className="h-2 bg-gray-100 rounded">
                <div className="h-2 bg-secondary-500 rounded" style={{ width: `${(s.peer || 0) / 5 * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-gray-600">No skills match your filters.</div>
        )}
      </div>
    </div>
  )
}


