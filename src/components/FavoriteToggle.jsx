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
  // const { favorites, toggleFavorite } = useContext(ToggleContext)
  const isFavorite = favorites.some((item) => item.id === recipe.id)

  const handleToggleButton = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(recipe)
  }

  return (
    <button
      className="relative z-30"
      type="button"
      aria-label="Toggle favorite"
      onClick={handleToggleButton}
    >
      <HeartIcon
        className={`h-6 w-6 ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
      />
    </button>
  )
}

export default FavoriteToggle
