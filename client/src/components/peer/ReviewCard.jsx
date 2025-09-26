export default function ReviewCard({ review }) {
  const { forUser, skills = [], anonymous, comments, confidence, ts } = review
  return (
    <div className="bg-white border rounded-xl p-4 hover:shadow-sm transition">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{anonymous ? 'Anonymous' : (forUser?.name || 'Colleague')}</div>
        <div className="text-xs text-gray-500">{new Date(ts).toLocaleString()}</div>
      </div>
      <div className="mt-3 space-y-2">
        {skills.map(s => (
          <div key={s.name} className="text-sm flex items-center justify-between">
            <span>{s.name}</span>
            <span className="text-gray-600">Self {s.self}/10 → Peer {s.peer}/10</span>
          </div>
        ))}
      </div>
      {comments && <p className="mt-3 text-sm text-gray-700">{comments}</p>}
      <div className="mt-3 text-xs text-gray-600">Confidence: {confidence || '—'}</div>
      <div className="mt-3 flex gap-2">
        <button className="px-3 py-1 rounded border text-sm">Helpful</button>
        <button className="px-3 py-1 rounded border text-sm">Not helpful</button>
        <button className="px-3 py-1 rounded bg-primary-600 text-white text-sm">Say thanks</button>
      </div>
    </div>
  )
}


