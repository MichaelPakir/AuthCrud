export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'authcrud') // ← Updated
  formData.append('cloud_name', 'dviejulad')

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dviejulad/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}
