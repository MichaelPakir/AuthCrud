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
    easy: '#51cf66',
    medium: '#ffd43b',
    hard: '#ff6b6b',
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
    if (name === 'breakfast') return '#FFE4B5'
    if (name === 'lunch') return '#90EE90'
    if (name === 'dinner') return '#FFB6C1'
    if (name === 'dessert') return '#DDA0DD'
    return '#E9ECEF'
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

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>😕</h2>
        <p>{error}</p>
        <Link to="/" style={{ color: '#ff6b6b', textDecoration: 'none' }}>
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
    <article
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        animation: 'fadeIn 0.5s ease',
      }}
    >
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
              backgroundColor: '#ff6b6b',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            ✏️ Edit Mode
          </span>

          {selectedCategoryName && (
            <span
              style={{
                backgroundColor: getCategoryColor(selectedCategoryName),
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              {selectedCategoryName}
            </span>
          )}

          <span
            style={{
              backgroundColor: difficultyColors[difficulty] || '#868e96',
              color:
                difficulty === 'easy'
                  ? 'black'
                  : difficulty === 'medium'
                    ? 'black'
                    : 'White',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600',
              textTransform: 'capitalize',
            }}
          >
            {difficulty}
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
          Edit Recipe
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Title */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: '#fff',
            borderRadius: '12px',
            borderLeft: '4px solid #ff6b6b',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <label
            style={{
              display: 'block',
              fontWeight: 'bold',
              color: '#212529',
              marginBottom: '0.5rem',
            }}
          >
            Recipe Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => updateField('title', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff6b6b'
              e.target.style.boxShadow = '0 0 0 3px rgba(255,107,107,0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Description */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: '#fff',
            borderRadius: '12px',
            borderLeft: '4px solid #ff6b6b',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <label
            style={{
              display: 'block',
              fontWeight: 'bold',
              color: '#212529',
              marginBottom: '0.5rem',
            }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => updateField('description', e.target.value)}
            rows="3"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              resize: 'vertical',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff6b6b'
              e.target.style.boxShadow = '0 0 0 3px rgba(255,107,107,0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#fff',
              borderRadius: '12px',
              borderLeft: '4px solid #ff6b6b',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <label
              style={{
                display: 'block',
                fontWeight: 'bold',
                color: '#212529',
                marginBottom: '0.5rem',
              }}
            >
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => updateField('category', e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#fff',
              borderRadius: '12px',
              borderLeft: '4px solid #ff6b6b',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <label
              style={{
                display: 'block',
                fontWeight: 'bold',
                color: '#212529',
                marginBottom: '0.5rem',
              }}
            >
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => updateField('difficulty', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
            >
              <option value="easy">Easy 🟢</option>
              <option value="medium">Medium 🟡</option>
              <option value="hard">Hard 🔴</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
          }}
        >
          {[
            { key: 'prepTime', label: 'Prep Time', icon: '⏱️' },
            { key: 'cookTime', label: 'Cook Time', icon: '🔥' },
            { key: 'servings', label: 'Servings', icon: '🍽️' },
          ].map(({ key, label, icon }) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                {icon}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#868e96' }}>
                {label}
              </div>
              <input
                type="number"
                min="0"
                value={formData[key]}
                onChange={(e) => updateField(key, e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  textAlign: 'center',
                  marginTop: '0.5rem',
                  outline: 'none',
                }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            padding: '1.25rem',
            backgroundColor: '#fff',
            borderRadius: '12px',
            borderLeft: '4px solid #ff6b6b',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <label
            style={{
              display: 'block',
              fontWeight: 'bold',
              color: '#212529',
              marginBottom: '0.5rem',
            }}
          >
            Recipe Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            style={{ display: 'block', marginBottom: '0.5rem' }}
          />
          {uploading && (
            <p style={{ color: '#868e96', fontSize: '0.875rem' }}>
              Uploading...
            </p>
          )}
          {imageUrl && (
            <div
              style={{
                marginTop: '1rem',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={imageUrl}
                alt="Preview"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          )}
        </div>

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
            <span>🥘</span> Ingredients
          </h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {ingredients.map((ing, index) => (
              <div
                key={index}
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
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={ing}
                  onChange={(e) =>
                    updateListItem('ingredients', index, e.target.value)
                  }
                  placeholder={`Ingredient ${index + 1}`}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #e9ecef',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem('ingredients', index)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fa5252'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ff6b6b'
                    }}
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
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#51cf66',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#40c057'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#51cf66'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            + Add Ingredient
          </button>
        </section>

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
            {instructions.map((inst, index) => (
              <div
                key={index}
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
              >
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#ff6b6b',
                    lineHeight: 1,
                  }}
                >
                  {index + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <textarea
                    value={inst}
                    onChange={(e) =>
                      updateListItem('instructions', index, e.target.value)
                    }
                    placeholder={`Step ${index + 1}`}
                    rows="2"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      outline: 'none',
                      resize: 'vertical',
                      fontSize: '1rem',
                    }}
                  />
                </div>
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem('instructions', index)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      alignSelf: 'flex-start',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fa5252'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ff6b6b'
                    }}
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
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#51cf66',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#40c057'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#51cf66'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            + Add Step
          </button>
        </section>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '2px solid #f8f9fa',
          }}
        >
          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 1,
              padding: '1rem',
              backgroundColor: saving ? '#adb5bd' : '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.target.style.backgroundColor = '#fa5252'
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 10px 20px rgba(255,107,107,0.3)'
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.target.style.backgroundColor = '#ff6b6b'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'none'
              }
            }}
          >
            {saving ? '💾 Saving...' : '✅ Save Changes'}
          </button>

          <Link
            to={`/recipe/${id}`}
            style={{
              flex: 1,
              textDecoration: 'none',
            }}
          >
            <button
              type="button"
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#e9ecef',
                color: '#495057',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#dee2e6'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#e9ecef'
                e.target.style.transform = 'translateY(0)'
              }}
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
