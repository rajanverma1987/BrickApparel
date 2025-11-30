'use client'

import { useTransition, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/ToastProvider'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function LoginForm({ action, rememberedEmail = '', rememberMeChecked = false }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToast()
  const [email, setEmail] = useState(rememberedEmail)
  const [rememberMe, setRememberMe] = useState(rememberMeChecked)

  // Update email when rememberedEmail prop changes
  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail)
    }
  }, [rememberedEmail])

  // Update rememberMe when rememberMeChecked prop changes
  useEffect(() => {
    setRememberMe(rememberMeChecked)
  }, [rememberMeChecked])

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)

    startTransition(async () => {
      try {
        const result = await action(formData)
        
        if (result?.success) {
          showToast('Login successful!', 'success')
          // Redirect to admin dashboard
          router.push('/admin')
        } else if (result?.error) {
          showToast(result.error || 'Invalid credentials', 'error')
        }
      } catch (err) {
        // If it's a redirect error, that's expected - login successful
        // Next.js redirect() throws an error with digest: 'NEXT_REDIRECT'
        // Check multiple ways the redirect error might appear
        const isRedirectError = 
          err.digest === 'NEXT_REDIRECT' ||
          err.message === 'NEXT_REDIRECT' ||
          (err.message && err.message.includes('NEXT_REDIRECT')) ||
          err.name === 'RedirectError' ||
          String(err).includes('NEXT_REDIRECT')
        
        if (isRedirectError) {
          // Don't show toast for redirects - the redirect itself is the success indicator
          // Just return silently
          return
        }
        
        // Only show error if it's not a redirect
        const errorMessage = err.message || String(err) || 'An error occurred'
        if (errorMessage !== 'NEXT_REDIRECT' && !errorMessage.includes('NEXT_REDIRECT')) {
          showToast(errorMessage, 'error')
        }
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="admin@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 cursor-pointer">
            Remember me
          </label>
        </div>
      </div>

      <Button 
        type="submit" 
        variant="secondary"
        size="lg"
        className="w-full" 
        disabled={isPending}
      >
        {isPending ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}

