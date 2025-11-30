'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '../ui/Button'
import { useToast } from '../ui/ToastProvider'
import ImageUpload from './ImageUpload'

export default function AddVariantForm({ productId, addVariantAction }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [colorHex, setColorHex] = useState('#CCCCCC')
  const [colorName, setColorName] = useState('')
  const [imageUrls, setImageUrls] = useState('')
  const { showToast } = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    formData.append('colorHex', colorHex)
    formData.set('imageUrls', imageUrls)
    
    startTransition(async () => {
      try {
        await addVariantAction(formData)
        // Reset form after successful submission
        setImageUrls('')
        // The action will redirect with toast params, ToastHandler will show it
        router.refresh()
      } catch (error) {
        // If it's a redirect error, that's expected - ToastHandler will show toast from URL
        if (error.message && error.message.includes('NEXT_REDIRECT')) {
          return
        }
        showToast(error.message || 'An error occurred', 'error')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <input type="hidden" name="productId" value={productId} />
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
        <input
          type="text"
          name="size"
          required
          placeholder="S, M, L, XL"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Color Name</label>
        <input
          type="text"
          name="color"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          required
          placeholder="Red, Blue, etc."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded cursor-pointer"
            required
          />
          <input
            type="text"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            pattern="^#[0-9A-Fa-f]{6}$"
            className="w-20 px-2 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="#CCCCCC"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Price ($)</label>
        <input
          type="number"
          name="price"
          step="0.01"
          min="0"
          required
          placeholder="29.99"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Compare At Price ($)</label>
        <input
          type="number"
          name="compareAtPrice"
          step="0.01"
          min="0"
          placeholder="39.99 (optional)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          min="0"
          defaultValue="0"
          required
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Low Stock Threshold</label>
        <input
          type="number"
          name="lowStockThreshold"
          min="0"
          defaultValue="10"
          required
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">Variant Images</label>
        <ImageUpload 
          name="imageUrls"
          onImagesChange={setImageUrls}
          disabled={isPending}
        />
      </div>
      <div className="md:col-span-2 flex items-end">
        <Button type="submit" size="sm" className="w-full" disabled={isPending}>
          {isPending ? 'Adding...' : 'Add Variant'}
        </Button>
      </div>
    </form>
  )
}

