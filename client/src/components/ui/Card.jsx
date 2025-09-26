export default function Card({ title, subtitle, actions, footer, children, hover = true, bordered = true, className = '' }) {
  return (
    <div className={`card ${bordered ? 'border' : ''} ${hover ? '' : 'hover:shadow-none'} ${className}`}>
      {(title || actions || subtitle) && (
        <div className="card-header flex items-start gap-3">
          <div className="flex-1">
            {title && <div className="card-title">{title}</div>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}


