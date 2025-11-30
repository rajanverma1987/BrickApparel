import Link from 'next/link'
import Card from '../../../../components/ui/Card'
import Button from '../../../../components/ui/Button'

export default function AddressesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Addresses</h1>
        <Link href="/account">
          <button className="text-primary-600 hover:text-primary-800">Back to Account</button>
        </Link>
      </div>

      <div className="mb-6">
        <Button>Add New Address</Button>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No Saved Addresses</h2>
          <p className="text-gray-600 mb-6">
            You haven't saved any addresses yet. Add an address to make checkout faster.
          </p>
          <Button>Add Address</Button>
        </div>
      </Card>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          <strong>Note:</strong> To manage addresses, please log in to your account.
        </p>
      </div>
    </div>
  )
}

