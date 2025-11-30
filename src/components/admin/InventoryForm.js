'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/ToastProvider'
import Button from '../ui/Button'

export default function InventoryForm({ action }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)

    startTransition(async () => {
      try {
        const result = await action(formData)
        
        if (result?.error) {
          showToast(result.error || 'Failed to update inventory', 'error')
        } else if (result?.success) {
          showToast('Inventory updated successfully', 'success')
          router.refresh()
        }
      } catch (err) {
        showToast(err.message || 'An error occurred', 'error')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          SKU
        </label>
        <input
          type="text"
          name="sku"
          required
          placeholder="Enter SKU"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity Adjustment
        </label>
        <input
          type="number"
          name="quantity"
          required
          placeholder="+10 or -5"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use positive numbers to add, negative to subtract
        </p>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update Inventory'}
      </Button>
    </form>
  )
}

