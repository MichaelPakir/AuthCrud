import React from 'react'
import { Link } from 'react-router-dom'

const RecipeCard = ({ recipe }) => {
  const difficultyColors = {
    easy: '#e6fcf5',
    medium: '#fff9db',
    hard: '#ffe3e3',
  }

  const difficultyTextColor = {
    easy: 'black',
    medium: 'black',
    hard: 'white',
  }
  return (
    <Link to={`/recipe/${recipe.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Image */}
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

        {/* Content */}
        <div className="p-6 flex flex-col">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Category */}
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: recipe.categoryColor || '#f0f0f0',
              }}
            >
              {recipe.categoryName}
            </div>

            {/* Difficulty */}
            <span
              style={{
                backgroundColor:
                  difficultyColors[recipe.difficulty] || '#868e96',
                color: difficultyTextColor[recipe.difficulty] || 'black',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'capitalize',
              }}
            >
              {recipe.difficulty}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug">
            {recipe.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {recipe.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
            <span>🍽️ {recipe.servings} servings</span>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-gray-200 my-4"></div>

          {/* Author */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            By {recipe.authorName || 'Unknown'}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard
