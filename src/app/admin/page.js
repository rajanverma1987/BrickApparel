import connectDB from '../../lib/db/mongoose'
import orderRepository from '../../domain/repositories/OrderRepository'
import productRepository from '../../domain/repositories/ProductRepository'
import notificationRepository from '../../domain/repositories/NotificationRepository'
import analyticsRepository from '../../domain/repositories/AnalyticsRepository'
import { getAdminSession } from '../../lib/auth/admin-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default async function AdminDashboard() {
  const admin = await getAdminSession()
  
  if (!admin) {
    redirect('/admin/login')
  }

  await connectDB()

  // Import models to ensure they're registered
  await import('../../domain/models/Order')
  await import('../../domain/models/Product')
  await import('../../domain/models/Customer')
  await import('../../domain/models/Guest')

  const [
    recentOrders,
    allOrders,
    totalProducts,
    unreadNotifications,
  ] = await Promise.all([
    orderRepository.findAll({}, { limit: 10 }),
    orderRepository.findAll({}),
    productRepository.findAll().then(products => products.length),
    notificationRepository.getUnreadCount(),
  ])

  const ordersData = allOrders.map(o => JSON.parse(JSON.stringify(o)))
  const totalOrders = ordersData.length
  const pendingOrders = ordersData.filter(o => o.status === 'pending').length
  const deliveredOrders = ordersData.filter(o => o.status === 'delivered').length
  
  // Calculate 30-day revenue from orders
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentOrders30Days = ordersData.filter(o => new Date(o.createdAt) >= thirtyDaysAgo)
  const totalRevenue = recentOrders30Days
    .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + (o.total || 0), 0)
  
  // Calculate today's revenue
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayOrders = ordersData.filter(o => new Date(o.createdAt) >= today)
  const todayRevenue = todayOrders
    .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + (o.total || 0), 0)

  const recentOrdersData = recentOrders.map(o => JSON.parse(JSON.stringify(o)))

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {admin.email?.split('@')[0] || 'Admin'}!</h1>
            <p className="text-primary-100">Here's what's happening with your store today.</p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-primary-200">Today's Revenue</p>
              <p className="text-3xl font-bold">${todayRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">30-Day Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${(totalRevenue / 100).toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Total Orders Card */}
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
              <p className="text-xs text-gray-500 mt-1">{pendingOrders} pending</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Total Products Card */}
        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
              <p className="text-xs text-gray-500 mt-1">Active products</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Notifications Card */}
        <Card className="border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Notifications</p>
              <p className="text-3xl font-bold text-gray-900">{unreadNotifications}</p>
              <p className="text-xs text-gray-500 mt-1">Unread</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/products/new">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary-500">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add New Product</h3>
                <p className="text-sm text-gray-500">Create a new product listing</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/admin/orders">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary-500">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View All Orders</h3>
                <p className="text-sm text-gray-500">Manage customer orders</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/admin/inventory">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary-500">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Inventory</h3>
                <p className="text-sm text-gray-500">Update stock levels</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-500 mt-1">Latest customer orders</p>
          </div>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        {recentOrdersData.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="mt-4 text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrdersData.map((order) => {
                  const customerEmail = order.customer?.email || order.guest?.email || 'Guest'
                  const statusColors = {
                    'delivered': 'bg-green-100 text-green-800',
                    'pending': 'bg-yellow-100 text-yellow-800',
                    'shipped': 'bg-blue-100 text-blue-800',
                    'cancelled': 'bg-red-100 text-red-800',
                    'refunded': 'bg-purple-100 text-purple-800',
                  }
                  const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800'
                  
                  return (
                    <tr key={order._id.toString()} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/admin/orders/${order._id}`} className="text-primary-600 hover:text-primary-800 font-medium">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {customerEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/admin/orders/${order._id}`}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

