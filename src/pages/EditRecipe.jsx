import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import { uploadImage } from '../services/imageService'
import { fetchCategories } from '../services/categoryService'

const EditRecipe = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'easy',
    ingredients: [''],
    instructions: [''],
    imageUrl: '',
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const difficultyColors = {
    easy: 'bg-green-400',
    medium: 'bg-yellow-400',
    hard: 'bg-red-400',
  }

  const difficultyTextColors = {
    easy: 'text-black',
    medium: 'text-black',
    hard: 'text-white',
  }

  useEffect(() => {
    if (!user) {
      setError('Please log in')
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        const [cats, recipeSnap] = await Promise.all([
          fetchCategories(),
          getDoc(doc(db, 'recipes', id)),
        ])

        setCategories(cats)

        if (!recipeSnap.exists()) {
          setError('Recipe not found')
          return
        }

        const data = recipeSnap.data()

        if (data.authorId !== user.uid) {
          setError('Unauthorized')
          return
        }

        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.categoryId || '',
          prepTime: data.prepTime || '',
          cookTime: data.cookTime || '',
          servings: data.servings || '',
          difficulty: data.difficulty || 'easy',
          ingredients: data.ingredients?.length ? data.ingredients : [''],
          instructions: data.instructions?.length ? data.instructions : [''],
          imageUrl: data.imageUrl || '',
        })
      } catch (err) {
        console.error('Error loading recipe:', err)
        setError('Failed to load recipe')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, user])

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file)
      updateField('imageUrl', url)
    } catch {
      alert('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const updateListItem = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addListItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeListItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const getCategoryColor = (catName) => {
    const name = catName?.toLowerCase()
    if (name === 'breakfast') return 'bg-orange-200'
    if (name === 'lunch') return 'bg-green-300'
    if (name === 'dinner') return 'bg-pink-300'
    if (name === 'dessert') return 'bg-purple-300'
    return 'bg-gray-200'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.category) {
      alert('Please fill in title and category')
      return
    }

    setSaving(true)
    try {
      await updateDoc(doc(db, 'recipes', id), {
        title: formData.title,
        description: formData.description,
        categoryId: formData.category,
        categoryName:
          categories.find((c) => c.id === formData.category)?.name ||
          formData.category,
        prepTime: Math.max(0, Number(formData.prepTime) || 0),
        cookTime: Math.max(0, Number(formData.cookTime) || 0),
        servings: Math.max(1, Number(formData.servings) || 1),
        difficulty: formData.difficulty,
        ingredients: formData.ingredients.filter((i) => i.trim()),
        instructions: formData.instructions.filter((i) => i.trim()),
        imageUrl: formData.imageUrl,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        updatedAt: new Date(),
      })

      navigate(`/recipe/${id}`)
    } catch (err) {
      console.error('Save error:', err)
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-lg text-gray-600">
        <span className="mr-2">🍳</span> Loading recipe...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 px-8">
        <h2 className="text-3xl mb-4">😕</h2>
        <p>{error}</p>
        <Link to="/" className="text-red-400 no-underline hover:underline">
          ← Back to home
        </Link>
      </div>
    )
  }

  const {
    title,
    description,
    category,
    difficulty,
    ingredients,
    instructions,
    imageUrl,
  } = formData

  const selectedCategoryName = categories.find((c) => c.id === category)?.name

  return (
    <article className="max-w-3xl mx-auto p-8 animate-fadeIn">
      <div className="mb-8">
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="bg-red-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ✏️ Edit Mode
          </span>

          {selectedCategoryName && (
            <span
              className={`${getCategoryColor(
                selectedCategoryName
              )} px-3 py-1 rounded-full text-sm font-semibold`}
            >
              {selectedCategoryName}
            </span>
          )}

          <span
            className={`${difficultyColors[difficulty]} ${
              difficultyTextColors[difficulty]
            } px-3 py-1 rounded-full text-sm font-semibold capitalize`}
          >
            {difficulty}
          </span>
        </div>

        <h1 className="text-4xl font-bold mb-2 text-gray-900 leading-tight">
          Edit Recipe
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="p-5 bg-white rounded-xl border-l-4 border-red-400 shadow-sm">
          <label className="block font-bold text-gray-900 mb-2">
            Recipe Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => updateField('title', e.target.value)}
            required
            className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-400/10"
          />
        </div>

        <div className="p-5 bg-white rounded-xl border-l-4 border-red-400 shadow-sm">
          <label className="block font-bold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => updateField('description', e.target.value)}
            rows="3"
            className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none resize-y transition-all duration-200 focus:border-red-400 focus:ring-2 focus:ring-red-400/10"
          />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <div className="p-5 bg-white rounded-xl border-l-4 border-red-400 shadow-sm">
            <label className="block font-bold text-gray-900 mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => updateField('category', e.target.value)}
              required
              className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none bg-white cursor-pointer"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-5 bg-white rounded-xl border-l-4 border-red-400 shadow-sm">
            <label className="block font-bold text-gray-900 mb-2">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => updateField('difficulty', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none bg-white cursor-pointer"
            >
              <option value="easy">Easy 🟢</option>
              <option value="medium">Medium 🟡</option>
              <option value="hard">Hard 🔴</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4 p-6 bg-gray-50 rounded-xl">
          {[
            { key: 'prepTime', label: 'Prep Time', icon: '⏱️' },
            { key: 'cookTime', label: 'Cook Time', icon: '🔥' },
            { key: 'servings', label: 'Servings', icon: '🍽️' },
          ].map(({ key, label, icon }) => (
            <div key={key} className="text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-sm text-gray-500">{label}</div>
              <input
                type="number"
                min="0"
                value={formData[key]}
                onChange={(e) => updateField(key, e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg text-base text-center mt-2 outline-none"
              />
            </div>
          ))}
        </div>

        <div className="p-5 bg-white rounded-xl border-l-4 border-red-400 shadow-sm">
          <label className="block font-bold text-gray-900 mb-2">
            Recipe Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block mb-2"
          />
          {uploading && <p className="text-gray-500 text-sm">Uploading...</p>}
          {imageUrl && (
            <div className="mt-4 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-auto block"
              />
            </div>
          )}
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>🥘</span> Ingredients
          </h2>
          <div className="grid gap-3">
            {ingredients.map((ing, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 transition-all duration-200"
              >
                <span className="w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={ing}
                  onChange={(e) =>
                    updateListItem('ingredients', index, e.target.value)
                  }
                  placeholder={`Ingredient ${index + 1}`}
                  className="flex-1 p-2 border border-gray-200 rounded outline-none"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem('ingredients', index)}
                    className="px-3 py-2 bg-red-400 text-white rounded-md cursor-pointer text-sm hover:bg-red-500 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addListItem('ingredients')}
            className="mt-4 px-6 py-3 bg-green-400 text-white rounded-lg font-semibold inline-flex items-center gap-2 cursor-pointer hover:bg-green-500 hover:-translate-y-0.5 transition-all duration-200"
          >
            + Add Ingredient
          </button>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>👨‍🍳</span> Instructions
          </h2>
          <div className="grid gap-4">
            {instructions.map((inst, index) => (
              <div
                key={index}
                className="flex gap-4 p-5 bg-white rounded-xl border-l-4 border-red-400 shadow-sm transition-all duration-200"
              >
                <span className="text-2xl font-bold text-red-400 leading-none">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <textarea
                    value={inst}
                    onChange={(e) =>
                      updateListItem('instructions', index, e.target.value)
                    }
                    placeholder={`Step ${index + 1}`}
                    rows="2"
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none resize-y text-base"
                  />
                </div>
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem('instructions', index)}
                    className="px-3 py-2 bg-red-400 text-white rounded-md cursor-pointer text-sm self-start hover:bg-red-500 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addListItem('instructions')}
            className="mt-4 px-6 py-3 bg-green-400 text-white rounded-lg font-semibold inline-flex items-center gap-2 cursor-pointer hover:bg-green-500 hover:-translate-y-0.5 transition-all duration-200"
          >
            + Add Step
          </button>
        </section>

        <div className="flex gap-4 mt-8 pt-8 border-t-2 border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className={`flex-1 p-4 rounded-xl text-lg font-semibold transition-all duration-200 ${
              saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-400 text-white cursor-pointer hover:bg-red-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-400/30'
            }`}
          >
            {saving ? '💾 Saving...' : '✅ Save Changes'}
          </button>

          <Link to={`/recipe/${id}`} className="flex-1 no-underline">
            <button
              type="button"
              className="w-full p-4 bg-gray-200 text-gray-700 rounded-xl text-lg font-semibold cursor-pointer hover:bg-gray-300 hover:-translate-y-0.5 transition-all duration-200"
            >
              ❌ Cancel
            </button>
          </Link>
        </div>
      </form>
    </article>
  )
}

export default EditRecipe
