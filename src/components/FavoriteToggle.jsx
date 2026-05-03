import { HeartIcon } from '@heroicons/react/16/solid'
import React, { useContext } from 'react'
import { ToggleContext } from '../contexts/ToggleFavContext'

const FavoriteToggle = ({ recipe }) => {
  const context = useContext(ToggleContext)

  if (!context) {
    throw new Error(
      'FavoriteToggle must be used within ToggleFavContext provider'
    )
  }

  const { favorites, toggleFavorite } = context

  // ✅ FIX: favorites is an array of IDs
  const isFavorite = favorites.includes(recipe.id)

  const handleToggleButton = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(recipe)
  }

  return (
    <button
      type="button"
      aria-label="Toggle favorite"
      onClick={handleToggleButton}
      className="relative z-30"
    >
      <HeartIcon
        className={`h-6 w-6 transition-colors duration-200 ${
          isFavorite ? 'text-red-500' : 'text-gray-500'
        }`}
      />
    </button>
  )
}

export default FavoriteToggle
