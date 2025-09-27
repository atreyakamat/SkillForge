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
  const containerClass = mobile ? 'block w-full h-full' : 'hidden md:block w-[280px]'
  
  return (
    <aside className={`bg-white border-r border-gray-200 ${mobile ? 'h-full' : 'h-screen'} sticky top-0 ${containerClass} ${className} flex flex-col overflow-hidden`}>
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          Navigation
        </h2>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 group ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                    : 'text-gray-700 hover:text-gray-900'
                } ${
                  ['/schedule', '/progress', '/recommendations'].includes(to) 
                    ? 'magical-glow-subtle' 
                    : ''
                }`
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{label}</span>
              {['/schedule', '/progress', '/recommendations'].includes(to) && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Activity Section */}
        <div className="mt-6 border-t border-gray-100">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Recent Activity
            </h3>
            <MiniSkillCards />
          </div>
        </div>

        {/* Extra spacing for scroll buffer */}
        <div className="h-4"></div>
      </div>

      {/* Footer - Fixed */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          SkillForge v2.0
        </div>
      </div>
    </aside>
  )
}


