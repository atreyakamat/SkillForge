import { useState, useEffect } from 'react'

const labels = ['1 - Novice','2 - Beginner','3','4 - Basic','5 - Intermediate','6','7 - Proficient','8','9 - Advanced','10 - Expert']

export default function SkillRating({ name, initial = 0, previous = 0, onChange, onDelete, showDelete = false, isCustom = false, onRemoveCustom }) {
  const [value, setValue] = useState(initial)
  const [confidence, setConfidence] = useState('Medium')
  const [evidence, setEvidence] = useState('')

  // Reset form when initial value changes (e.g., when skill is deleted)
  useEffect(() => {
    setValue(initial)
    if (initial === 0) {
      setConfidence('Medium')
      setEvidence('')
    }
  }, [initial])

  const handle = (v) => {
    setValue(v)
    // Don't call onChange here, let the confidence and evidence handlers do it
  }
  
  const handleConfidenceChange = (newConfidence) => {
    console.log(`SkillRating ${name}: handleConfidenceChange called with ${newConfidence}`)
    setConfidence(newConfidence)
    const ratingData = { value, confidence: newConfidence, evidence }
    console.log(`SkillRating ${name}: calling onChange with:`, ratingData)
    onChange?.(ratingData)
  }
  
  const handleEvidenceChange = (newEvidence) => {
    console.log(`SkillRating ${name}: handleEvidenceChange called with ${newEvidence}`)
    setEvidence(newEvidence)
    const ratingData = { value, confidence, evidence: newEvidence }
    console.log(`SkillRating ${name}: calling onChange with:`, ratingData)
    onChange?.(ratingData)
  }
  
  const handleValueChange = (newValue) => {
    console.log(`SkillRating ${name}: handleValueChange called with value ${newValue}`)
    setValue(newValue)
    const ratingData = { value: newValue, confidence, evidence }
    console.log(`SkillRating ${name}: calling onChange with:`, ratingData)
    onChange?.(ratingData)
  }

  const confidenceClasses = {
    Low: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    High: 'bg-green-100 text-green-700'
  }

  return (
    <div className="bg-white border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium flex items-center gap-2">
          {name}
          {isCustom && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Custom</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-600">Prev: {previous || '—'}</div>
          {isCustom && onRemoveCustom && (
            <button 
              onClick={onRemoveCustom}
              className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
              title="Remove this custom skill"
            >
              ✕ Remove
            </button>
          )}
          {showDelete && onDelete && !isCustom && (
            <button 
              onClick={() => onDelete(name)}
              className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
              title="Remove this skill rating"
            >
              ✕ Delete
            </button>
          )}
        </div>
      </div>
      <input type="range" min="1" max="10" value={value} onChange={(e)=>handleValueChange(Number(e.target.value))} className="w-full" />
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-700">{labels[value-1] || 'Rate 1-10'}</div>
        <span className={`px-2 py-0.5 rounded text-xs ${confidenceClasses[confidence]}`}>{confidence}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <label className="inline-flex items-center gap-1"><input type="radio" name={`${name}-conf`} checked={confidence==='Low'} onChange={()=>handleConfidenceChange('Low')} /> Low</label>
        <label className="inline-flex items-center gap-1"><input type="radio" name={`${name}-conf`} checked={confidence==='Medium'} onChange={()=>handleConfidenceChange('Medium')} /> Medium</label>
        <label className="inline-flex items-center gap-1"><input type="radio" name={`${name}-conf`} checked={confidence==='High'} onChange={()=>handleConfidenceChange('High')} /> High</label>
      </div>
      <div>
        <label className="block text-sm mb-1">Evidence</label>
        <textarea className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Describe projects, experience, or outcomes"
          value={evidence} onChange={(e)=>handleEvidenceChange(e.target.value)} />
      </div>
    </div>
  )
}


