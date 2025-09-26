import { Link } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuthContext()

  return (
    <header className="bg-white border-b">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-blue-600">SkillForge</Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/assessment" className="hover:underline">Assessment</Link>
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

