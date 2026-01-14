import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute() {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth)
  
  // DEBUG LOGS - remove after fix
  console.log('🔒 ProtectedRoute check:', { 
    isAuthenticated, 
    user: user?.name || 'no user', 
    token: token ? 'exists' : 'missing',
    path: window.location.pathname 
  })

  if (!isAuthenticated) {
    console.log('🚫 Not authenticated → redirect /login')
    return <Navigate to="/login" replace />
  }

  console.log('✅ Authenticated → render children')
  return <Outlet />
}
