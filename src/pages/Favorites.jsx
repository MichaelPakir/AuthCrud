import React, { useState, useEffect } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
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

  if (loading) return <p>Loading...</p>

  return (
    <div>
      {favorites.length === 0 ? (
        <p>You don't have any favorites yet.</p>
      ) : (
        favorites.map((recipe) => {
          return (
            <div key={recipe.id}>
              <p>{recipe.title}</p>
            </div>
          )
        })
      )}
    </div>
  )
}

export default Favorites
