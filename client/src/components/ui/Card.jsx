export default function Card({ title, footer, children, hover = true, bordered = true, className = '' }) {
  return (
    <div className={`rounded-xl ${bordered ? 'border' : ''} ${hover ? 'hover:shadow-sm' : ''} bg-white p-4 ${className}`}>
      {title && <div className="font-semibold mb-2">{title}</div>}
      <div>{children}</div>
      {footer && <div className="mt-3 pt-3 border-t">{footer}</div>}
    </div>
  )
}


