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

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [servings, setServings] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [ingredients, setIngredients] = useState([''])
  const [instructions, setInstructions] = useState([''])
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await fetchCategories()
        setCategories(cats)

        const recipeRef = doc(db, 'recipes', id)
        const snapshot = await getDoc(recipeRef)

        if (!snapshot.exists()) {
          setError('Recipe not found')
          setLoading(false)
          return
        }

        const recipeData = snapshot.data()
        setRecipe(recipeData)

        if (recipeData.authorId !== user.uid) {
          setError('Unauthorized')
          setLoading(false)
          return
        }

        setTitle(recipeData.title || '')
        setDescription(recipeData.description || '')
        setCategory(recipeData.categoryId || '')
        setPrepTime(recipeData.prepTime || '')
        setCookTime(recipeData.cookTime || '')
        setServings(recipeData.servings || '')
        setDifficulty(recipeData.difficulty || 'easy')
        setIngredients(
          recipeData.ingredients?.length ? recipeData.ingredients : ['']
        )
        setInstructions(
          recipeData.instructions?.length ? recipeData.instructions : ['']
        )
        setImageUrl(recipeData.imageUrl || '')
      } catch (error) {
        console.error('Error loading recipe:', error)
        setError('Failed to load recipe')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, user, navigate])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)

    try {
      const url = await uploadImage(file)
      setImageUrl(url)
    } catch (error) {
      alert('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const addIngredient = () => {
    setIngredients([...ingredients, ''])
  }

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const addInstruction = () => {
    setInstructions([...instructions, ''])
  }

  const updateInstruction = (index, value) => {
    const newInstructions = [...instructions]
    newInstructions[index] = value
    setInstructions(newInstructions)
  }

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !category || !user) {
      alert('Please fill in title and category!')
      return
    }

    setSaving(true)

    try {
      await updateDoc(doc(db, 'recipes', id), {
        title,
        description,
        categoryId: category,
        categoryName:
          categories.find((c) => c.id === category)?.name || category,
        prepTime: Number(prepTime) || 0,
        cookTime: Number(cookTime) || 0,
        servings: Number(servings) || 1,
        difficulty,
        ingredients: ingredients.filter((i) => i.trim() !== ''),
        instructions: instructions.filter((i) => i.trim() !== ''),
        imageUrl,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        createdBy: recipe.createdBy,
        updatedAt: new Date(),
      })

      navigate(`/recipe/${id}`)
    } catch (error) {
      alert('Failed to update recipe!')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading recipe...</div>
  if (error)
    return (
      <div>
        {error} <Link to="/">Back</Link>
      </div>
    )

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Edit Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Recipe Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category*</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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

        {/* Image Upload */}
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

        {/* Times */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prep Time</label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cook Time</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Servings</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="font-semibold mb-2">Ingredients</h3>

          <div className="space-y-2">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ing}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
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
            onClick={addIngredient}
            className="mt-2 text-sm bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="font-semibold mb-2">Instructions</h3>

          <div className="space-y-2">
            {instructions.map((inst, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={inst}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
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
            onClick={addInstruction}
            className="mt-2 text-sm bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
          >
            + Add Step
          </button>
        </div>

        {/* Submit */}
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
