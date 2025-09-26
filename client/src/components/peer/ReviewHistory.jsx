import { useMemo, useState } from 'react'
import { usePeerReview } from '../../contexts/PeerReviewContext.jsx'
import ReviewCard from './ReviewCard.jsx'

export default function ReviewHistory() {
  const { reviews = [] } = usePeerReview()
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      const matchQ = q ? (r.comments?.toLowerCase().includes(q.toLowerCase())) : true
      return matchQ
    })
  }, [reviews, q, status])

  return (
    <div className="bg-white border rounded-xl p-4 space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="font-semibold">Review History</div>
        <select className="border rounded px-2 py-1 text-sm" value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="received">Received</option>
          <option value="given">Given</option>
        </select>
        <input className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Search comments..." value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(rv => <ReviewCard key={rv.id} review={rv} />)}
      </div>
      {filtered.length === 0 && <div className="text-sm text-gray-600">No reviews to display.</div>}
    </div>
  )
}


