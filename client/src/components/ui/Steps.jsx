export default function Steps({ steps = [], current = 0, onStepClick }) {
  return (
    <ol className="flex items-center gap-4" aria-label="Progress">
      {steps.map((label, idx) => {
        const done = idx < current
        const active = idx === current
        return (
          <li key={label} className="flex items-center gap-2">
            <button
              type="button"
              className={`h-8 w-8 rounded-full grid place-items-center border transition-base focus-ring ${
                done ? 'bg-success text-white border-success' : active ? 'bg-brand text-white border-brand' : 'bg-white text-gray-700 border-gray-300'
              }`}
              aria-current={active ? 'step' : undefined}
              onClick={() => onStepClick?.(idx)}
            >
              {done ? '✓' : idx + 1}
            </button>
            <span className={`text-sm ${active ? 'font-medium' : 'text-gray-600'}`}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
