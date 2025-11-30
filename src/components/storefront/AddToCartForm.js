'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '../ui/Button'
import { useToast } from '../ui/ToastProvider'

export default function AddToCartForm({ productId, sizes, colors, variants = [], defaultImage, onVariantChange }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const { showToast } = useToast()

  // Notify parent component when variant selection changes
  useEffect(() => {
    if (onVariantChange) {
      onVariantChange(selectedSize, selectedColor)
    }
  }, [selectedSize, selectedColor, onVariantChange])

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)

    startTransition(async () => {
      try {
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: formData.get('productId'),
            size: formData.get('size'),
            color: formData.get('color'),
            quantity: parseInt(formData.get('quantity') || '1'),
          }),
        })

        const result = await response.json()

        if (result.success) {
          showToast('Item added to cart!', 'success')
          // Refresh the page to update cart count in header
          router.refresh()
          // Optionally redirect to cart after a short delay
          setTimeout(() => {
            router.push('/cart')
          }, 1000)
        } else {
          showToast(result.error || 'Failed to add item to cart', 'error')
        }
      } catch (err) {
        showToast(err.message || 'An error occurred', 'error')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="size" value={selectedSize} />
      <input type="hidden" name="color" value={selectedColor} />
      
      {/* Size Selection */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-gray-700">
          Size {!selectedSize && <span className="text-accent-600">*</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`px-6 py-3 rounded-lg font-medium transition-all border-2 min-w-[60px] ${
                selectedSize === size
                  ? 'bg-accent-600 text-white border-accent-600 shadow-lg scale-105'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500 hover:bg-primary-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {!selectedSize && (
          <p className="text-sm text-gray-500 mt-2">Please select a size</p>
        )}
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-gray-700">
          Color {!selectedColor && <span className="text-accent-600">*</span>}
        </label>
        <div className="flex flex-wrap gap-3">
          {colors.map(({ name, hex }) => {
            const isSelected = selectedColor === name
            // Determine if we should use white or black checkmark based on color brightness
            const rgb = hex.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [204, 204, 204]
            const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
            const checkmarkColor = brightness > 128 ? '#000000' : '#FFFFFF'
            
            return (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedColor(name)}
                className={`relative rounded-lg transition-all border-2 ${
                  isSelected
                    ? 'border-accent-600 shadow-lg scale-110 ring-2 ring-accent-500 ring-offset-2'
                    : 'border-gray-300 hover:border-primary-500 hover:scale-105'
                }`}
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: hex,
                  borderColor: isSelected ? '#dc2626' : undefined,
                }}
                title={name}
              >
                {isSelected && (
                  <svg
                    className="absolute inset-0 m-auto"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={checkmarkColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            )
          })}
        </div>
        {selectedColor && (
          <p className="text-sm text-gray-600 mt-2 font-medium">
            Selected: <span className="text-primary-600">{selectedColor}</span>
          </p>
        )}
        {!selectedColor && (
          <p className="text-sm text-gray-500 mt-2">Please select a color</p>
        )}
      </div>

      {/* Quantity Selection */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-gray-700">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const qtyInput = document.querySelector('input[name="quantity"]')
              const currentValue = parseInt(qtyInput.value) || 1
              if (currentValue > 1) {
                qtyInput.value = currentValue - 1
              }
            }}
            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-primary-500 hover:bg-primary-50 flex items-center justify-center font-bold text-lg transition-all"
          >
            −
          </button>
          <input
            type="number"
            name="quantity"
            defaultValue={1}
            min={1}
            required
            className="w-20 px-4 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="button"
            onClick={() => {
              const qtyInput = document.querySelector('input[name="quantity"]')
              const currentValue = parseInt(qtyInput.value) || 1
              qtyInput.value = currentValue + 1
            }}
            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-primary-500 hover:bg-primary-50 flex items-center justify-center font-bold text-lg transition-all"
          >
            +
          </button>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isPending || !selectedSize || !selectedColor}
      >
        {isPending ? 'Adding to Cart...' : 'Add to Cart'}
      </Button>
    </form>
  )
}

