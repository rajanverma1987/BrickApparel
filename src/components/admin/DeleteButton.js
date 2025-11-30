'use client'

import { useState } from 'react'
import Button from '../ui/Button'

export default function DeleteButton({ 
  onConfirm, 
  confirmMessage = 'Are you sure you want to delete this item? This action cannot be undone.',
  children = 'Delete',
  variant = 'danger',
  size = 'sm',
  className = '',
  disabled = false
}) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClick = (e) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    if (onConfirm) {
      onConfirm()
    }
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  if (showConfirm) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-700 font-medium">{confirmMessage}</p>
        <div className="flex gap-2">
          <Button
            variant="danger"
            size={size}
            onClick={handleConfirm}
            className="flex-1"
          >
            Yes, Delete
          </Button>
          <Button
            variant="outline"
            size={size}
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}

