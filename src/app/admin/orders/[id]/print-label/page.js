import connectDB from '../../../../../lib/db/mongoose'
import orderRepository from '../../../../../domain/repositories/OrderRepository'
import { getAdminSession } from '../../../../../lib/auth/admin-auth'
import { redirect } from 'next/navigation'

export default async function PrintLabelPage({ params }) {
  const admin = await getAdminSession()
  if (!admin) {
    redirect('/admin/login')
  }

  await connectDB()

  // Import models to ensure they're registered
  await import('../../../../../domain/models/Order')
  await import('../../../../../domain/models/Product')
  await import('../../../../../domain/models/Customer')
  await import('../../../../../domain/models/Guest')
  await import('../../../../../domain/models/Transaction')

  // Await params if it's a promise (Next.js 15+)
  const resolvedParams = await params
  const orderId = resolvedParams.id

  if (!orderId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Invalid order ID</h1>
      </div>
    )
  }

  let order
  try {
    order = await orderRepository.findById(orderId)
    if (!order) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold">Order not found</h1>
          <p className="text-gray-600 mt-2">Order ID: {orderId}</p>
        </div>
      )
    }
    order = JSON.parse(JSON.stringify(order))
  } catch (error) {
    console.error('Error loading order:', error)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Error loading order</h1>
        <p className="text-gray-600 mt-2">Order ID: {orderId}</p>
        <p className="text-red-600 mt-2 text-sm">{error.message}</p>
      </div>
    )
  }

  const shippingAddress = order.shippingAddress
  const storeAddress = {
    name: 'Brick Apparel',
    addressLine1: '123 Fashion Street',
    addressLine2: 'Suite 100',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: 4in 6in;
            margin: 0.15in;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 4in !important;
            height: 6in !important;
            overflow: hidden !important;
          }
          /* Hide admin navigation */
          nav {
            display: none !important;
          }
          /* Hide print instructions */
          .no-print {
            display: none !important;
          }
          /* Reset main container */
          main {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 4in !important;
            background: white !important;
            height: 6in !important;
            overflow: hidden !important;
          }
          /* Show print content */
          .print-page {
            display: block !important;
            margin: 0 !important;
            padding: 0.1in !important;
            background: white !important;
            width: 4in !important;
            height: 6in !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
          }
          .print-label {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
            color: black !important;
            font-size: 10pt !important;
            page-break-inside: avoid !important;
            overflow: hidden !important;
          }
          .print-label > * {
            display: block !important;
            color: black !important;
            background: transparent !important;
            margin: 0 !important;
          }
          .print-label .mb-6 {
            margin-bottom: 0.2in !important;
          }
          .print-label .mb-4 {
            margin-bottom: 0.15in !important;
          }
          .print-label .mb-2 {
            margin-bottom: 0.1in !important;
          }
          .print-label .mb-1 {
            margin-bottom: 0.05in !important;
          }
          .print-label .mt-2 {
            margin-top: 0.1in !important;
          }
          .print-label .mt-4 {
            margin-top: 0.15in !important;
          }
          .print-label .p-4 {
            padding: 0.1in !important;
          }
          .print-label .pt-2 {
            padding-top: 0.1in !important;
          }
          .print-label .pt-4 {
            padding-top: 0.15in !important;
          }
          .print-label .text-xs {
            font-size: 8pt !important;
          }
          .print-label .text-sm {
            font-size: 9pt !important;
          }
          .print-label .text-base {
            font-size: 10pt !important;
          }
          .print-label .text-lg {
            font-size: 12pt !important;
          }
          .print-label .flex {
            display: flex !important;
          }
          .print-label .space-y-1 > * + * {
            margin-top: 0.05in !important;
          }
        }
        @media screen {
          .print-label {
            max-width: 4in;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 0.5in;
          }
        }
      `}} />
      <div className="print-page" style={{ background: 'white', padding: '0.25in', margin: 0 }}>
        <div className="print-label" style={{ display: 'block', visibility: 'visible', color: 'black', background: 'white' }}>
        {/* Return Address (Top Left) */}
        <div className="mb-6 text-xs">
          <div className="font-semibold mb-1">RETURN ADDRESS:</div>
          <div>{storeAddress.name}</div>
          <div>{storeAddress.addressLine1}</div>
          {storeAddress.addressLine2 && <div>{storeAddress.addressLine2}</div>}
          <div>{storeAddress.city}, {storeAddress.state} {storeAddress.zipCode}</div>
          <div>{storeAddress.country}</div>
        </div>

        {/* Shipping Address (Center) */}
        <div className="mb-6 border-2 border-dashed border-gray-400 p-4">
          <div className="text-sm font-semibold mb-2">SHIP TO:</div>
          <div className="text-lg font-bold mb-1">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </div>
          <div className="text-base">{shippingAddress.addressLine1}</div>
          {shippingAddress.addressLine2 && (
            <div className="text-base">{shippingAddress.addressLine2}</div>
          )}
          <div className="text-base">
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
          </div>
          <div className="text-base">{shippingAddress.country}</div>
          {shippingAddress.phone && (
            <div className="text-sm mt-2">Phone: {shippingAddress.phone}</div>
          )}
        </div>

        {/* Order Information */}
        <div className="mb-4 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="font-semibold">Order #:</span>
            <span>{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Date:</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          {order.trackingNumber && (
            <div className="flex justify-between">
              <span className="font-semibold">Tracking:</span>
              <span>{order.trackingNumber}</span>
            </div>
          )}
        </div>

        {/* Items Summary */}
        <div className="mb-4 text-xs border-t border-gray-300 pt-2">
          <div className="font-semibold mb-1">ITEMS ({order.items?.length || 0}):</div>
          {order.items?.slice(0, 2).map((item, index) => (
            <div key={index} className="text-xs">
              • {item.productName?.substring(0, 25)}{item.productName?.length > 25 ? '...' : ''} ({item.variant?.size}/{item.variant?.color}) x{item.quantity}
            </div>
          ))}
          {order.items?.length > 2 && (
            <div className="text-xs italic">+ {order.items.length - 2} more</div>
          )}
        </div>

        {/* Barcode Area (for manual or future barcode implementation) */}
        <div className="mt-4 pt-4 border-t border-gray-300 text-center">
          <div className="text-xs font-mono font-semibold tracking-wider">
            {order.orderNumber}
          </div>
          <div className="text-xs text-gray-500 mt-1">Order Number</div>
        </div>
        </div>

        {/* Print Instructions (only visible on screen) */}
        <div className="no-print mt-8 text-center text-gray-600">
          <p className="mb-4">This label is formatted for 4" x 6" shipping labels.</p>
          <p>Use your browser&apos;s print dialog (Ctrl+P / Cmd+P) to print.</p>
        </div>
      </div>
    </>
  )
}

