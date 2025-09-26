import { useState } from 'react'
import { usePeerReview } from '../../contexts/PeerReviewContext.jsx'

export default function ReviewRequest() {
  const { sendRequest } = usePeerReview()
  const [emails, setEmails] = useState('')
  const [skills, setSkills] = useState('JavaScript, React')
  const [message, setMessage] = useState('Could you review my recent progress?')
  const [deadline, setDeadline] = useState('')

  function submit() {
    const to = emails.split(',').map(e => ({ email: e.trim() })).filter(x => x.email)
    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean)
    for (const person of to) {
      sendRequest({ to: person, skills: skillList, message, deadline })
    }
    alert('Review request(s) sent')
    setEmails('')
  }

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="font-semibold mb-3">Request Peer Review</div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Emails (comma separated)</label>
          <input className="w-full border rounded px-3 py-2" value={emails} onChange={(e)=>setEmails(e.target.value)} placeholder="a@x.com, b@y.com" />
        </div>
        <div>
          <label className="block text-sm mb-1">Skills to review</label>
          <input className="w-full border rounded px-3 py-2" value={skills} onChange={(e)=>setSkills(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Personal message</label>
          <textarea className="w-full border rounded px-3 py-2" rows={3} value={message} onChange={(e)=>setMessage(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Deadline</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={deadline} onChange={(e)=>setDeadline(e.target.value)} />
        </div>
      </div>
      <div className="mt-3">
        <button className="px-4 py-2 rounded bg-secondary-600 text-white" onClick={submit}>Send Request</button>
      </div>
    </div>
  )
}


