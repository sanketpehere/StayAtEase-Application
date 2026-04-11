import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function OwnerProtectedRoute({ children }) {
  const { user, role, loading } = useAuth()

  if (loading) return null

  if (!user || role !== 'HOTEL_OWNER') {
    return <Navigate to="/auth" replace />
  }

  return children
}