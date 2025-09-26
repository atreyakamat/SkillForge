export default function EmptyState({ title, message, action, illustration, className = '' }) {
  return (
    <div className={`card text-center ${className}`}>
      {illustration && <div className="mb-4 flex justify-center">{illustration}</div>}
      {title && <div className="h3 mb-1">{title}</div>}
      {message && <div className="text-gray-500 mb-4">{message}</div>}
      {action}
    </div>
  )
}


