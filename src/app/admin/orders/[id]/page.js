import connectDB from '../../../../lib/db/mongoose'
import orderRepository from '../../../../domain/repositories/OrderRepository'
import { getAdminSession } from '../../../../lib/auth/admin-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../../components/ui/Button'
import Card from '../../../../components/ui/Card'
import Image from 'next/image'
import OrderStatusForm from '../../../../components/admin/OrderStatusForm'
import { PrintLabelButtonFull } from '../../../../components/admin/PrintLabelButton'

async function updateOrderStatusAction(formData) {
  'use server'
  
  await connectDB()
  
  // Import models to ensure they're registered
  await import('../../../../domain/models/Order')
  
  const orderId = formData.get('orderId')
  const status = formData.get('status')
  const trackingNumber = formData.get('trackingNumber')?.trim() || null
  const notes = formData.get('notes')?.trim() || null
  
  try {
    const updateData = { status }
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber
    }
    if (notes) {
      updateData.notes = notes
    }
    
    await orderRepository.update(orderId, updateData)
  } catch (error) {
    // If update fails, return error (don't redirect)
    return { success: false, error: error.message }
  }
  
  // Redirect after successful update (this will throw NEXT_REDIRECT which is expected)
  redirect(`/admin/orders/${orderId}?toast=1&type=success&message=${encodeURIComponent('Order status updated successfully')}`)
}

export default async function AdminOrderDetailPage({ params }) {
  const admin = await getAdminSession()
  if (!admin) {
    redirect('/admin/login')
  }

  await connectDB()

  // Import models to ensure they're registered
  await import('../../../../domain/models/Order')
  await import('../../../../domain/models/Product')
  await import('../../../../domain/models/Customer')
  await import('../../../../domain/models/Guest')
  await import('../../../../domain/models/Transaction')

  // Await params if it's a promise (Next.js 15+)
  const resolvedParams = await params
  const orderId = resolvedParams.id

  let order
  try {
    order = await orderRepository.findById(orderId)
    if (!order) {
      redirect(`/admin/orders?toast=1&type=error&message=${encodeURIComponent('Order not found')}`)
    }
    order = JSON.parse(JSON.stringify(order))
  } catch (error) {
    console.error('Error loading order:', error)
    redirect(`/admin/orders?toast=1&type=error&message=${encodeURIComponent(error.message || 'Order not found')}`)
  }

  const customerEmail = order.customer?.email || order.guest?.email || 'Guest'
  const customerName = order.customer?.firstName && order.customer?.lastName
    ? `${order.customer.firstName} ${order.customer.lastName}`
    : order.guest?.email || 'Guest'

  return (
    <div>
          <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/orders" className="text-primary-600 hover:text-primary-800 mb-2 inline-block">
            ← Back to Orders
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
            <span className={`px-3 py-1 text-sm rounded-full font-medium ${
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'refunded' ? 'bg-red-100 text-red-800' :
              order.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
              order.status === 'captured' ? 'bg-purple-100 text-purple-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => {
                const product = item.product
                const image = product?.images?.find(img => img.isPrimary) || product?.images?.[0]
                return (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
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
                      <h3 className="font-medium text-gray-900">{item.productName || product?.name || 'Product'}</h3>
                      <p className="text-sm text-gray-500">
                        {item.variant?.size} | {item.variant?.color}
                      </p>
                      <p className="text-sm text-gray-500">SKU: {item.variant?.sku || 'N/A'}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${item.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Shipping Address */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="text-gray-700">
              <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && <p className="mt-2">Phone: {order.shippingAddress.phone}</p>}
            </div>
          </Card>

          {/* Billing Address */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
            <div className="text-gray-700">
              <p className="font-medium">{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
              <p>{order.billingAddress.addressLine1}</p>
              {order.billingAddress.addressLine2 && <p>{order.billingAddress.addressLine2}</p>}
              <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
              <p>{order.billingAddress.country}</p>
              {order.billingAddress.phone && <p className="mt-2">Phone: {order.billingAddress.phone}</p>}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Info */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Customer:</span>
                <p className="font-medium">{customerName}</p>
                <p className="text-gray-500">{customerEmail}</p>
              </div>
              <div>
                <span className="text-gray-600">Order Date:</span>
                <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Method:</span>
                <p className="font-medium capitalize">{order.paymentMethod || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Status:</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  order.paymentStatus === 'captured' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                  order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.trackingNumber && (
                <div>
                  <span className="text-gray-600">Tracking Number:</span>
                  <p className="font-medium">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Print Label */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Shipping Label</h2>
            <PrintLabelButtonFull orderId={order._id.toString()} />
          </Card>

          {/* Update Order Status */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
            <OrderStatusForm
              action={updateOrderStatusAction}
              orderId={order._id.toString()}
              currentStatus={order.status}
              trackingNumber={order.trackingNumber}
              notes={order.notes}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

