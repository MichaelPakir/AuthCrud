import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const location = useLocation()
  const { user, loginWithGoogle, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isLoginPage = location.pathname === '/login'

  const handleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (error) {
      alert('Login failed!', error)
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navLinks = [
    { to: '/add-recipe', label: 'Add Recipe' },
    { to: '/favorites', label: 'Favorites' },
    { to: '/my-recipes', label: 'My Recipes' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-gray-300">
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 max-w-7xl mx-auto">
        <Link to="/" className="no-underline text-inherit">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 m-0">
            Great Hall
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-700 hover:text-red-400 font-medium transition-colors duration-200 no-underline"
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'user'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                />
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-400 text-white rounded-lg font-medium hover:bg-red-500 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            !isLoginPage && (
              <button
                onClick={handleLogin}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Login with Google
              </button>
            )
          )}
        </nav>

        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
          {user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'user'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">
                    {user.displayName || 'User'}
                  </span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-400 font-medium rounded-lg transition-colors duration-200 no-underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <button
                onClick={() => {
                  logout()
                  setIsMenuOpen(false)
                }}
                className="mt-2 px-4 py-3 bg-red-400 text-white rounded-lg font-medium hover:bg-red-500 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            !isLoginPage && (
              <button
                onClick={() => {
                  handleLogin()
                  setIsMenuOpen(false)
                }}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Login with Google
              </button>
            )
          )}
        </nav>
      )}
    </header>
  )
}

export default Header
