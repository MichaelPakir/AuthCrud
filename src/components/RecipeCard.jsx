import React from 'react'
import { Link } from 'react-router-dom'

const RecipeCard = ({ recipe }) => {
  const difficultyColors = {
    easy: 'bg-green-100',
    medium: 'bg-yellow-100',
    hard: 'bg-red-100',
  }

  const difficultyTextColors = {
    easy: 'text-green-800',
    medium: 'text-yellow-800',
    hard: 'text-red-800',
  }

  const getCategoryColor = (color) => {
    return color || '#f0f0f0'
  }

  return (
    <Link to={`/recipe/${recipe.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div
          className="h-44 bg-gray-100 bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage: recipe.imageUrl
              ? `url(${recipe.imageUrl})`
              : 'none',
          }}
        >
          {!recipe.imageUrl && (
            <span className="text-4xl text-gray-400">🍽️</span>
          )}
        </div>

        <div className="p-6 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: getCategoryColor(recipe.categoryColor),
              }}
            >
              {recipe.categoryName}
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                difficultyColors[recipe.difficulty] || 'bg-gray-400'
              } ${difficultyTextColors[recipe.difficulty] || 'text-gray-800'}`}
            >
              {recipe.difficulty}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug">
            {recipe.title}
          </h3>

          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {recipe.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
            <span>🍽️ {recipe.servings} servings</span>
          </div>

          <div className="w-full border-t border-gray-200 my-4"></div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            By {recipe.authorName || 'Unknown'}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard
