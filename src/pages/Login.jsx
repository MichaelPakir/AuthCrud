import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <section>
      <nav>
        <Link to={'/'}>
          <button>Back</button>
        </Link>
      </nav>

      <h2 className="text-red-500">Login Page - Google Auth Coming Soon</h2>
    </section>
  )
}

export default Login
