import { BarChart3, LayoutGrid, Settings, ShieldCheck, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutGrid },
  { to: '/assessment', label: 'Assess Skills', icon: ShieldCheck },
  { to: '/dashboard/peers', label: 'Peer Reviews', icon: Users },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="bg-white border-r h-full p-3 hidden md:block w-60 sticky top-14">
      <nav className="space-y-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100 font-medium' : ''}`}>
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}


