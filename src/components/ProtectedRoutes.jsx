import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
  const { user } = useAuth()
  return (
    <div>
      <h1>Protected Routes</h1>
      user ? <Outlet /> : <Navigate to="/login" replace />
    </div>
  )
}

export default ProtectedRoutes
