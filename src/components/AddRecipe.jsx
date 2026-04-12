import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { uploadImage } from '../services/imageService'
import { fetchCategories } from './../services/categoryService'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const AddRecipe = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [ingredients, setIngredients] = useState([''])
  const [instructions, setInstructions] = useState([''])
  const [imageUrl, setImageUrl] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [servings, setServings] = useState('')
  const [difficulty, setDifficulty] = useState('easy')

  const [categories, setCategories] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories()
      setCategories(data)
    }
    loadCategories()
  }, [])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file)
      setImageUrl(url)
    } catch (error) {
      alert('Image upload failed!', error)
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
      await addDoc(collection(db, 'recipes'), {
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
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      navigate('/my-recipes')
    } catch (error) {
      alert('Failed to save recipe!')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🍳 Add Recipe</h1>
        <p className="text-gray-500">Create a new delicious recipe</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-400">
          <label className="block font-semibold text-gray-800 mb-2">
            Recipe Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none"
            placeholder="Enter recipe title"
          />
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-400">
          <label className="block font-semibold text-gray-800 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none resize-none"
            placeholder="Brief description of your recipe"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-400">
            <label className="block font-semibold text-gray-800 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-400">
            <label className="block font-semibold text-gray-800 mb-2">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none bg-white"
            >
              <option value="easy">Easy 🟢</option>
              <option value="medium">Medium 🟡</option>
              <option value="hard">Hard 🔴</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl">
          <div className="text-center">
            <div className="text-2xl">⏱️</div>
            <p className="text-sm text-gray-500">Prep Time</p>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="w-full mt-2 px-3 py-2 text-center border rounded-lg"
              min="0"
            />
          </div>

          <div className="text-center">
            <div className="text-2xl">🔥</div>
            <p className="text-sm text-gray-500">Cook Time</p>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="w-full mt-2 px-3 py-2 text-center border rounded-lg"
              min="0"
            />
          </div>

          <div className="text-center">
            <div className="text-2xl">🍽️</div>
            <p className="text-sm text-gray-500">Servings</p>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="w-full mt-2 px-3 py-2 text-center border rounded-lg"
              min="1"
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-400">
          <label className="block font-semibold text-gray-800 mb-2">
            Recipe Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full"
          />

          {uploading && (
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
          )}

          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              className="mt-4 rounded-xl w-full object-cover max-h-72"
            />
          )}
        </div>

        <section>
          <h2 className="text-xl font-bold mb-3">🥘 Ingredients</h2>

          <div className="space-y-3">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={ing}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />

                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg"
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
            className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            + Add Ingredient
          </button>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">👨‍🍳 Instructions</h2>

          <div className="space-y-4">
            {instructions.map((inst, index) => (
              <div key={index} className="flex gap-3">
                <textarea
                  value={inst}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />

                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg h-fit"
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
            className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            + Add Step
          </button>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 text-lg font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition disabled:bg-gray-400"
        >
          {saving ? 'Saving...' : '🍽️ Save Recipe'}
        </button>
      </form>
    </article>
  )
}

export default AddRecipe
