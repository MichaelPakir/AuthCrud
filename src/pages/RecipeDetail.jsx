import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useParams, Link } from 'react-router-dom'

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  const { id } = useParams()

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeRef = doc(db, 'recipes', id)
        const snapshot = await getDoc(recipeRef)

        if (snapshot.exists()) {
          setRecipe(snapshot.data())
        } else {
          setRecipe(null)
        }
      } catch (error) {
        console.error('Error fetching recipe:', error)
        setRecipe(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '1.2rem',
          color: '#666',
        }}
      >
        <span style={{ marginRight: '0.5rem' }}>🍳</span> Loading recipe...
      </div>
    )
  }

  if (!recipe) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>😕</h2>
        <p>Recipe not found</p>
        <Link to="/" style={{ color: '#ff6b6b', textDecoration: 'none' }}>
          ← Back to home
        </Link>
      </div>
    )
  }

  // Difficulty color coding
  const difficultyColors = {
    easy: '#51cf66',
    medium: '#ffd43b',
    hard: '#ff6b6b',
  }

  return (
    <article
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        animation: 'fadeIn 0.5s ease',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              backgroundColor:
                recipe.categoryName?.toLowerCase() === 'breakfast'
                  ? '#FFE4B5'
                  : recipe.categoryName?.toLowerCase() === 'lunch'
                    ? '#90EE90'
                    : recipe.categoryName?.toLowerCase() === 'dinner'
                      ? '#FFB6C1'
                      : recipe.categoryName?.toLowerCase() === 'dessert'
                        ? '#DDA0DD'
                        : '#E9ECEF',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            {recipe.categoryName}
          </span>

          <span
            style={{
              backgroundColor: difficultyColors[recipe.difficulty] || '#868e96',
              color:
                recipe.difficulty === 'easy'
                  ? '#2b8a3e'
                  : recipe.difficulty === 'medium'
                    ? '#e67700'
                    : '#c92a2a',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600',
              textTransform: 'capitalize',
            }}
          >
            {recipe.difficulty}
          </span>
        </div>

        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: '#212529',
            lineHeight: '1.2',
          }}
        >
          {recipe.title}
        </h1>

        <p
          style={{
            fontSize: '1.125rem',
            color: '#495057',
            lineHeight: '1.6',
            marginBottom: '1rem',
          }}
        >
          {recipe.description}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#868e96',
            fontSize: '0.875rem',
          }}
        >
          <span>👤</span>
          <span>By {recipe.authorName}</span>
          <span>•</span>
          <span>
            🕒 {new Date(recipe.createdAt?.toDate()).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Hero Image */}
      {recipe.imageUrl && (
        <div
          style={{
            marginBottom: '2rem',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          }}
        >
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'scale(1.02)')
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
      )}

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⏱️</div>
          <div style={{ fontSize: '0.875rem', color: '#868e96' }}>
            Prep Time
          </div>
          <div style={{ fontWeight: 'bold', color: '#212529' }}>
            {recipe.prepTime} min
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🔥</div>
          <div style={{ fontSize: '0.875rem', color: '#868e96' }}>
            Cook Time
          </div>
          <div style={{ fontWeight: 'bold', color: '#212529' }}>
            {recipe.cookTime} min
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🍽️</div>
          <div style={{ fontSize: '0.875rem', color: '#868e96' }}>Servings</div>
          <div style={{ fontWeight: 'bold', color: '#212529' }}>
            {recipe.servings}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⚡</div>
          <div style={{ fontSize: '0.875rem', color: '#868e96' }}>Total</div>
          <div style={{ fontWeight: 'bold', color: '#212529' }}>
            {recipe.prepTime + recipe.cookTime} min
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <section style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>🥘</span> Ingredients
        </h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            display: 'grid',
            gap: '0.75rem',
          }}
        >
          {recipe.ingredients?.map((ing, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ color: '#495057' }}>{ing}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Instructions */}
      <section>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>👨‍🍳</span> Instructions
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {recipe.instructions?.map((inst, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '1.25rem',
                backgroundColor: '#fff',
                borderRadius: '12px',
                borderLeft: '4px solid #ff6b6b',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#ff6b6b',
                  lineHeight: 1,
                }}
              >
                {i + 1}
              </span>
              <p
                style={{
                  margin: 0,
                  color: '#495057',
                  lineHeight: '1.6',
                  flex: 1,
                }}
              >
                {inst}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Back Button */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ff6b6b',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fa5252'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff6b6b'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          ← Back to Recipes
        </Link>
      </div>
    </article>
  )
}

export default RecipeDetail
