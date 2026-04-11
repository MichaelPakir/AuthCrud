import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

const MyRecipes = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [authChecked, setAuthChecked] = useState(false)
  const { id } = useParams()

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
    // Trigger useEffect by toggling a state or just reload page
    // For now, simple page reload:
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
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {recipe.imageUrl && (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>

              <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded mb-2">
                {recipe.categoryName || 'Uncategorized'}
              </span>

              <div className="text-sm text-gray-600 mb-4">
                Prep: {recipe.prepTime}m | Cook: {recipe.cookTime}m
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  View
                </button>
                <Link></Link>
                <button
                  onClick={() => navigate(`/edit/${recipe.id}`)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MyRecipes
