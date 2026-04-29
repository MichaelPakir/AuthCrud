import { HeartIcon } from '@heroicons/react/16/solid'
import React from 'react'

const FavoriteToggle = () => {
  const handleToggleButton = () => {
    console.log('Toggled')
  }
  return (
    <div>
      <button onClick={handleToggleButton}>
        <HeartIcon className="h-6 w-6 text-gray-700" />
      </button>
    </div>
  )
}

export default FavoriteToggle
