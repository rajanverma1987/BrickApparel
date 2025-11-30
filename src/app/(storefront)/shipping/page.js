import Card from '../../../components/ui/Card'

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
          Shipping Information
        </h1>
        <p className="text-gray-600 text-lg">
          Everything you need to know about shipping your orders
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Shipping Options</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Standard Shipping</h3>
              <p className="text-gray-600 mb-2">5-7 business days</p>
              <p className="text-primary-600 font-semibold">$10.00</p>
            </div>
            <div className="border-l-4 border-accent-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Express Shipping</h3>
              <p className="text-gray-600 mb-2">2-3 business days</p>
              <p className="text-accent-600 font-semibold">$20.00</p>
            </div>
            <div className="border-l-4 border-secondary-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Free Shipping</h3>
              <p className="text-gray-600 mb-2">5-7 business days (Orders over $100)</p>
              <p className="text-secondary-600 font-semibold">FREE</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Shipping Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Domestic Shipping</h3>
              <p className="text-gray-600">
                We ship to all 50 US states. Standard shipping typically takes 5-7 business days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">International Shipping</h3>
              <p className="text-gray-600">
                We ship to over 50 countries worldwide. International orders typically take 10-21 business days.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Processing</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Order Placed</h3>
                <p className="text-gray-600">Your order is received and confirmed</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Processing</h3>
                <p className="text-gray-600">We're preparing your order for shipment (1-2 business days)</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Shipped</h3>
                <p className="text-gray-600">Your order is on its way! You'll receive a tracking number</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Delivered</h3>
                <p className="text-gray-600">Your order has arrived at its destination</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Tracking Your Order</h2>
          <p className="text-gray-600 mb-4">
            Once your order ships, you'll receive an email with a tracking number. You can also track your order by:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Logging into your account and viewing order history</li>
            <li>Using the tracking link in your shipping confirmation email</li>
            <li>Contacting our customer service team</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

