export default function ProgressBar({ value = 0, className = '' }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <div className="h-full bg-primary-500 transition-all duration-200" style={{ width: `${pct}%` }} />
    </div>
  )
}


