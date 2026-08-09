import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Role } from '@/types'
import { useAuth } from '@/context/AuthContext'

interface RoleProtectedRouteProps {
  allowedRoles?: Role[]
}

export function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
