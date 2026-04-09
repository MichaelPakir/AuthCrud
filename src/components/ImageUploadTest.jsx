// src/components/ImageUploadTest.jsx
import { useState } from 'react'
import { uploadImage } from '../services/imageService'

const ImageUploadTest = () => {
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    try {
      const url = await uploadImage(file)
      setImageUrl(url)
      console.log('Uploaded! URL:', url)
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Test Image Upload</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {loading && <p>Uploading...</p>}

      {imageUrl && (
        <div>
          <p>Success! Image URL:</p>
          <a href={imageUrl} target="_blank" rel="noreferrer">
            {imageUrl}
          </a>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ maxWidth: '300px', display: 'block', marginTop: '1rem' }}
          />
        </div>
      )}
    </div>
  )
}

export default ImageUploadTest
