import { useEffect, useState } from 'react'
import Header from '../dashboard/Header.jsx'
import Sidebar from '../dashboard/Sidebar.jsx'
import Footer from '../ui/Footer.jsx'

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light')
  const [drawerOpen, setDrawerOpen] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header onMenuToggle={() => setDrawerOpen(true)} />

      {/* Mobile Drawer */}
      <div className={`md:hidden fixed inset-0 z-40 ${drawerOpen ? '' : 'pointer-events-none'}`} aria-hidden={!drawerOpen}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          className={`absolute left-0 top-0 h-full w-[280px] bg-white border-r shadow-card transform transition-transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="h-16 px-4 flex items-center justify-between border-b">
            <div className="font-medium">Navigation</div>
            <button className="p-2 rounded hover:bg-gray-100" onClick={() => setDrawerOpen(false)} aria-label="Close menu">✕</button>
          </div>
          <Sidebar onNavigate={() => setDrawerOpen(false)} mobile />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 grid md:[grid-template-columns:280px_1fr] gap-6 mt-8">
        <Sidebar className="hidden md:block" />
        <div>
          <div className="flex justify-end">
            <button className="px-3 py-1 rounded border text-sm" onClick={()=>setTheme(t=>t==='light'?'dark':'light')}>{theme==='light'?'Dark':'Light'} mode</button>
          </div>
          <main className="mt-4">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  )
}


