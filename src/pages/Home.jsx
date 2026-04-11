import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { fetchCategories } from '../services/categoryService'

const Home = () => {
  const [categories, setCategories] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [loadingRecipes, setLoadingRecipes] = useState(true)

  useEffect(() => {
    fetchCategories().then(setCategories)

    const fetchRecipes = async () => {
      try {
        const q = query(
          collection(db, 'recipes'),
          orderBy('createdAt', 'desc'),
          limit(12)
        )
        const snapshot = await getDocs(q)
        const recipesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setRecipes(recipesData)
      } catch (error) {
        console.error('Error fetching recipes:', error)
      } finally {
        setLoadingRecipes(false)
      }
    }

    fetchRecipes()
  }, [])

  if (!categories) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    )
  }

  return (
    <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: '#333',
          }}
        >
          What are you craving?
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Choose a category to explore delicious recipes
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${encodeURIComponent(cat.id)}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  backgroundColor: cat.color,
                  height: '150px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                  color: '#333',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    'translateY(-5px) scale(1.02)'
                  e.currentTarget.style.boxShadow =
                    '0 8px 12px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#333',
            textAlign: 'center',
          }}
        >
          Latest Recipes
        </h2>

        {loadingRecipes ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading recipes...
          </div>
        ) : recipes.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '12px',
              color: '#666',
            }}
          >
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              No recipes yet!
            </p>
            <p>Be the first to add a delicious recipe.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipe/${recipe.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow =
                      '0 12px 20px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow =
                      '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  <div
                    style={{
                      height: '180px',
                      backgroundColor: recipe.categoryColor || '#f0f0f0',
                      backgroundImage: recipe.imageUrl
                        ? `url(${recipe.imageUrl})`
                        : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {!recipe.imageUrl && (
                      <span style={{ color: '#999', fontSize: '3rem' }}>
                        🍽️
                      </span>
                    )}
                  </div>

                  {/* Recipe Info */}
                  <div style={{ padding: '1.5rem' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: recipe.categoryColor || '#f0f0f0',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {recipe.categoryName}
                    </div>

                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem',
                        color: '#333',
                        lineHeight: 1.3,
                      }}
                    >
                      {recipe.title}
                    </h3>

                    <p
                      style={{
                        color: '#666',
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                        marginBottom: '1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {recipe.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.85rem',
                        color: '#888',
                      }}
                    >
                      <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                      <span>🍽️ {recipe.servings} servings</span>
                    </div>

                    <div
                      style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        color: '#666',
                      }}
                    >
                      <span>By {recipe.authorName || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Home
