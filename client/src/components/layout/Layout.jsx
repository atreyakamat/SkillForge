import { useEffect, useState } from 'react'
import Header from '../dashboard/Header.jsx'
import Sidebar from '../dashboard/Sidebar.jsx'
import Footer from '../ui/Footer.jsx'

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-[240px,1fr] gap-6 mt-6">
        <Sidebar />
        <div>
          <div className="flex justify-end">
            <button className="px-3 py-1 rounded border text-sm" onClick={()=>setTheme(t=>t==='light'?'dark':'light')}>{theme==='light'?'Dark':'Light'} mode</button>
          </div>
          <main className="mt-3">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  )
}


