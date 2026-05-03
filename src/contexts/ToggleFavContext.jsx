import { createContext, useState } from 'react'

export const ToggleContext = createContext()

const ToggleFavContext = ({ children }) => {
  const [favorites, setFavorites] = useState([])

  const toggleFavorite = (recipe) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.some((item) => item.id === recipe.id)

      if (exists) {
        return prevFavorites.filter((item) => item.id !== recipe.id)
      } else {
        return [...prevFavorites, recipe]
      }
    })
  }

  return (
    <ToggleContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </ToggleContext.Provider>
  )
}

export default ToggleFavContext
