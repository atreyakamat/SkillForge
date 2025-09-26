import { Bell, LogOut, User, Menu } from 'lucide-react'
import { useAuthContext } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()

  return (
    <header className="h-16 border-b bg-white sticky top-0 z-10">
      <div className="h-full w-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 rounded hover:bg-gray-100" aria-label="Open menu" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="font-semibold">Dashboard</div>
          <nav className="hidden sm:flex text-sm text-gray-600 gap-2">
            <span>Home</span>
            <span>/</span>
            <span>Overview</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded hover:bg-gray-100" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] leading-none rounded-full px-1">3</span>
          </button>
          <button 
            onClick={() => navigate('/profile')} 
            className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-4 w-4 text-primary-700" />
            </div>
            <div className="hidden sm:block text-sm">
              <div className="font-medium">{user?.name || user?.email || 'User'}</div>
              <div className="text-gray-500">{user?.role || 'Member'}</div>
            </div>
          </button>
          <button onClick={logout} className="p-2 rounded hover:bg-gray-100" aria-label="Logout">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}


