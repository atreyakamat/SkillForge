export default function QuickStats({ totals = { skills: 12, reviews: 8, gapScore: 72, learningHours: 24 } }) {
  const cards = [
    { label: 'Total Skills', value: totals.skills, color: 'bg-primary-50 text-primary-700' },
    { label: 'Peer Reviews', value: totals.reviews, color: 'bg-secondary-50 text-secondary-700' },
    { label: 'Gap Score', value: `${totals.gapScore}%`, color: 'bg-accent-50 text-accent-700' },
    { label: 'Learning Hours', value: totals.learningHours, color: 'bg-gray-100 text-gray-700' }
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-xl border p-4 bg-white hover:shadow-sm transition`}> 
          <div className="text-xs text-gray-500">{c.label}</div>
          <div className={`mt-1 text-2xl font-semibold ${c.color.split(' ').at(-1)}`}>{c.value}</div>
          <div className={`mt-2 h-1.5 rounded ${c.color.split(' ')[0]}`}></div>
        </div>
      ))}
    </div>
  )
}


