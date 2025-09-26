import { useEffect, useMemo, useState } from 'react'
import SkillCategory from './SkillCategory.jsx'
import { useNavigate } from 'react-router-dom'

const DRAFT_KEY = 'sf_self_assessment_draft'

const DEFAULT_CATEGORIES = [
  { title: 'Technical', color: 'primary', skills: [{ id: 'js', name: 'JavaScript', previous: 6 }, { id: 'react', name: 'React', previous: 5 }] },
  { title: 'Soft Skills', color: 'secondary', skills: [{ id: 'comm', name: 'Communication', previous: 7 }, { id: 'lead', name: 'Leadership', previous: 4 }] },
  { title: 'Domain Knowledge', color: 'accent', skills: [{ id: 'domain', name: 'Business Domain', previous: 5 }] },
]

export default function SelfAssessment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // per category
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setAnswers(parsed.answers || {})
        setStep(parsed.step || 0)
        setCategories(parsed.categories || DEFAULT_CATEGORIES)
      }
    } catch {}
  }, [])

  useEffect(() => {
    setSaving(true)
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, answers, categories }))
      } catch {}
      setSaving(false)
    }, 500)
    return () => clearTimeout(t)
  }, [step, answers, categories])

  const progress = useMemo(() => {
    const total = categories.reduce((acc, c) => acc + c.skills.length, 0)
    const filled = Object.keys(answers).length
    return Math.round((filled / Math.max(1, total)) * 100)
  }, [answers, categories])

  function handleChange(categoryTitle, skillName, value) {
    setAnswers(prev => ({ ...prev, [`${categoryTitle}:${skillName}`]: value }))
  }

  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, answers, categories })) } catch {}
  }

  async function submit(peer = false) {
    // TODO integrate with backend
    setSubmitted(true)
    setTimeout(() => navigate('/dashboard'), 800)
  }

  const current = categories[step]

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Self Assessment</div>
          <div className="text-sm text-gray-600">{saving ? 'Saving draft…' : 'Draft saved'}</div>
        </div>
        <div className="mt-3 h-2 bg-gray-100 rounded">
          <div className="h-2 bg-primary-600 rounded" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        <SkillCategory title={current.title} color={current.color} skills={current.skills} onChange={handleChange} />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Step {step + 1} of {categories.length}</div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded border" disabled={step===0} onClick={()=>setStep(s=>s-1)}>Back</button>
          <button className="px-4 py-2 rounded border" disabled={step===categories.length-1} onClick={()=>setStep(s=>s+1)}>Next</button>
          <button className="px-4 py-2 rounded bg-gray-100" onClick={saveDraft}>Save Draft</button>
          <button className="px-4 py-2 rounded bg-secondary-600 text-white" onClick={()=>submit(false)}>Submit</button>
          <button className="px-4 py-2 rounded bg-primary-600 text-white" onClick={()=>submit(true)}>Submit for Peer Review</button>
        </div>
      </div>

      {submitted && <div className="text-sm text-green-700">Assessment submitted. Redirecting…</div>}
    </div>
  )
}


