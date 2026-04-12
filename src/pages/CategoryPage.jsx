import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import RecipeCard from '../components/RecipeCard'
import { getCategoryById, getCategoryIcon } from '../services/categories'

const CategoryPage = () => {
  const { id: categoryId } = useParams()
  const [recipes, setRecipes] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const category = getCategoryById(categoryId)
  const icon = getCategoryIcon(categoryId)

  useEffect(() => {
    let isMounted = true

    const fetchRecipesByCategory = async () => {
      if (!categoryId) {
        if (isMounted) {
          setError('No category selected')
          setLoading(false)
        }
        return
      }

      console.log('Searching for categoryId:', categoryId)
      try {
        const q = query(
          collection(db, 'recipes'),
          where('categoryId', '==', categoryId)
        )

        const snapshot = await getDocs(q)

        console.log('Found', snapshot.size, 'recipes')

        if (!isMounted) return

        const recipesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        if (isMounted) {
          setRecipes(recipesData)

          const name =
            recipesData.length > 0 ? recipesData[0].categoryName : categoryId
          setCategoryName(name)
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load recipes')
        }
        console.error(error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchRecipesByCategory()

    return () => {
      isMounted = false
    }
  }, [categoryId])

  if (loading) {
    return (
      <div className="text-center py-16">
        <span className="mr-2">🍳</span>
        <span>Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-400">
        <h2 className="text-3xl mb-4">😕</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl mb-4">🍽️</h2>
        <p>No recipes found in this category.</p>
        <Link to="/" className="text-red-400 no-underline hover:underline">
          ← Browse all recipes
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div
        className="h-48 rounded-2xl mb-8 flex flex-col items-center justify-center shadow-lg"
        style={{ backgroundColor: category?.color || '#E9ECEF' }}
      >
        <span className="text-6xl mb-2">{icon}</span>
        <h1 className="text-4xl font-bold text-gray-800">
          {categoryName || categoryId}
        </h1>
        <p className="text-gray-600 mt-2 font-medium">
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export default CategoryPage
