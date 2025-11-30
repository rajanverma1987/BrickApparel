import connectDB from '../../../../lib/db/mongoose'
import orderRepository from '../../../../domain/repositories/OrderRepository'
import Link from 'next/link'
import Card from '../../../../components/ui/Card'

export default async function OrdersPage() {
  await connectDB()

  // For now, this shows a message. In a real app, you'd get orders for the logged-in customer
  // const customerId = await getCustomerId() // Would come from session/auth
  // const orders = await orderRepository.findByCustomer(customerId)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Order History</h1>
        <Link href="/account">
          <button className="text-primary-600 hover:text-primary-800">Back to Account</button>
        </Link>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping to see your order history here.
          </p>
          <Link href="/products">
            <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Start Shopping
            </button>
          </Link>
        </div>
      </Card>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          <strong>Note:</strong> To view orders, please log in to your account. Guest orders can be accessed via the email link sent after checkout.
        </p>
      </div>
    </div>
  )
}

