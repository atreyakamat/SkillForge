import { BarChart3, LayoutGrid, Settings, ShieldCheck, Users, Calendar, TrendingUp, Lightbulb } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import MiniSkillCards from './MiniSkillCards.jsx'

const nav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutGrid },
  { to: '/skills', label: 'My Skills', icon: LayoutGrid },
  { to: '/assessment', label: 'Assess Skills', icon: ShieldCheck },
  { to: '/schedule', label: 'Schedule Maker', icon: Calendar },
  { to: '/progress', label: 'Progress Tracker', icon: TrendingUp },
  { to: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  { to: '/peer/request', label: 'Peer Reviews', icon: Users },
  { to: '/gap-jobs', label: 'Analytics', icon: BarChart3 },
  { to: '/profile', label: 'Settings', icon: Settings },
]

export default function Sidebar({ mobile = false, onNavigate, className = '' }) {
  const containerClass = mobile ? 'block w-full' : 'hidden md:block w-[320px]'
  return (
    <aside className={`bg-white border-r h-full p-3 sticky ${mobile ? 'top-0' : 'top-16'} ${containerClass} ${className} overflow-y-auto`}>
      {/* Navigation */}
      <nav className="space-y-1 mb-6">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded transition-all duration-200 hover:bg-gray-100 hover:scale-105 ${isActive ? 'bg-blue-50 border-r-2 border-blue-500 font-medium text-blue-700' : 'text-gray-700'} ${
              ['/schedule', '/progress', '/recommendations'].includes(to) ? 'magical-glow-subtle' : ''
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Mini Skill Cards */}
      <div className="px-1">
        <MiniSkillCards />
      </div>
    </aside>
  )
}


