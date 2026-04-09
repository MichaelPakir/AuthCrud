// src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const location = useLocation()
  const { user, loginWithGoogle, logout } = useAuth()

  const isLoginPage = location.pathname === '/login'

  const handleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (error) {
      alert('Login failed!')
    }
  }

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
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 style={{ margin: 0 }}>Rizz</h1>
      </Link>

      <nav>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to={'/add-recipe'}>Add Recipe</Link>
            <Link to={'/favorites'}>Favorites</Link>
            <Link to={'/my-recipes'}>My Recipes</Link>
            <img
              src={user.photoURL}
              alt={user.displayName}
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />

            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          !isLoginPage && (
            <button onClick={handleLogin}>Login with Google</button>
          )
        )}
      </nav>
    </header>
  )
}

export default Header
