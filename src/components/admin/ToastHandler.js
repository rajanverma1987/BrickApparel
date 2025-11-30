'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useToast } from '../ui/ToastProvider'

export default function ToastHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    const toast = searchParams.get('toast')
    const type = searchParams.get('type') || 'success'
    const message = searchParams.get('message')

    if (toast && message) {
      showToast(decodeURIComponent(message), type)
      // Remove toast params from URL
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete('toast')
      newSearchParams.delete('type')
      newSearchParams.delete('message')
      const newUrl = newSearchParams.toString() 
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname
      router.replace(newUrl, { scroll: false })
    }
  }, [searchParams, router, showToast])

  return null
}

