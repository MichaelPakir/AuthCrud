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

  if (loading) return <div className="p-6 text-center">Loading recipe...</div>
  if (error)
    return (
      <div className="p-6 text-center">
        {error}{' '}
        <Link to="/" className="text-indigo-600 underline ml-2">
          Back
        </Link>
      </div>
    )

  const {
    title,
    description,
    category,
    prepTime,
    cookTime,
    servings,
    difficulty,
    ingredients,
    instructions,
    imageUrl,
  } = formData

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Edit Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Recipe Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => updateField('title', e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            value={category}
            onChange={(e) => updateField('category', e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Recipe Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block w-full text-sm"
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-3 w-40 rounded-lg shadow"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'prepTime', label: 'Prep Time (min)' },
            { key: 'cookTime', label: 'Cook Time (min)' },
            { key: 'servings', label: 'Servings' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type="number"
                min="0"
                value={formData[key]}
                onChange={(e) => updateField(key, e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => updateField('difficulty', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Ingredients</h3>
          <div className="space-y-2">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ing}
                  onChange={(e) =>
                    updateListItem('ingredients', index, e.target.value)
                  }
                  className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem('ingredients', index)}
                    className="bg-red-500 text-white px-3 rounded-lg hover:bg-red-600"
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
            className="mt-2 text-sm bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
          >
            + Add Ingredient
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Instructions</h3>
          <div className="space-y-2">
            {instructions.map((inst, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={inst}
                  onChange={(e) =>
                    updateListItem('instructions', index, e.target.value)
                  }
                  className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem('instructions', index)}
                    className="bg-red-500 text-white px-3 rounded-lg hover:bg-red-600"
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
            className="mt-2 text-sm bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
          >
            + Add Step
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  )
}

export default EditRecipe
