import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getAdminSession } from '../../lib/auth/admin-auth'
import Link from 'next/link'
import AdminNavLink from '../../components/admin/AdminNavLink'
import { ToastProvider } from '../../components/ui/ToastProvider'
import ToastHandler from '../../components/admin/ToastHandler'

export default async function AdminLayout({ children }) {
  const admin = await getAdminSession()

  // If not authenticated, allow login page to render, redirect others to login
  // We'll check this in individual pages instead of layout to avoid redirect loops
  if (!admin) {
    // Just render children without nav - individual pages will handle redirects
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  return (
    <ToastProvider>
      <Suspense fallback={null}>
        <ToastHandler />
      </Suspense>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center flex-1">
                <Link 
                  href="/admin" 
                  className="flex items-center px-3 py-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-lg mr-2 text-sm">Admin</span>
                  <span className="hidden sm:inline">Panel</span>
                </Link>
                <div className="hidden md:ml-8 md:flex md:space-x-1">
                  <AdminNavLink href="/admin">Dashboard</AdminNavLink>
                  <AdminNavLink href="/admin/products">Products</AdminNavLink>
                  <AdminNavLink href="/admin/orders">Orders</AdminNavLink>
                  <AdminNavLink href="/admin/inventory">Inventory</AdminNavLink>
                  <AdminNavLink href="/admin/content">Content</AdminNavLink>
                  <AdminNavLink href="/admin/categories">Categories</AdminNavLink>
                  <AdminNavLink href="/admin/payments">Payments</AdminNavLink>
                  <AdminNavLink href="/admin/notifications">Notifications</AdminNavLink>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 text-sm font-semibold">
                        {admin.email?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium max-w-[150px] truncate">
                      {admin.email}
                    </span>
                  </div>
                </div>
                <form action="/admin/logout" method="POST">
                  <button 
                    type="submit" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}

