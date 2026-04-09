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

  // Other state
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
      alert('Image upload failed!')
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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Let's add recipes</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
      >
        {/* Title */}
        <div>
          <label>Recipe Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter recipe title"
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of your recipe"
            rows="3"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label>Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Timing & Servings Row */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <label>Prep Time (mins)</label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="10"
              min="0"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '120px' }}>
            <label>Cook Time (mins)</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              placeholder="15"
              min="0"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '120px' }}>
            <label>Servings</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              placeholder="4"
              min="1"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label>Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label>Recipe Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {uploading && <p>Uploading...</p>}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              style={{ maxWidth: '200px', marginTop: '1rem' }}
            />
          )}
        </div>

        {/* Ingredients */}
        <div>
          <label>Ingredients</label>
          {ingredients.map((ing, index) => (
            <div
              key={index}
              style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}
            >
              <input
                type="text"
                value={ing}
                onChange={(e) => updateIngredient(index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
                style={{ flex: 1, padding: '0.5rem' }}
              />
              {ingredients.length > 1 && (
                <button type="button" onClick={() => removeIngredient(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addIngredient}>
            + Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div>
          <label>Instructions</label>
          {instructions.map((inst, index) => (
            <div
              key={index}
              style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}
            >
              <textarea
                value={inst}
                onChange={(e) => updateInstruction(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                rows="2"
                style={{ flex: 1, padding: '0.5rem' }}
              />
              {instructions.length > 1 && (
                <button type="button" onClick={() => removeInstruction(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addInstruction}>
            + Add Step
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          style={{ padding: '1rem', fontSize: '1.1rem', cursor: 'pointer' }}
        >
          {saving ? 'Saving...' : 'Save Recipe'}
        </button>
      </form>
    </div>
  )
}

export default AddRecipe
