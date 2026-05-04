import { createContext, useEffect, useState } from 'react'
import { doc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

export const ToggleContext = createContext()

const ToggleFavContext = ({ children }) => {
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u || null)
    })

    return () => unsub()
  }, [])

  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }

    const load = async () => {
      const snap = await getDocs(collection(db, 'users', user.uid, 'favorites'))

      setFavorites(snap.docs.map((d) => d.id))
    }

    load()
  }, [user])

  const toggleFavorite = async (recipe) => {
    if (!user) {
      console.warn('No user logged in')
      return
    }

    const favRef = doc(db, 'users', user.uid, 'favorites', recipe.id)

    const isFav = favorites.includes(recipe.id)

    try {
      if (isFav) {
        await deleteDoc(favRef)
        setFavorites((prev) => prev.filter((id) => id !== recipe.id))
      } else {
        await setDoc(favRef, {
          recipeId: recipe.id,
          createdAt: new Date(),
        })

        setFavorites((prev) => [...prev, recipe.id])
      }
    } catch (err) {
      console.error('Favorite toggle failed:', err)
    }
  }

  return (
    <ToggleContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </ToggleContext.Provider>
  )
}

export default ToggleFavContext
