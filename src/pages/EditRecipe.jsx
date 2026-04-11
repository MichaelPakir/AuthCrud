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
    <section>
      <h1>Edit Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipe Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label>Category*</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value={''}>Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

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

        <div>
          <label>Prep Time "(mins)"</label>
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
          />

          <label>Cook Time "(mins)"</label>
          <input
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
          />

          <label>Servings</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </div>

        <div>
          <label>Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>

        <div>
          <h3>Ingredients</h3>

          {ingredients.map((ing, index) => (
            <div key={index}>
              <input
                type="text"
                value={ing}
                onChange={(e) => updateIngredient(index, e.target.value)}
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

        <div>
          <h3>Instructions</h3>

          {instructions.map((inst, index) => (
            <div key={index}>
              <textarea
                value={inst}
                onChange={(e) => updateInstruction(index, e.target.value)}
              ></textarea>
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

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  )
}

export default EditRecipe
