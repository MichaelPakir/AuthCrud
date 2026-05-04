import React, { useState, useEffect, useContext } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import RecipeCard from './../components/RecipeCard'
import { ToggleContext } from '../contexts/ToggleFavContext'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const { favorites: favoriteIds } = useContext(ToggleContext)
  const [loading, setLoading] = useState(true)

  const fetchFavorites = async () => {
    setLoading(true)

    try {
      const user = auth.currentUser

      if (!user) {
        setFavorites([])
        setLoading(false)
        return
      }

      const favRef = collection(db, 'users', user.uid, 'favorites')
      const favSnap = await getDocs(favRef)

      const recipeIds = favSnap.docs.map((doc) => doc.id)

      const recipePromises = recipeIds.map(async (id) => {
        const recipeRef = doc(db, 'recipes', id)
        const recipeSnap = await getDoc(recipeRef)

        if (recipeSnap.exists()) {
          return { id: recipeSnap.id, ...recipeSnap.data() }
        }

        return null
      })

      const recipes = await Promise.all(recipePromises)

      setFavorites(recipes.filter((r) => r !== null))
    } catch (error) {
      console.error('Error fetching favorites:', error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  useEffect(() => {
    fetchFavorites()
    setFavorites((prev) =>
      prev.filter((recipe) => favoriteIds.includes(recipe.id))
    )
  }, [favoriteIds])

  if (loading) return <p>Loading...</p>

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.length === 0 ? (
          <p className="text-1xl  mb-6">You don't have any favorites yet.</p>
        ) : (
          favorites.map((recipe) => {
            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onUnfavorite={(id) => {
                  setFavorites((prev) => prev.filter((r) => r.id !== id))
                }}
              />
            )
          })
        )}
      </div>
    </section>
  )
}

export default Favorites
