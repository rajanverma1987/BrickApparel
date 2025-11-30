import Link from 'next/link'
import Image from 'next/image'
import { cookies } from 'next/headers'
import connectDB from '../../lib/db/mongoose'
import cartService from '../../domain/services/CartService'

async function getCartCount() {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value
    
    if (!sessionId) return 0
    
    const cart = await cartService.getCart(sessionId)
    if (!cart || !cart.items) return 0
    
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  } catch (error) {
    return 0
  }
}

export default async function Header() {
  const cartCount = await getCartCount()

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-primary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
            <Image
              src="/logo.webp"
              alt="Brick Apparel Logo"
              width={140}
              height={45}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-primary-600 font-semibold transition-colors relative group py-2"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link 
              href="/products?category=mens" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group py-2"
            >
              Men
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/products?category=womens" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group py-2"
            >
              Women
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/products?category=shoes" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group py-2"
            >
              Shoes
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/products?category=accessories" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group py-2"
            >
              Accessories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Account Icon */}
            <Link 
              href="/account" 
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary-50 transition-colors group"
              title="Account"
            >
              <svg className="w-6 h-6 text-gray-700 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Cart Icon with Badge */}
            <Link 
              href="/cart" 
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary-50 transition-colors group"
              title="Shopping Cart"
            >
              <svg className="w-6 h-6 text-gray-700 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary-50 transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-gray-100 py-4">
          <nav className="flex flex-col space-y-3">
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-primary-50"
            >
              All Products
            </Link>
            <div className="grid grid-cols-2 gap-2 px-4">
              <Link 
                href="/products?category=mens" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-primary-50 text-center"
              >
                Men
              </Link>
              <Link 
                href="/products?category=womens" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-primary-50 text-center"
              >
                Women
              </Link>
              <Link 
                href="/products?category=shoes" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-primary-50 text-center"
              >
                Shoes
              </Link>
              <Link 
                href="/products?category=accessories" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-primary-50 text-center"
              >
                Accessories
              </Link>
            </div>
            <Link 
              href="/account" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-primary-50"
            >
              My Account
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
