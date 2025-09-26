import { useEffect } from 'react'

export default function Modal({ open, onClose, size = 'md', title, children, footer }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', fullscreen: 'max-w-none w-full h-full' }
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`bg-white rounded-xl w-full ${sizes[size]} max-h-full overflow-auto`}>
          {title && <div className="px-4 py-3 border-b font-semibold">{title}</div>}
          <div className="p-4">{children}</div>
          {footer && <div className="px-4 py-3 border-t bg-gray-50">{footer}</div>}
        </div>
      </div>
    </div>
  )
}


