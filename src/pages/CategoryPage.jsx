import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'

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

  const difficultyColors = {
    easy: '#51cf66',
    medium: '#ffd43b',
    hard: '#ff6b6b',
  }

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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {recipes.map((recipe) => (
          <Link
            to={`/recipe/${recipe.id}`}
            key={recipe.id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              )}

              <div style={{ padding: '1.25rem' }}>
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    color: '#212529',
                  }}
                >
                  {recipe.title}
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#868e96' }}>
                  By {recipe.authorName}
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#495057',
                  }}
                >
                  <span>⏱️ {recipe.prepTime}m</span>
                  <span>🔥 {recipe.cookTime}m</span>
                  <span>🍽️ {recipe.servings}</span>
                </div>

                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '0.75rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    backgroundColor:
                      difficultyColors[recipe.difficulty] || '#868e96',
                    color:
                      recipe.difficulty === 'easy'
                        ? '#2b8a3e'
                        : recipe.difficulty === 'medium'
                          ? '#e67700'
                          : '#c92a2a',
                  }}
                >
                  {recipe.difficulty}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoryPage
