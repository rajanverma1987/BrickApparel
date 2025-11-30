'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateCartItemAction, removeFromCartAction } from '../../actions/cart-actions'
import Button from '../ui/Button'

export default function CartActions({ itemIndex, currentQuantity }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function handleUpdate(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    startTransition(async () => {
      const result = await updateCartItemAction(itemIndex, formData)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to update item')
      }
    })
  }

  async function handleRemove() {
    if (!confirm('Are you sure you want to remove this item from your cart?')) {
      return
    }
    
    startTransition(async () => {
      const result = await removeFromCartAction(itemIndex)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to remove item')
      }
    })
  }

  return (
    <div className="flex gap-2">
      <form onSubmit={handleUpdate} className="flex items-center gap-2">
        <input
          type="number"
          name="quantity"
          defaultValue={currentQuantity}
          min={1}
          className="w-20 px-2 py-1 border border-gray-300 rounded"
          disabled={isPending}
        />
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update'}
        </Button>
      </form>
      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={handleRemove}
        disabled={isPending}
      >
        {isPending ? 'Removing...' : 'Remove'}
      </Button>
    </div>
  )
}

