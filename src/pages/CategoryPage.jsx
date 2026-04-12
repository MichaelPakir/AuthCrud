import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import RecipeCard from '../components/RecipeCard'

const CategoryPage = () => {
  const { id: categoryId } = useParams()
  const [recipes, setRecipes] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchRecipesByCategory = async () => {
      if (!categoryId) {
        if (isMounted) {
          setError('No category selected')
          setLoading(false)
        }
        return
      }

      console.log('Searching for categoryId:', categoryId)
      try {
        const q = query(
          collection(db, 'recipes'),
          where('categoryId', '==', categoryId)
        )

        const snapshot = await getDocs(q)

        console.log('Found', snapshot.size, 'recipes')

        if (!isMounted) return

        const recipesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        if (isMounted) {
          setRecipes(recipesData)

          const name =
            recipesData.length > 0 ? recipesData[0].categoryName : categoryId
          setCategoryName(name)
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load recipes')
        }
        console.error(error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchRecipesByCategory()

    return () => {
      isMounted = false
    }
  }, [categoryId])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <span style={{ marginRight: '0.5rem' }}>🍳</span>
        <span>Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#ff6b6b' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>😕</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍽️</h2>
        <p>No recipes found in this category.</p>
        <Link to="/" style={{ color: '#ff6b6b', textDecoration: 'none' }}>
          ← Browse all recipes
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#212529',
        }}
      >
        {categoryName || categoryId}
      </h1>
      <p style={{ color: '#868e96', marginBottom: '2rem' }}>
        {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
      </p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export default CategoryPage
