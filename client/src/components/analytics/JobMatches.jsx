function fitPercent(req = [], you = []) {
  const overlap = req.filter(r => you.includes(r)).length
  return Math.round((overlap / Math.max(1, req.length)) * 100)
}

export default function JobMatches({ jobs = [], mySkills = ['JavaScript','React','Node'] }) {
  if (jobs.length === 0) {
    jobs = [
      { id: '1', title: 'Frontend Engineer', company: 'Acme', required: ['JavaScript','React','CSS'] },
      { id: '2', title: 'Fullstack Engineer', company: 'Globex', required: ['Node','React','SQL'] },
    ]
  }
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="font-semibold mb-3">Job Matches</div>
      <div className="grid sm:grid-cols-2 gap-3">
        {jobs.map(j => {
          const pct = fitPercent(j.required, mySkills)
          const gaps = j.required.filter(s => !mySkills.includes(s))
          return (
            <div key={j.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{j.title}</div>
                  <div className="text-sm text-gray-600">{j.company}</div>
                </div>
                <div className="text-primary-700 font-semibold">{pct}% match</div>
              </div>
              <div className="mt-2 text-sm"><span className="text-gray-600">Required:</span> {j.required.join(', ')}</div>
              <div className="text-sm"><span className="text-gray-600">Your skills:</span> {mySkills.join(', ')}</div>
              {gaps.length > 0 && <div className="text-sm text-red-600">Gaps: {gaps.join(', ')}</div>}
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-1 rounded bg-primary-600 text-white text-sm">View & Apply</button>
                <button className="px-3 py-1 rounded border text-sm">Get Learning Plan</button>
                <button className="px-3 py-1 rounded border text-sm">Save</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


