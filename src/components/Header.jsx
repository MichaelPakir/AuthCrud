import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '2px solid #ccc',
      }}
    >
      <div>
        <h1>Rizz</h1>
      </div>

      <nav>
        {!isLoginPage && (
          <Link to={'/login'}>
            <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Login
            </button>
          </Link>
        )}

        {isLoginPage && (
          <Link to={'/'}>
            <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Logout
            </button>
          </Link>
        )}
      </nav>
    </header>
  )
}

export default Header
