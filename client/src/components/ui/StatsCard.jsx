export default function StatsCard({ title, value, icon, delta, deltaLabel, className = '' }) {
  const positive = typeof delta === 'number' ? delta >= 0 : String(delta || '').startsWith('+')
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center gap-3">
        {icon && <div className="h-10 w-10 rounded-lg grid place-items-center bg-primary-50 text-primary-700">{icon}</div>}
        <div className="flex-1">
          <div className="text-sm text-gray-600">{title}</div>
          <div className="h3">{value}</div>
        </div>
        {typeof delta !== 'undefined' && (
          <div className={`px-2 py-1 rounded text-xs ${positive ? 'bg-success-light text-success-dark' : 'bg-error-light text-error-dark'}`}>{deltaLabel || delta}</div>
        )}
      </div>
    </div>
  )
}


