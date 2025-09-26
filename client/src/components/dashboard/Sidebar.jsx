import { BarChart3, LayoutGrid, Settings, ShieldCheck, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutGrid },
  { to: '/skills', label: 'My Skills', icon: LayoutGrid },
  { to: '/assessment', label: 'Assess Skills', icon: ShieldCheck },
  { to: '/dashboard/peers', label: 'Peer Reviews', icon: Users },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ mobile = false, onNavigate, className = '' }) {
  const containerClass = mobile ? 'block w-full' : 'hidden md:block w-[280px]'
  return (
    <aside className={`bg-white border-r h-full p-3 sticky ${mobile ? 'top-0' : 'top-16'} ${containerClass} ${className}`}>
      <nav className="space-y-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100 font-medium' : ''}`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}


