export const categories = [
  { id: 'breakfast', name: 'Breakfast', color: '#FFE4B5', icon: '🍳' },
  { id: 'lunch', name: 'Lunch', color: '#90EE90', icon: '🥗' },
  { id: 'dinner', name: 'Dinner', color: '#FFB6C1', icon: '🍽️' },
  { id: 'dessert', name: 'Dessert', color: '#DDA0DD', icon: '🍰' },
  { id: 'quick&easy', name: 'Quick & Easy', color: '#FFD43B', icon: '⚡' }, // Try & not %26
  { id: 'vegan', name: 'Vegan', color: '#69DB7C', icon: '🥬' },
]

export const getCategoryById = (id) => {
  let found = categories.find((c) => c.id === id)

  if (!found && id.includes('%')) {
    const decodedId = decodeURIComponent(id)
    found = categories.find((c) => c.id === decodedId)
  }

  if (!found) {
    const encodedId = encodeURIComponent(id).replace(/%20/g, '+')
    found = categories.find((c) => c.id === encodedId)
  }

  return found || null
}

export const getCategoryIcon = (id) => getCategoryById(id)?.icon || '🍽️'
export const getCategoryColor = (id) => getCategoryById(id)?.color || '#E9ECEF'
