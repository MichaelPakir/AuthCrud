import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import RecipeCard from '../components/RecipeCard'

const MyRecipes = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchMyRecipes = async () => {
      const uid = user?.uid

      if (!uid) {
        if (isMounted) {
          setLoading(false)
          setAuthChecked(true)
        }
        return
      }

      try {
        const q = query(
          collection(db, 'recipes'),
          where('authorId', '==', uid),
          orderBy('updatedAt', 'desc')
        )

        const snapshot = await getDocs(q)

        const recipesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        if (isMounted) {
          setRecipes(recipesData)
          setAuthChecked(true)
        }
      } catch (err) {
        console.error(err)
        if (isMounted) {
          if (err.code === 'failed-precondition') {
            setError(
              'This query requires a Firestore index. Check the console for a link to create it.'
            )
          } else {
            setError('Failed to load recipes')
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchMyRecipes()

    return () => {
      isMounted = false
    }
  }, [user])

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    window.location.reload()
  }

  if (loading || !authChecked) {
    return (
      <section className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  if (recipes.length === 0) {
    return (
      <section className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Recipes</h1>
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            You haven't created any recipes yet.
          </p>
          <Link
            to="/create-recipe"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create your first recipe
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Recipes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  )
}

export default MyRecipes
