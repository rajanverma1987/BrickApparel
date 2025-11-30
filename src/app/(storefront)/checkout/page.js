import connectDB from '../../../lib/db/mongoose'
import cartService from '../../../domain/services/CartService'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import CheckoutForm from '../../../components/storefront/CheckoutForm'

async function getCart() {
  await connectDB()

  const cookieStore = await cookies()
  const sessionId = cookieStore.get('sessionId')?.value

  if (!sessionId) {
    return null
  }

  return await cartService.getCart(sessionId)
}

export default async function CheckoutPage() {
  const cart = await getCart()

  if (!cart || !cart.items || cart.items.length === 0) {
    redirect('/cart')
  }

  // Serialize cart data to plain objects to prevent stack overflow
  const cartData = JSON.parse(JSON.stringify(cart))
  const totals = cartService.calculateCartTotal(cartData)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Review your order and complete your purchase</p>
      </div>
      <CheckoutForm cart={cartData} totals={totals} />
    </div>
  )
}

