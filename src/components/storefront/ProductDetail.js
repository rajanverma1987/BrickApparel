'use client'

import { useState } from 'react'
import ProductImages from './ProductImages'
import AddToCartForm from './AddToCartForm'
import ProductReviews from './ProductReviews'

export default function ProductDetail({ 
  productId, 
  productName, 
  priceRange, 
  category, 
  description, 
  sizes, 
  colors, 
  variants, 
  defaultImage,
  productImages = [],
  reviews = [],
  ratingStats = null,
  isLoggedIn = false
}) {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  const handleVariantChange = (size, color) => {
    setSelectedSize(size)
    setSelectedColor(color)
  }

  // Get selected variant for price display
  const selectedVariant = variants.find(v => v.size === selectedSize && v.color === selectedColor)
  
  // Calculate price display
  let priceDisplay = null
  let compareAtPriceDisplay = null
  
  if (selectedVariant) {
    // Show selected variant price
    priceDisplay = selectedVariant.price
    if (selectedVariant.compareAtPrice) {
      compareAtPriceDisplay = selectedVariant.compareAtPrice
    }
  } else {
    // Show price range from all variants
    const prices = variants.map(v => v.price).filter(p => typeof p === 'number')
    const compareAtPrices = variants.map(v => v.compareAtPrice).filter(p => typeof p === 'number' && p > 0)
    
    if (prices.length > 0) {
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      priceDisplay = minPrice === maxPrice ? minPrice : { min: minPrice, max: maxPrice }
      
      if (compareAtPrices.length > 0) {
        const minCompare = Math.min(...compareAtPrices)
        const maxCompare = Math.max(...compareAtPrices)
        compareAtPriceDisplay = minCompare === maxCompare ? minCompare : { min: minCompare, max: maxCompare }
      }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Images */}
      <ProductImages 
        defaultImage={defaultImage}
        productName={productName}
        variants={variants}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        productImages={productImages}
      />

      {/* Product Info */}
      <div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">{productName}</h1>
        
        {/* Average Rating */}
        {ratingStats && ratingStats.totalReviews > 0 && ratingStats.averageRating > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${
                    star <= Math.round(ratingStats.averageRating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-800">
                {ratingStats.averageRating?.toFixed(1) || '0.0'}
              </span>
              <span className="text-sm text-gray-600">
                ({ratingStats.totalReviews || 0} {ratingStats.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <a
              href="#reviews"
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline ml-2"
            >
              See all reviews
            </a>
          </div>
        )}
        
        <div className="mb-2">
          {compareAtPriceDisplay && (
            <div className="text-xl text-gray-500 mb-1">
              {typeof compareAtPriceDisplay === 'number' ? (
                <span className="line-through">${compareAtPriceDisplay.toFixed(2)}</span>
              ) : (
                <span className="line-through">
                  ${compareAtPriceDisplay.min.toFixed(2)} - ${compareAtPriceDisplay.max.toFixed(2)}
                </span>
              )}
            </div>
          )}
          <p className="text-2xl text-primary-600 font-bold">
            {typeof priceDisplay === 'number' ? (
              `$${priceDisplay.toFixed(2)}`
            ) : priceDisplay ? (
              `$${priceDisplay.min.toFixed(2)} - $${priceDisplay.max.toFixed(2)}`
            ) : (
              `$${priceRange}`
            )}
          </p>
        </div>
        {category && (
          <p className="text-gray-600 mb-4">
            Category: <span className="font-semibold">{category.name}</span>
          </p>
        )}
        <div className="prose mb-6" dangerouslySetInnerHTML={{ __html: description }} />
        
        <AddToCartForm 
          productId={productId}
          sizes={sizes}
          colors={colors}
          variants={variants}
          defaultImage={defaultImage}
          onVariantChange={handleVariantChange}
        />
      </div>

      {/* Reviews Section */}
      <div className="md:col-span-2">
        <ProductReviews 
          productId={productId}
          reviews={reviews}
          ratingStats={ratingStats}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  )
}

