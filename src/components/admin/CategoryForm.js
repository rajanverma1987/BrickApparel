'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/ToastProvider'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function CategoryForm({ action, topLevelCategories = [] }) {
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
          showToast(result.error || 'Failed to create category', 'error')
        } else if (result?.success) {
          showToast('Category created successfully', 'success')
          router.refresh()
        }
      } catch (err) {
        showToast(err.message || 'An error occurred', 'error')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category Name"
        name="name"
        required
        placeholder="e.g., T-Shirts"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Optional description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parent Category (optional)
        </label>
        <select
          name="parentId"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">None (Top Level)</option>
          {topLevelCategories.map(cat => (
            <option key={cat._id.toString()} value={cat._id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Adding...' : 'Add Category'}
      </Button>
    </form>
  )
}

