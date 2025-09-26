import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const push = useCallback((toast) => {
    const id = toast.id || Math.random().toString(36).slice(2)
    const t = { id, title: '', message: '', variant: 'default', duration: 3000, ...toast }
    setToasts((prev) => [...prev, t])
    if (t.duration) setTimeout(() => remove(id), t.duration)
    return id
  }, [remove])
  const value = useMemo(() => ({ push, remove }), [push, remove])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed z-50 bottom-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`card border ${
              t.variant === 'success' ? 'border-green-500' :
              t.variant === 'error' ? 'border-red-500' :
              t.variant === 'warning' ? 'border-amber-500' : 'border-gray-200'
            }`}
          >
            <div className="font-medium mb-1">{t.title}</div>
            {t.message && <div className="text-sm text-gray-600">{t.message}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}


