'use client'

import { useState, useEffect } from 'react'
import { useToast } from '../ui/ToastProvider'

export default function ImageUpload({ 
  name = 'imageUrls', 
  defaultValue = '', 
  onImagesChange,
  className = '',
  disabled = false
}) {
  const [uploadedImages, setUploadedImages] = useState([])
  const [urlImages, setUrlImages] = useState(defaultValue || '')
  const [uploading, setUploading] = useState(false)
  const { showToast } = useToast()

  // Update urlImages when defaultValue changes (for edit forms)
  useEffect(() => {
    if (defaultValue) {
      // Separate uploaded images (starting with /uploads/ or S3 URLs) from external URLs
      const lines = defaultValue.split('\n').filter(url => url.trim())
      const uploaded = lines.filter(url => 
        url.startsWith('/uploads/') || 
        url.includes('s3.amazonaws.com') || 
        url.includes('amazonaws.com') ||
        (url.startsWith('http') && (url.includes('/products/variants/') || url.includes('/variants/')))
      )
      const urls = lines.filter(url => 
        !url.startsWith('/uploads/') && 
        !url.includes('s3.amazonaws.com') && 
        !url.includes('amazonaws.com') &&
        !(url.startsWith('http') && (url.includes('/products/variants/') || url.includes('/variants/')))
      )
      
      setUploadedImages(uploaded)
      setUrlImages(urls.join('\n'))
    } else {
      // Reset if no default value
      setUploadedImages([])
      setUrlImages('')
    }
  }, [defaultValue])

  async function handleFileUpload(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    const newImages = []

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          newImages.push(result.url)
        } else {
          showToast(result.error || 'Failed to upload image', 'error')
        }
      }

      if (newImages.length > 0) {
        setUploadedImages(prev => [...prev, ...newImages])
        updateImages([...uploadedImages, ...newImages], urlImages)
        showToast(`${newImages.length} image(s) uploaded successfully`, 'success')
      }
    } catch (error) {
      showToast('Error uploading images', 'error')
    } finally {
      setUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

  function removeImage(index) {
    const newUploaded = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(newUploaded)
    updateImages(newUploaded, urlImages)
  }

  function handleUrlChange(e) {
    const newUrls = e.target.value
    setUrlImages(newUrls)
    updateImages(uploadedImages, newUrls)
  }

  function updateImages(uploaded, urls) {
    const urlList = urls.split('\n').filter(url => url.trim())
    const allImages = [...uploaded, ...urlList].filter(url => url.trim())
    const combined = allImages.join('\n')
    
    if (onImagesChange) {
      onImagesChange(combined)
    }
  }

  return (
    <div className={className}>
      {/* File Upload */}
      <div className="mb-2">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          disabled={uploading || disabled}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {uploading && (
          <p className="text-xs text-gray-500 mt-1">Uploading...</p>
        )}
      </div>

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-1">Uploaded Images ({uploadedImages.length}):</p>
          <div className="flex flex-wrap gap-2">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden input with combined images */}
      <input type="hidden" name={name} value={[...uploadedImages, ...urlImages.split('\n').filter(url => url.trim())].join('\n')} />

      {/* URL Input (Optional) */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Or enter image URLs (one per line, optional):</label>
        <textarea
          value={urlImages}
          onChange={handleUrlChange}
          rows={2}
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="text-xs text-gray-500 mt-1">Upload images above or enter URLs. First image will be primary.</p>
      </div>
    </div>
  )
}

