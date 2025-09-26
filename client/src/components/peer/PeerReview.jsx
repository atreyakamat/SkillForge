import { useState } from 'react'
import { usePeerReview } from '../../contexts/PeerReviewContext.jsx'

export default function PeerReview() {
  const { submitReview } = usePeerReview()
  const [skills, setSkills] = useState([
    { name: 'JavaScript', self: 7, peer: 7, justification: '' },
    { name: 'React', self: 6, peer: 6, justification: '' },
  ])
  const [anonymous, setAnonymous] = useState(false)
  const [comments, setComments] = useState('')
  const [confidence, setConfidence] = useState('Medium')

  function setPeer(i, v) {
    const next = skills.slice()
    next[i].peer = v
    setSkills(next)
  }

  function setJustification(i, v) {
    const next = skills.slice()
    next[i].justification = v
    setSkills(next)
  }

  function submit() {
    // Enforce justification if delta >= 3
    for (const s of skills) {
      if (Math.abs((s.peer || 0) - (s.self || 0)) >= 3 && !s.justification?.trim()) {
        alert(`Please justify rating difference for ${s.name}`)
        return
      }
    }
    submitReview({ forUser: { name: 'Teammate' }, skills, anonymous, comments, confidence })
    alert('Review submitted')
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-xl p-4">
        <div className="font-semibold mb-3">Peer Review</div>
        <div className="space-y-3">
          {skills.map((s, i) => (
            <div key={s.name} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-600">Self: {s.self}/10</div>
              </div>
              <div className="mt-2">
                <input type="range" min="1" max="10" value={s.peer} onChange={(e)=>setPeer(i, Number(e.target.value))} className="w-full" />
                <div className="text-sm text-gray-700">Peer rating: {s.peer}/10</div>
              </div>
              {Math.abs(s.peer - s.self) >= 3 && (
                <div className="mt-2">
                  <label className="block text-sm mb-1">Justification</label>
                  <textarea className="w-full border rounded px-3 py-2" rows={3} value={s.justification} onChange={(e)=>setJustification(i, e.target.value)} />
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center gap-3 text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={anonymous} onChange={(e)=>setAnonymous(e.target.checked)} /> Submit anonymously</label>
            <select value={confidence} onChange={(e)=>setConfidence(e.target.value)} className="border rounded px-2 py-1">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">General comments</label>
            <textarea className="w-full border rounded px-3 py-2" rows={3} value={comments} onChange={(e)=>setComments(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded bg-primary-600 text-white" onClick={submit}>Submit Review</button>
          </div>
        </div>
      </div>
    </div>
  )
}


