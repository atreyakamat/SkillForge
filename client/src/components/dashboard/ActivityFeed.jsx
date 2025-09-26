export default function ActivityFeed({ items = [] }) {
  if (items.length === 0) {
    items = [
      { id: 1, text: 'Completed React assessment', time: '2h ago' },
      { id: 2, text: 'Received 3 peer reviews', time: '1d ago' },
      { id: 3, text: 'Improved JavaScript proficiency', time: '3d ago' },
    ]
  }
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="font-semibold mb-3">Recent Activity</div>
      <ul className="space-y-3">
        {items.map(i => (
          <li key={i.id} className="flex items-center justify-between text-sm">
            <span>{i.text}</span>
            <span className="text-gray-500">{i.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}


