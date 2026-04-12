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
    <section className="px-8 py-8 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">
          What are you craving?
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Choose a category to explore delicious recipes
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${encodeURIComponent(cat.id)}`}
              className="no-underline group"
            >
              <div
                className="h-40 rounded-2xl flex flex-col items-center justify-center font-bold text-lg text-gray-800 shadow-md transition-all duration-300 ease-out cursor-pointer hover:-translate-y-2 hover:shadow-xl relative overflow-hidden"
                style={{ backgroundColor: cat.color }}
              >
                {cat.image && (
                  <div
                    className="absolute inset-0 opacity-0 bg-cover bg-center transition-opacity duration-300 group-hover:opacity-20"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />
                )}

                <span className="text-5xl mb-2 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  {cat.icon}
                </span>

                <span className="relative z-10">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Latest Recipes
        </h2>

        {loadingRecipes ? (
          <div className="text-center py-8">Loading recipes...</div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-600">
            <p className="text-xl mb-4">No recipes yet!</p>
            <p>Be the first to add a delicious recipe.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipe/${recipe.id}`}
                className="no-underline text-inherit"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1 hover:shadow-xl">
                  <div
                    className="h-44 bg-gray-100 bg-cover bg-center flex items-center justify-center"
                    style={{
                      backgroundColor: recipe.categoryColor || '#f0f0f0',
                      backgroundImage: recipe.imageUrl
                        ? `url(${recipe.imageUrl})`
                        : 'none',
                    }}
                  >
                    {!recipe.imageUrl && (
                      <span className="text-gray-400 text-5xl">🍽️</span>
                    )}
                  </div>

                  <div className="p-6">
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-gray-800 mb-3"
                      style={{
                        backgroundColor: recipe.categoryColor || '#f0f0f0',
                      }}
                    >
                      {recipe.categoryName}
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-gray-800 leading-tight">
                      {recipe.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                      <span>🍽️ {recipe.servings} servings</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-600">
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
