'use client'

import { useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import DeleteButton from './DeleteButton'
import { useToast } from '../ui/ToastProvider'

export default function DeleteForm({ 
  action, 
  confirmMessage,
  children = 'Delete',
  variant = 'danger',
  size = 'sm',
  className = '',
  hiddenFields = {},
  successMessage = 'Item deleted successfully',
  errorMessage = 'Failed to delete item'
}) {
  const formRef = useRef(null)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToast()

  const handleConfirm = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current)
      
      startTransition(async () => {
        try {
          const result = await action(formData)
          
          // If action returns an error, show error toast
          if (result && typeof result === 'object' && 'error' in result) {
            showToast(result.error || errorMessage, 'error')
          }
          // If action redirects with toast params, ToastHandler will show it
          // Otherwise refresh to check for URL params
          setTimeout(() => {
            router.refresh()
          }, 100)
        } catch (error) {
          // If it's a redirect error, that's expected - ToastHandler will show toast from URL
          if (error.message && error.message.includes('NEXT_REDIRECT')) {
            return
          }
          showToast(error.message || errorMessage, 'error')
        }
      })
    }
  }

  return (
    <form ref={formRef} className="w-full">
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <DeleteButton
        onConfirm={handleConfirm}
        confirmMessage={confirmMessage}
        variant={variant}
        size={size}
        className={className}
        disabled={isPending}
      >
        {isPending ? 'Deleting...' : children}
      </DeleteButton>
    </form>
  )
}

