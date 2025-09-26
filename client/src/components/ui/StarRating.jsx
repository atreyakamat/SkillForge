import { useState } from 'react'

export default function StarRating({ value = 0, max = 5, onChange, className = '' }) {
  const [hover, setHover] = useState(0)
  const stars = Array.from({ length: max }, (_, i) => i + 1)
  const active = hover || value
  return (
    <div className={`inline-flex items-center gap-1 ${className}`} role="radiogroup" aria-label="Rating">
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          className={`transition-base focus-ring h-6 w-6 grid place-items-center rounded ${n <= active ? 'text-amber-400' : 'text-gray-300'}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange?.(Math.min(max, (value || 0) + 1))
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange?.(Math.max(1, (value || 1) - 1))
            if (e.key === 'Enter' || e.key === ' ') onChange?.(n)
          }}
          onClick={() => onChange?.(n)}
        >
          ★
        </button>
      ))}
    </div>
  )
}


