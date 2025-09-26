export default function CircularProgress({ value = 0, size = 80, stroke = 8, className = '' }) {
  const pct = Math.max(0, Math.min(100, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className={`inline-grid place-items-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} role="img" aria-label={`${pct}%`}>
        <circle cx={size/2} cy={size/2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
        <circle
          cx={size/2}
          cy={size/2}
          r={r}
          stroke="#3b82f6"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      <div className="absolute text-sm font-medium">{pct}%</div>
    </div>
  )
}


