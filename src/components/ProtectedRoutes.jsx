import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoutes = () => {
  const { user, loading } = useAuth()

  if (loading) return <p>Loading...</p>

  if (!user) return <Navigate to={'/'} replace />

  return <Outlet />
}

export default ProtectedRoutes
