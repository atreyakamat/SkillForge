export default function Recommendations({ items = [] }) {
  if (items.length === 0) {
    items = [
      { id: 'c1', type: 'Course', title: 'Advanced React Patterns', provider: 'Egghead' },
      { id: 'p1', type: 'Project', title: 'Build a Node REST API', provider: 'Project' },
      { id: 'm1', type: 'Mentor', title: 'Frontend mentor match', provider: 'Mentor' },
    ]
  }
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="font-semibold mb-3">Recommendations</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(it => (
          <div key={it.id} className="border rounded-lg p-3">
            <div className="text-xs text-gray-500">{it.type}</div>
            <div className="font-medium">{it.title}</div>
            <div className="text-sm text-gray-600">{it.provider}</div>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 rounded bg-secondary-600 text-white text-sm">Add to Path</button>
              <button className="px-3 py-1 rounded border text-sm">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


