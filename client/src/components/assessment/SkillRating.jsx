import { useState } from 'react'

const labels = ['1 - Novice','2 - Beginner','3','4 - Basic','5 - Intermediate','6','7 - Proficient','8','9 - Advanced','10 - Expert']

export default function SkillRating({ name, initial = 0, previous = 0, onChange }) {
  const [value, setValue] = useState(initial)
  const [confidence, setConfidence] = useState('Medium')
  const [evidence, setEvidence] = useState('')

  const handle = (v) => {
    setValue(v)
    onChange?.({ value: v, confidence, evidence })
  }

  const confidenceClasses = {
    Low: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    High: 'bg-green-100 text-green-700'
  }

  return (
    <div className="bg-white border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-gray-600">Prev: {previous || '—'}</div>
      </div>
      <input type="range" min="1" max="10" value={value} onChange={(e)=>handle(Number(e.target.value))} className="w-full" />
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-700">{labels[value-1] || 'Rate 1-10'}</div>
        <span className={`px-2 py-0.5 rounded text-xs ${confidenceClasses[confidence]}`}>{confidence}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <label className="inline-flex items-center gap-1"><input type="radio" name={`${name}-conf`} checked={confidence==='Low'} onChange={()=>{setConfidence('Low'); onChange?.({ value, confidence: 'Low', evidence })}} /> Low</label>
        <label className="inline-flex items-center gap-1"><input type="radio" name={`${name}-conf`} checked={confidence==='Medium'} onChange={()=>{setConfidence('Medium'); onChange?.({ value, confidence: 'Medium', evidence })}} /> Medium</label>
        <label className="inline-flex items-center gap-1"><input type="radio" name={`${name}-conf`} checked={confidence==='High'} onChange={()=>{setConfidence('High'); onChange?.({ value, confidence: 'High', evidence })}} /> High</label>
      </div>
      <div>
        <label className="block text-sm mb-1">Evidence</label>
        <textarea className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Describe projects, experience, or outcomes"
          value={evidence} onChange={(e)=>{ setEvidence(e.target.value); onChange?.({ value, confidence, evidence: e.target.value }) }} />
      </div>
    </div>
  )
}


