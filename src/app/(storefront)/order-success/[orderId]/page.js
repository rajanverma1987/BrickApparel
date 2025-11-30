import connectDB from '../../../../lib/db/mongoose'
import orderService from '../../../../domain/services/OrderService'
import Link from 'next/link'
import Button from '../../../../components/ui/Button'

export default async function OrderSuccessPage({ params }) {
  await connectDB()

  const order = await orderService.getOrder(params.orderId)

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Number</span>
            <span className="font-semibold">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span className="font-semibold capitalize">{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total</span>
            <span className="font-semibold">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}

