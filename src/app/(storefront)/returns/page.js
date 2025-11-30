import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Link from 'next/link'

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
          Returns & Exchanges
        </h1>
        <p className="text-gray-600 text-lg">
          Easy returns and exchanges within 30 days
        </p>
      </div>

      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">30-Day Return Policy</h2>
          <p className="text-gray-700 mb-4">
            We want you to love your purchase! If you're not completely satisfied, you can return or exchange any item within 30 days of delivery.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✓ Eligible Items</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Unworn items</li>
                <li>• Original tags attached</li>
                <li>• Original packaging</li>
                <li>• No signs of wear or damage</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✗ Not Eligible</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Worn or damaged items</li>
                <li>• Items without tags</li>
                <li>• Final sale items</li>
                <li>• Personalized items</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">How to Return</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Initiate Return</h3>
                <p className="text-gray-600">
                  Log into your account, go to Order History, and click "Return" on the order you'd like to return.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-secondary-400 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Pack Your Items</h3>
                <p className="text-gray-600">
                  Place the items in their original packaging with tags attached. Include the return form in the package.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-primary-400 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Ship It Back</h3>
                <p className="text-gray-600">
                  Use the prepaid return label provided. Drop off at any authorized shipping location.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                <span className="text-white font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Get Refunded</h3>
                <p className="text-gray-600">
                  Once we receive and process your return (3-5 business days), you'll receive a refund to your original payment method.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Exchanges</h2>
          <p className="text-gray-600 mb-4">
            Need a different size or color? Exchanges are easy! Follow the same return process and select "Exchange" instead of "Return" when initiating your request.
          </p>
          <div className="bg-primary-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Note:</strong> If the item you want to exchange to is out of stock, we'll process a refund instead. You can then place a new order when the item is back in stock.
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Refund Processing</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Processing Time</h3>
              <p className="text-gray-600">
                Returns are typically processed within 3-5 business days after we receive your package.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Refund Method</h3>
              <p className="text-gray-600">
                Refunds are issued to your original payment method. Credit card refunds may take 5-10 business days to appear on your statement.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Shipping Costs</h3>
              <p className="text-gray-600">
                Original shipping costs are non-refundable unless the return is due to our error or a defective item.
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-accent-50 to-secondary-50 border-2 border-accent-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Need Help?</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about returns or exchanges, our customer service team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact">
              <Button className="w-full sm:w-auto">Contact Us</Button>
            </Link>
            <Link href="/account/orders">
              <Button variant="outline" className="w-full sm:w-auto">View Order History</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

