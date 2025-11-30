'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ProductImages({ defaultImage, productName, variants, selectedSize, selectedColor, productImages = [] }) {
  const [currentImage, setCurrentImage] = useState(defaultImage)
  const [currentImages, setCurrentImages] = useState([])

  useEffect(() => {
    // Find variant based on selected size and color
    if (selectedSize && selectedColor && variants.length > 0) {
      const variant = variants.find(
        v => v.size === selectedSize && v.color === selectedColor
      )
      
      if (variant && variant.images && variant.images.length > 0) {
        // Use variant images
        const primaryVariantImage = variant.images.find(img => img.isPrimary) || variant.images[0]
        setCurrentImage(primaryVariantImage)
        setCurrentImages(variant.images)
        return
      }
    }
    
    // Fallback to default product images
    setCurrentImage(defaultImage)
    setCurrentImages(productImages.length > 0 ? productImages : [])
  }, [selectedSize, selectedColor, variants, defaultImage, productImages])

  const displayImages = currentImages.length > 0 ? currentImages : (defaultImage ? [defaultImage] : [])

  return (
    <div>
      <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
        {currentImage ? (
          <Image
            src={currentImage.url}
            alt={currentImage.alt || productName}
            fill
            className="object-cover transition-opacity duration-300"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={currentImage.url.includes('unsplash.com')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>No Image Available</span>
          </div>
        )}
      </div>
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {displayImages.slice(0, 4).map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentImage(img)}
              className={`aspect-square relative rounded-lg overflow-hidden bg-gray-100 border-2 transition-all ${
                currentImage?.url === img.url ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12.5vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

