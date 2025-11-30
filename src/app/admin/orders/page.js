import connectDB from '../../../lib/db/mongoose'
import orderRepository from '../../../domain/repositories/OrderRepository'
import { getAdminSession } from '../../../lib/auth/admin-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '../../../components/ui/Card'
import PrintLabelButton from '../../../components/admin/PrintLabelButton'

export default async function AdminOrdersPage() {
  const admin = await getAdminSession()
  
  if (!admin) {
    redirect('/admin/login')
  }

  await connectDB()

  // Import models to ensure they're registered
  await import('../../../domain/models/Order')
  await import('../../../domain/models/Customer')
  await import('../../../domain/models/Guest')
  await import('../../../domain/models/Product')
  await import('../../../domain/models/Transaction')

  const orders = await orderRepository.findAll()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id.toString()}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer?.email || order.guest?.email || 'Guest'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'refunded' ? 'bg-red-100 text-red-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/orders/${order._id}`} className="text-primary-600 hover:text-primary-900">
                        View
                      </Link>
                      <span className="text-gray-300">|</span>
                      <PrintLabelButton orderId={order._id.toString()} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

