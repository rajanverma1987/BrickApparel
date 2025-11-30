'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/ToastProvider'
import Button from '../ui/Button'

export default function OrderStatusForm({ action, orderId, currentStatus, trackingNumber, notes }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)

    startTransition(async () => {
      try {
        const result = await action(formData)
        
        // If we get a result, check for errors
        if (result && typeof result === 'object') {
          if (result.error) {
            showToast(result.error || 'Failed to update order status', 'error')
          } else if (result.success === false) {
            showToast(result.error || 'Failed to update order status', 'error')
          }
        }
      } catch (err) {
        // NEXT_REDIRECT is expected when redirect() is called - it's not an error
        // Check for the digest property which Next.js uses for redirects
        if (err.digest && err.digest.includes('NEXT_REDIRECT')) {
          // Redirect is happening, ToastHandler will show toast from URL params
          return
        }
        // Check error message as fallback
        if (err.message && (err.message.includes('NEXT_REDIRECT') || err.message === 'NEXT_REDIRECT')) {
          return
        }
        // Only show error for actual errors, not redirects
        showToast(err.message || 'An error occurred', 'error')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="orderId" value={orderId} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          name="status"
          defaultValue={currentStatus}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="pending">Pending</option>
          <option value="authorized">Authorized</option>
          <option value="captured">Captured</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="refunded">Refunded</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tracking Number (optional)
        </label>
        <input
          type="text"
          name="trackingNumber"
          defaultValue={trackingNumber || ''}
          placeholder="Enter tracking number"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optional)
        </label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={notes || ''}
          placeholder="Add order notes..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update Status'}
      </Button>
    </form>
  )
}

