// src/data/categories.js
export const categories = [
  { id: 'breakfast', name: 'Breakfast', color: '#FFE4B5', icon: '🍳' },
  { id: 'lunch', name: 'Lunch', color: '#90EE90', icon: '🥗' },
  { id: 'dinner', name: 'Dinner', color: '#FFB6C1', icon: '🍽️' },
  { id: 'dessert', name: 'Dessert', color: '#DDA0DD', icon: '🍰' },
  { id: 'quick-easy', name: 'Quick & Easy', color: '#FFD43B', icon: '⚡' },
  { id: 'vegan', name: 'Vegan', color: '#69DB7C', icon: '🥬' },
]

// Helper functions stay the same
export const getCategoryById = (id) =>
  categories.find((c) => c.id === id) || null
export const getCategoryIcon = (id) => getCategoryById(id)?.icon || '🍽️'
export const getCategoryColor = (id) => getCategoryById(id)?.color || '#E9ECEF'
