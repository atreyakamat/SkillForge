import { useState } from 'react'

const labels = ['1 - Novice','2 - Beginner','3','4 - Basic','5 - Intermediate','6','7 - Proficient','8','9 - Advanced','10 - Expert']

export default function SkillRating({ name, initial = 0, previous = 0, onChange }) {
  const [value, setValue] = useState(initial)
  const [confidence, setConfidence] = useState('Medium')
  const [evidence, setEvidence] = useState('')
  const maxChars = 280

  const handle = (v) => {
    setValue(v)
    onChange?.({ value: v, confidence, evidence })
  }

  const confidenceClasses = {
    Low: 'bg-error-light text-error-dark',
    Medium: 'bg-warning-light text-warning-dark',
    High: 'bg-success-light text-success-dark'
  }

  const remaining = Math.max(0, maxChars - evidence.length)

  return (
    <div className="bg-white border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium" id={`${name}-label`}>{name}</div>
        <div className="text-xs text-gray-600">Prev: {previous || '—'}</div>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e)=>handle(Number(e.target.value))}
        className="w-full"
        aria-labelledby={`${name}-label`}
        aria-valuemin={1}
        aria-valuemax={10}
        aria-valuenow={value}
      />
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-700" aria-live="polite">{labels[value-1] || 'Rate 1-10'}</div>
        <span className={`px-2 py-0.5 rounded text-xs ${confidenceClasses[confidence]}`}>{confidence}</span>
      </div>
      <fieldset>
        <legend className="sr-only">Confidence level for {name}</legend>
        <div className="flex items-center gap-2 text-sm">
          <label className="inline-flex items-center gap-1"><input type="radio" name={`${name}-conf`} checked={confidence==='Low'} onChange={()=>{setConfidence('Low'); onChange?.({ value, confidence: 'Low', evidence })}} /> Low</label>
          <label className="inline-flex items-center gap-1"><input type="radio" name={`${name}-conf`} checked={confidence==='Medium'} onChange={()=>{setConfidence('Medium'); onChange?.({ value, confidence: 'Medium', evidence })}} /> Medium</label>
          <label className="inline-flex items-center gap-1"><input type="radio" name={`${name}-conf`} checked={confidence==='High'} onChange={()=>{setConfidence('High'); onChange?.({ value, confidence: 'High', evidence })}} /> High</label>
        </div>
      </fieldset>
      <div>
        <label className="block text-sm mb-1" htmlFor={`${name}-evidence`}>Evidence</label>
        <textarea
          id={`${name}-evidence`}
          className="w-full border rounded-lg px-3 py-2"
          rows={3}
          placeholder="Describe projects, experience, or outcomes"
          maxLength={maxChars}
          aria-describedby={`${name}-evidence-count`}
          value={evidence}
          onChange={(e)=>{ const v = e.target.value; setEvidence(v); onChange?.({ value, confidence, evidence: v }) }}
        />
        <div id={`${name}-evidence-count`} className={`mt-1 text-xs ${remaining < 20 ? 'text-warning-dark' : 'text-gray-500'}`}>{remaining} characters remaining</div>
      </div>
    </div>
  )
}


