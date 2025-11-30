import Link from 'next/link'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'

export default function AccountPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
        My Account
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/account/orders">
          <Card className="hover:shadow-xl transition-all cursor-pointer h-full transform hover:scale-105 border-2 border-transparent hover:border-primary-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Order History</h2>
              <p className="text-gray-600">View your past orders and track shipments</p>
            </div>
          </Card>
        </Link>

        <Link href="/account/profile">
          <Card className="hover:shadow-xl transition-all cursor-pointer h-full transform hover:scale-105 border-2 border-transparent hover:border-primary-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Profile</h2>
              <p className="text-gray-600">Manage your personal information</p>
            </div>
          </Card>
        </Link>

        <Link href="/account/addresses">
          <Card className="hover:shadow-xl transition-all cursor-pointer h-full transform hover:scale-105 border-2 border-transparent hover:border-primary-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-primary-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Addresses</h2>
              <p className="text-gray-600">Manage your shipping addresses</p>
            </div>
          </Card>
        </Link>
      </div>

      <div className="mt-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              You can view your order history, update your profile, and manage your addresses from this page.
            </p>
            <p className="text-gray-600">
              <strong>Note:</strong> Guest checkout orders can be accessed via the email link sent to you.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

