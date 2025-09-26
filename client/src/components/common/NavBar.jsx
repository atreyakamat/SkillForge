import { Link } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext.jsx'

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuthContext()

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
          SkillForge
        </Link>
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Dashboard
              </Link>
              <Link to="/assessment" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Assessment
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-md">
                  {user?.email}
                </span>
                <button 
                  onClick={logout} 
                  className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-primary-600 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 font-medium transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

