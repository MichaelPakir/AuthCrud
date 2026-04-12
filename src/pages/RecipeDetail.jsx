import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const { id } = useParams()

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeRef = doc(db, 'recipes', id)
        const snapshot = await getDoc(recipeRef)

        if (snapshot.exists()) {
          setRecipe(snapshot.data())
        } else {
          setRecipe(null)
        }
      } catch (error) {
        console.error('Error fetching recipe:', error)
        setRecipe(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-lg text-gray-600">
        <span className="mr-2">🍳</span> Loading recipe...
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="text-center py-16 px-8">
        <h2 className="text-3xl mb-4">😕</h2>
        <p>Recipe not found</p>
        <Link to="/" className="text-red-400 no-underline hover:underline">
          ← Back to home
        </Link>
      </div>
    )
  }

  const getCategoryColor = (name) => {
    const lower = name?.toLowerCase()
    if (lower === 'breakfast') return 'bg-orange-200'
    if (lower === 'lunch') return 'bg-green-300'
    if (lower === 'dinner') return 'bg-pink-300'
    if (lower === 'dessert') return 'bg-purple-300'
    return 'bg-gray-200'
  }

  const getDifficultyStyles = (difficulty) => {
    const styles = {
      easy: { bg: 'bg-green-400', text: 'text-green-700' },
      medium: { bg: 'bg-yellow-400', text: 'text-yellow-700' },
      hard: { bg: 'bg-red-400', text: 'text-red-700' },
    }
    return styles[difficulty] || { bg: 'bg-gray-400', text: 'text-gray-700' }
  }

  const diffStyles = getDifficultyStyles(recipe.difficulty)

  return (
    <article className="max-w-3xl mx-auto p-8 animate-fadeIn">
      <div className="mb-8">
        <div className="flex gap-2 mb-4 flex-wrap">
          <span
            className={`${getCategoryColor(
              recipe.categoryName
            )} px-3 py-1 rounded-full text-sm font-semibold`}
          >
            {recipe.categoryName}
          </span>

          <span
            className={`${diffStyles.bg} ${diffStyles.text} px-3 py-1 rounded-full text-sm font-semibold capitalize`}
          >
            {recipe.difficulty}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            {recipe.title}
          </h1>

          {user?.uid === recipe.authorId && (
            <Link to={`/edit/${id}`}>
              <button className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                Edit Recipe
              </button>
            </Link>
          )}
        </div>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          {recipe.description}
        </p>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>👤</span>
          <span>By {recipe.authorName}</span>
          <span>•</span>
          <span>
            🕒 {new Date(recipe.createdAt?.toDate()).toLocaleDateString()}
          </span>
        </div>
      </div>

      {recipe.imageUrl && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-auto block transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4 mb-8 p-6 bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="text-2xl mb-1">⏱️</div>
          <div className="text-sm text-gray-500">Prep Time</div>
          <div className="font-bold text-gray-900">{recipe.prepTime} min</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-sm text-gray-500">Cook Time</div>
          <div className="font-bold text-gray-900">{recipe.cookTime} min</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🍽️</div>
          <div className="text-sm text-gray-500">Servings</div>
          <div className="font-bold text-gray-900">{recipe.servings}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-sm text-gray-500">Total</div>
          <div className="font-bold text-gray-900">
            {recipe.prepTime + recipe.cookTime} min
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>🥘</span> Ingredients
        </h2>
        <ul className="list-none p-0 grid gap-3">
          {recipe.ingredients?.map((ing, i) => (
            <li
              key={i}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:bg-gray-50 hover:translate-x-1"
            >
              <span className="w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-gray-700">{ing}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>👨‍🍳</span> Instructions
        </h2>
        <div className="grid gap-4">
          {recipe.instructions?.map((inst, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 bg-white rounded-xl border-l-4 border-red-400 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-2xl font-bold text-red-400 leading-none">
                {i + 1}
              </span>
              <p className="m-0 text-gray-700 leading-relaxed flex-1">{inst}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-400 text-white no-underline rounded-lg font-semibold transition-all duration-200 hover:bg-red-500 hover:-translate-y-0.5"
        >
          ← Back to Recipes
        </Link>
      </div>
    </article>
  )
}

export default RecipeDetail
