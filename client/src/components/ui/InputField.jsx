export default function InputField({ label, type = 'text', error, success = false, required = false, hint, prefix, suffix, className = '', ...props }) {
  const base = 'input-base'
  const state = error ? 'input-error' : success ? 'input-success' : 'input-default'
  return (
    <div className={className}>
      {label && (
        <label className="input-label">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="flex items-stretch gap-2">
        {prefix && <span className="inline-flex items-center px-2 rounded border bg-gray-50 text-gray-600">{prefix}</span>}
        {type === 'textarea' ? (
          <textarea className={`${base} ${state} flex-1`} {...props} />
        ) : type === 'select' ? (
          <select className={`${base} ${state} flex-1`} {...props} />
        ) : (
          <input type={type} className={`${base} ${state} flex-1`} {...props} />
        )}
        {suffix && <span className="inline-flex items-center px-2 rounded border bg-gray-50 text-gray-600">{suffix}</span>}
      </div>
      {hint && <div className="input-hint">{hint}</div>}
      {error && <div className="input-error-text">{error}</div>}
    </div>
  )
}


