export default function ActivityTimeline({ items = [], className = '' }) {
  return (
    <div className={`card ${className}`}>
      <ul className="relative pl-6">
        {items.map((it, idx) => (
          <li key={idx} className="mb-4 last:mb-0">
            <div className="absolute left-2 top-1.5 h-full w-px bg-gray-200 last:hidden" />
            <div className="absolute left-0 top-1 h-2 w-2 rounded-full bg-brand" />
            <div className="text-sm font-medium">{it.title}</div>
            {it.description && <div className="text-sm text-gray-600">{it.description}</div>}
            {it.time && <div className="text-xs text-gray-500 mt-1">{it.time}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}
