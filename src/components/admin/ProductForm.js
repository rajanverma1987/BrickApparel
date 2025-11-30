'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/ToastProvider'
import Button from '../ui/Button'

export default function ProductForm({ action, children, successMessage = 'Product created successfully', errorMessage = 'Failed to create product' }) {
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
          showToast(result.error || errorMessage, 'error')
        }
        // If action redirects, it won't return - ToastHandler will show toast from URL params
      } catch (err) {
        // If it's a redirect error, that's expected - ToastHandler will show toast from URL
        if (err.message && err.message.includes('NEXT_REDIRECT')) {
          return
        }
        const errorMsg = err.message || errorMessage
        showToast(errorMsg, 'error')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {children}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}

