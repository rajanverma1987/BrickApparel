import connectDB from '../../../lib/db/mongoose'
import transactionRepository from '../../../domain/repositories/TransactionRepository'
import orderRepository from '../../../domain/repositories/OrderRepository'
import { getAdminSession } from '../../../lib/auth/admin-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'

export default async function AdminPaymentsPage() {
  const admin = await getAdminSession()
  if (!admin) {
    redirect('/admin/login')
  }

  await connectDB()

  // Import models to ensure they're registered
  await import('../../../domain/models/Transaction')
  await import('../../../domain/models/Order')

  // Get all transactions with populated order data
  const transactions = await transactionRepository.findAll({}, { limit: 500 })
  const allTransactions = transactions.map(t => JSON.parse(JSON.stringify(t)))

  // Calculate summary statistics (amounts are stored in dollars, not cents)
  const totalRevenue = allTransactions
    .filter(t => t.status === 'captured')
    .reduce((sum, t) => sum + (t.amount || 0), 0)
  
  const pendingAmount = allTransactions
    .filter(t => t.status === 'pending' || t.status === 'authorized')
    .reduce((sum, t) => sum + (t.amount || 0), 0)
  
  const refundedAmount = allTransactions
    .filter(t => t.status === 'refunded')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const stripeCount = allTransactions.filter(t => t.provider === 'stripe').length
  const paypalCount = allTransactions.filter(t => t.provider === 'paypal').length

  const getStatusColor = (status) => {
    switch (status) {
      case 'captured':
        return 'bg-green-100 text-green-800'
      case 'authorized':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'refunded':
        return 'bg-purple-100 text-purple-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProviderBadge = (provider) => {
    if (provider === 'stripe') {
      return <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">Stripe</span>
    } else if (provider === 'paypal') {
      return <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">PayPal</span>
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">{provider}</span>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Payments & Collections</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Captured payments</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Authorized/Pending</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Refunded</h3>
          <p className="text-3xl font-bold text-purple-600">${refundedAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Total refunds</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold">{allTransactions.length}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stripeCount} Stripe, {paypalCount} PayPal
          </p>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
        {allTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allTransactions.map((transaction) => (
                  <tr key={transaction._id.toString()} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                      <div className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.order ? (
                        <Link
                          href={`/admin/orders/${transaction.order._id || transaction.order}`}
                          className="text-primary-600 hover:text-primary-900 font-medium"
                        >
                          {transaction.order.orderNumber || 'View Order'}
                        </Link>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getProviderBadge(transaction.provider)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                        {transaction.transactionId?.substring(0, 20)}...
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${(transaction.amount || 0).toFixed(2)}
                      <div className="text-xs text-gray-500 font-normal">
                        {transaction.currency?.toUpperCase() || 'USD'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.order && (
                        <Link
                          href={`/admin/orders/${transaction.order._id || transaction.order}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Order
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

