import connectDB from '../../../lib/db/mongoose'
import cartService from '../../../domain/services/CartService'
import { cookies } from 'next/headers'
import { generateSessionId } from '../../../lib/auth/session'
import Image from 'next/image'
import Button from '../../../components/ui/Button'
import Link from 'next/link'
import CartActions from '../../../components/storefront/CartActions'

async function getCart() {
  await connectDB()

  const cookieStore = await cookies()
  let sessionId = cookieStore.get('sessionId')?.value

  if (!sessionId) {
    return null
  }

  const cart = await cartService.getCart(sessionId)
  return cart
}

export default async function CartPage() {
  const cart = await getCart()

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Add some items to get started!</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  // Serialize cart data to plain objects to prevent stack overflow
  const cartData = JSON.parse(JSON.stringify(cart))
  const totals = cartService.calculateCartTotal(cartData)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartData.items.map((item, index) => {
            const product = item.product
            
            // Skip items with missing products
            if (!product) {
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 text-gray-500">Product no longer available</h3>
                    <p className="text-gray-600 mb-2">
                      Size: {item.variant?.size || 'N/A'} | Color: {item.variant?.color || 'N/A'}
                    </p>
                    <form action={removeFromCartAction.bind(null, index)}>
                      <Button type="submit" variant="danger" size="sm">Remove</Button>
                    </form>
                  </div>
                </div>
              )
            }
            
            const image = product.images?.find(img => img.isPrimary) || product.images?.[0]
            
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-4">
                {image && (
                  <div className="w-full sm:w-32 h-32 relative flex-shrink-0">
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="128px"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{product.name || 'Unknown Product'}</h3>
                  <p className="text-gray-600 mb-2">
                    Size: {item.variant?.size || 'N/A'} | Color: {item.variant?.color || 'N/A'}
                  </p>
                  <p className="text-primary-600 font-bold text-lg mb-4">
                    ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <CartActions itemIndex={index} currentQuantity={item.quantity} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout" className="block">
              <Button variant="trust" className="w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

