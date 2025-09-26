export default function InputField({ label, type = 'text', error, required = false, hint, prefix, suffix, className = '', ...props }) {
  const base = 'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500'
  const invalid = error ? 'border-red-500' : 'border-gray-300'
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm mb-1">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="flex items-stretch gap-2">
        {prefix && <span className="inline-flex items-center px-2 rounded border bg-gray-50 text-gray-600">{prefix}</span>}
        {type === 'textarea' ? (
          <textarea className={`${base} ${invalid} flex-1`} {...props} />
        ) : type === 'select' ? (
          <select className={`${base} ${invalid} flex-1`} {...props} />
        ) : (
          <input type={type} className={`${base} ${invalid} flex-1`} {...props} />
        )}
        {suffix && <span className="inline-flex items-center px-2 rounded border bg-gray-50 text-gray-600">{suffix}</span>}
      </div>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  )
}


