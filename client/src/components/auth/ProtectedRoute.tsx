import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading, user } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
