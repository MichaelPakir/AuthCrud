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
    <div className="p-8 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Test Image Upload
      </h3>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-400 hover:file:bg-red-100 cursor-pointer mb-4"
      />

      {loading && (
        <p className="text-gray-600 flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Uploading...
        </p>
      )}

      {imageUrl && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <p className="text-gray-700 font-medium mb-2">Success! Image URL:</p>
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            className="text-red-400 hover:text-red-500 underline break-all text-sm"
          >
            {imageUrl}
          </a>
          <img
            src={imageUrl}
            alt="Uploaded"
            className="max-w-[300px] w-full rounded-lg shadow-md mt-4 block"
          />
        </div>
      )}
    </div>
  )
}

export default ImageUploadTest
