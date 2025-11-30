'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createOrderAction } from '../../actions/checkout-actions'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useState } from 'react'
import Image from 'next/image'
import { useToast } from '../ui/ToastProvider'

export default function CheckoutForm({ cart, totals }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const { showToast } = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setFieldErrors({})

    try {
      const formData = new FormData(e.target)
      
      // Client-side validation
      const shippingFirstName = formData.get('shippingFirstName')
      const shippingLastName = formData.get('shippingLastName')
      const shippingAddress1 = formData.get('shippingAddress1')
      const shippingCity = formData.get('shippingCity')
      const shippingState = formData.get('shippingState')
      const shippingZip = formData.get('shippingZip')
      const email = formData.get('email')
      
      const errors = {}
      
      if (!shippingFirstName?.trim()) errors.shippingFirstName = 'First name is required'
      if (!shippingLastName?.trim()) errors.shippingLastName = 'Last name is required'
      if (!shippingAddress1?.trim()) errors.shippingAddress1 = 'Address is required'
      if (!shippingCity?.trim()) errors.shippingCity = 'City is required'
      if (!shippingState?.trim()) errors.shippingState = 'State is required'
      if (!shippingZip?.trim()) errors.shippingZip = 'ZIP code is required'
      if (!email?.trim()) errors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address'
      
      if (!acceptedTerms) {
        errors.terms = 'You must accept the Terms of Service and Privacy Policy to continue'
      }
      
      if (!sameAsShipping) {
        const billingFirstName = formData.get('billingFirstName')
        const billingLastName = formData.get('billingLastName')
        const billingAddress1 = formData.get('billingAddress1')
        const billingCity = formData.get('billingCity')
        const billingState = formData.get('billingState')
        const billingZip = formData.get('billingZip')
        
        if (!billingFirstName?.trim()) errors.billingFirstName = 'First name is required'
        if (!billingLastName?.trim()) errors.billingLastName = 'Last name is required'
        if (!billingAddress1?.trim()) errors.billingAddress1 = 'Address is required'
        if (!billingCity?.trim()) errors.billingCity = 'City is required'
        if (!billingState?.trim()) errors.billingState = 'State is required'
        if (!billingZip?.trim()) errors.billingZip = 'ZIP code is required'
      }
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        setIsSubmitting(false)
        showToast('Please fix the errors below', 'error')
        // Scroll to first error
        const firstErrorField = Object.keys(errors)[0]
        const element = document.querySelector(`[name="${firstErrorField}"]`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.focus()
        }
        return
      }
      
      const result = await createOrderAction(formData)

      if (result.success) {
        showToast('Order created successfully!', 'success')
        // Redirect based on payment method
        if (result.paymentMethod === 'paypal' && result.paymentResult?.approvalUrl) {
          window.location.href = result.paymentResult.approvalUrl
        } else {
          router.push(result.redirectUrl)
        }
      } else {
        showToast(result.error || 'Failed to create order', 'error')
        setIsSubmitting(false)
      }
    } catch (err) {
      showToast(err.message || 'An error occurred', 'error')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Items Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Order Items</h2>
            <div className="space-y-4">
              {cart.items?.map((item, index) => {
                const product = item.product
                const image = product?.images?.find(img => img.isPrimary) || product?.images?.[0]
                return (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    {image && (
                      <div className="w-20 h-20 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={image.url}
                          alt={image.alt || product?.name || 'Product'}
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized={image.url.includes('unsplash.com')}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{product?.name || 'Product'}</h3>
                      <p className="text-sm text-gray-500">
                        {item.variant?.size} | {item.variant?.color}
                      </p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-sm">1</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" name="shippingFirstName" required error={fieldErrors.shippingFirstName} />
              <Input label="Last Name" name="shippingLastName" required error={fieldErrors.shippingLastName} />
              <Input label="Address Line 1" name="shippingAddress1" required error={fieldErrors.shippingAddress1} className="md:col-span-2" />
              <Input label="Address Line 2" name="shippingAddress2" className="md:col-span-2" />
              <Input label="City" name="shippingCity" required error={fieldErrors.shippingCity} />
              <Input label="State" name="shippingState" required error={fieldErrors.shippingState} />
              <Input label="ZIP Code" name="shippingZip" required error={fieldErrors.shippingZip} />
              <Input label="Country" name="shippingCountry" defaultValue="US" required />
              <Input label="Phone" name="shippingPhone" type="tel" className="md:col-span-2" />
              <Input label="Email" name="email" type="email" required error={fieldErrors.email} className="md:col-span-2" />
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-sm">2</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Billing Address</h2>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Same as shipping address</span>
              </label>
            </div>
            {!sameAsShipping ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" name="billingFirstName" required error={fieldErrors.billingFirstName} />
                <Input label="Last Name" name="billingLastName" required error={fieldErrors.billingLastName} />
                <Input label="Address Line 1" name="billingAddress1" required error={fieldErrors.billingAddress1} className="md:col-span-2" />
                <Input label="Address Line 2" name="billingAddress2" className="md:col-span-2" />
                <Input label="City" name="billingCity" required error={fieldErrors.billingCity} />
                <Input label="State" name="billingState" required error={fieldErrors.billingState} />
                <Input label="ZIP Code" name="billingZip" required error={fieldErrors.billingZip} />
                <Input label="Country" name="billingCountry" defaultValue="US" required />
                <Input label="Phone" name="billingPhone" type="tel" className="md:col-span-2" />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                Billing address will be the same as shipping address.
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-sm">3</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors bg-white">
                <input type="radio" name="paymentMethod" value="stripe" defaultChecked className="mr-3 w-4 h-4 text-primary-600" />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">Credit/Debit Card</span>
                  <p className="text-sm text-gray-500">Secure payment via Stripe</p>
                </div>
                <div className="ml-4">
                  <div className="flex gap-1">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                    <div className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                    <div className="w-8 h-5 bg-blue-900 rounded text-white text-xs flex items-center justify-center font-bold">A</div>
                  </div>
                </div>
              </label>
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors bg-white">
                <input type="radio" name="paymentMethod" value="paypal" className="mr-3 w-4 h-4 text-primary-600" />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">PayPal</span>
                  <p className="text-sm text-gray-500">Pay with your PayPal account</p>
                </div>
                <div className="ml-4">
                  <span className="text-2xl font-bold text-blue-600">PayPal</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700 cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-700 underline" target="_blank">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline" target="_blank">
                  Privacy Policy
                </Link>
                {fieldErrors.terms && (
                  <span className="block text-accent-600 text-xs mt-1">{fieldErrors.terms}</span>
                )}
              </label>
            </div>
            <Button type="submit" variant="trust" className="w-full" size="lg" disabled={isSubmitting || !acceptedTerms}>
              {isSubmitting ? 'Processing...' : 'Complete Order'}
            </Button>
          </div>
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({cart.items?.length || 0} items)</span>
              <span className="font-medium text-gray-900">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-900">Calculated at checkout</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-primary-600">${totals.subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900">Secure Checkout</p>
                <p className="text-xs text-blue-700 mt-1">Your payment information is encrypted and secure.</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>
              By placing your order, you agree to our{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-700 underline" target="_blank">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline" target="_blank">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
