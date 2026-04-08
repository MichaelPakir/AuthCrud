import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Link } from 'react-router-dom'
import { fetchCategories } from './../services/categoryService'

const Home = () => {
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  if (!categories) return <div>Loading...</div>

  return (
    <section>
      <div>
        <h1>What are you craving?</h1>
      </div>

      <div>
        {categories.map((cat) => (
          <Link>
            <div>{cat.name}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Home
