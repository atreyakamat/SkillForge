export default function HeatMap({ data = [], min = 0, max = 100, className = '' }) {
  const norm = (v) => (Math.min(max, Math.max(min, v)) - min) / Math.max(1, max - min)
  return (
    <div className={`card ${className}`}>
      <div className="grid grid-cols-10 gap-2">
        {data.map((d, i) => {
          const t = norm(d.value)
          // green -> red gradient (for color-blind, add title label)
          const color = t > 0.66 ? 'bg-success' : t > 0.33 ? 'bg-warning' : 'bg-error'
          return <div key={i} className={`h-6 w-6 rounded-sm ${color}`} title={`${d.label}: ${d.value}%`} aria-label={`${d.label} ${d.value} percent`} />
        })}
      </div>
    </div>
  )
}
